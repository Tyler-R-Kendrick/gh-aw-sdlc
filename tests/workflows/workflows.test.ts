import { describe, it, expect, beforeAll } from 'vitest'
import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const REPO_ROOT = resolve(__dirname, '../..')
const WORKFLOWS_DIR = resolve(REPO_ROOT, '.github/workflows')
const EVENTS_DIR = resolve(__dirname, 'events')

const WORKFLOW_NAMES = ['snyk-security-triage', 'snyk-fix-pr', 'snyk-review-manage'] as const

function readWorkflow(name: string): string {
  return readFileSync(resolve(WORKFLOWS_DIR, `${name}.md`), 'utf-8')
}

function readLockFile(name: string): string {
  return readFileSync(resolve(WORKFLOWS_DIR, `${name}.lock.yml`), 'utf-8')
}

function run(cmd: string): string {
  return execSync(cmd, { cwd: REPO_ROOT, encoding: 'utf-8', timeout: 30_000, stdio: ['pipe', 'pipe', 'pipe'] })
}

function runSafe(cmd: string): string {
  try {
    return execSync(cmd, { cwd: REPO_ROOT, encoding: 'utf-8', timeout: 30_000, stdio: ['pipe', 'pipe', 'pipe'] })
  } catch (e: any) {
    return (e.stdout ?? '') + (e.stderr ?? '')
  }
}

function hasDocker(): boolean {
  try {
    execSync('docker info', { timeout: 5_000, stdio: ['pipe', 'pipe', 'pipe'] })
    return true
  } catch {
    return false
  }
}

// ─── Prerequisites ───────────────────────────────────────────────────────────

describe('Prerequisites', () => {
  it('act is installed', () => {
    const output = run('act --version')
    expect(output).toMatch(/act version/)
  })

  it('gh-aw CLI is installed', () => {
    const output = run('gh aw version')
    expect(output).toMatch(/gh aw version/)
  })
})

// ─── Workflow Markdown Files ─────────────────────────────────────────────────

describe('Workflow files exist', () => {
  it.each(WORKFLOW_NAMES)('%s.md exists', (name) => {
    expect(existsSync(resolve(WORKFLOWS_DIR, `${name}.md`))).toBe(true)
  })

  it.each(WORKFLOW_NAMES)('%s.lock.yml exists', (name) => {
    expect(existsSync(resolve(WORKFLOWS_DIR, `${name}.lock.yml`))).toBe(true)
  })
})

// ─── Compilation ─────────────────────────────────────────────────────────────

describe('Compilation', () => {
  let compileOutput: string

  beforeAll(() => {
    compileOutput = runSafe('gh aw compile --no-emit 2>&1')
  })

  it('compiles without errors', () => {
    expect(compileOutput).toContain('0 error(s)')
  })

  it('detects all 3 workflows', () => {
    expect(compileOutput).toContain('Compiled 3 workflow(s)')
  })
})

// ─── Frontmatter Validation ─────────────────────────────────────────────────

describe('Frontmatter: snyk-security-triage', () => {
  let content: string
  beforeAll(() => { content = readWorkflow('snyk-security-triage') })

  it('has schedule trigger', () => {
    expect(content).toMatch(/schedule/)
  })

  it('has workflow_dispatch trigger', () => {
    expect(content).toMatch(/workflow_dispatch/)
  })

  it('uses copilot engine', () => {
    expect(content).toMatch(/engine:\s*copilot/)
  })
})

describe('Frontmatter: snyk-fix-pr', () => {
  let content: string
  beforeAll(() => { content = readWorkflow('snyk-fix-pr') })

  it('triggers on issues event', () => {
    expect(content).toMatch(/issues/)
  })

  it('triggers on labeled type', () => {
    expect(content).toMatch(/labeled/)
  })

  it('has concurrency control', () => {
    expect(content).toMatch(/concurrency/)
  })

  it('uses copilot engine', () => {
    expect(content).toMatch(/engine:\s*copilot/)
  })
})

describe('Frontmatter: snyk-review-manage', () => {
  let content: string
  beforeAll(() => { content = readWorkflow('snyk-review-manage') })

  it('triggers on pull_request_review', () => {
    expect(content).toMatch(/pull_request_review/)
  })

  it('triggers on submitted type', () => {
    expect(content).toMatch(/submitted/)
  })

  it('uses copilot engine', () => {
    expect(content).toMatch(/engine:\s*copilot/)
  })
})

// ─── Lock File Structure ─────────────────────────────────────────────────────

describe.each(WORKFLOW_NAMES)('Lock file structure: %s', (name) => {
  let lock: string
  beforeAll(() => { lock = readLockFile(name) })

  it('has activation job', () => {
    expect(lock).toMatch(/^\s{2}activation:/m)
  })

  it('has agent job', () => {
    expect(lock).toMatch(/^\s{2}agent:/m)
  })

  it('engine is copilot', () => {
    expect(lock).toContain('GH_AW_INFO_ENGINE_ID: "copilot"')
  })

  it('has strict mode enabled', () => {
    expect(lock).toContain('"strict":true')
  })

  it('validates COPILOT_GITHUB_TOKEN', () => {
    expect(lock).toContain('COPILOT_GITHUB_TOKEN')
  })

  it('has pinned checkout action (SHA)', () => {
    expect(lock).toMatch(/actions\/checkout@[a-f0-9]{40}/)
  })

  it('imports correct .md file', () => {
    expect(lock).toContain(`runtime-import .github/workflows/${name}.md`)
  })
})

// ─── Trigger-Specific Lock File Validation ───────────────────────────────────

describe('Lock file triggers', () => {
  it('snyk-security-triage has schedule + workflow_dispatch', () => {
    const lock = readLockFile('snyk-security-triage')
    expect(lock).toMatch(/schedule:/)
    expect(lock).toMatch(/workflow_dispatch:/)
  })

  it('snyk-fix-pr triggers on issues:labeled', () => {
    const lock = readLockFile('snyk-fix-pr')
    expect(lock).toMatch(/issues:/)
    expect(lock).toMatch(/labeled/)
  })

  it('snyk-fix-pr has issue-scoped concurrency', () => {
    const lock = readLockFile('snyk-fix-pr')
    expect(lock).toMatch(/snyk-fix-.*github\.event\.issue\.number/)
  })

  it('snyk-review-manage triggers on pull_request_review:submitted', () => {
    const lock = readLockFile('snyk-review-manage')
    expect(lock).toMatch(/pull_request_review:/)
    expect(lock).toMatch(/submitted/)
  })
})

// ─── act Workflow Parsing ────────────────────────────────────────────────────

describe('act workflow parsing', () => {
  it.each(WORKFLOW_NAMES)('act -l parses %s.lock.yml and finds activation + agent jobs', (name) => {
    const output = runSafe(`act -l -W ${WORKFLOWS_DIR}/${name}.lock.yml 2>&1`)
    expect(output).toContain('activation')
    expect(output).toContain('agent')
  })
})

// ─── act Event Trigger Matching ──────────────────────────────────────────────

describe('act event trigger isolation', () => {
  it('snyk-security-triage does NOT trigger on issues', () => {
    const output = runSafe(`act -l issues -W ${WORKFLOWS_DIR}/snyk-security-triage.lock.yml 2>&1`)
    expect(output).not.toMatch(/activation\s/)
  })

  it('snyk-fix-pr does NOT trigger on pull_request_review', () => {
    const output = runSafe(`act -l pull_request_review -W ${WORKFLOWS_DIR}/snyk-fix-pr.lock.yml 2>&1`)
    expect(output).not.toMatch(/activation\s/)
  })

  it('snyk-review-manage does NOT trigger on issues', () => {
    const output = runSafe(`act -l issues -W ${WORKFLOWS_DIR}/snyk-review-manage.lock.yml 2>&1`)
    expect(output).not.toMatch(/activation\s/)
  })
})

// ─── act Dry-Run (requires Docker) ──────────────────────────────────────────

describe.runIf(hasDocker())('act dry-run (Docker available)', () => {
  it('snyk-security-triage dry-runs on workflow_dispatch', () => {
    const output = runSafe(
      `act -n workflow_dispatch -W ${WORKFLOWS_DIR}/snyk-security-triage.lock.yml 2>&1`
    )
    expect(output).toMatch(/activation|Stage/i)
  })

  it('snyk-fix-pr dry-runs on issues with event payload', () => {
    const output = runSafe(
      `act -n issues -W ${WORKFLOWS_DIR}/snyk-fix-pr.lock.yml -e ${EVENTS_DIR}/issue-labeled.json 2>&1`
    )
    expect(output).toMatch(/activation|pre_activation|Stage/i)
  })

  it('snyk-review-manage dry-runs on approved review', () => {
    const output = runSafe(
      `act -n pull_request_review -W ${WORKFLOWS_DIR}/snyk-review-manage.lock.yml -e ${EVENTS_DIR}/pr-review-approved.json 2>&1`
    )
    expect(output).toMatch(/activation|pre_activation|Stage/i)
  })

  it('snyk-review-manage dry-runs on changes_requested review', () => {
    const output = runSafe(
      `act -n pull_request_review -W ${WORKFLOWS_DIR}/snyk-review-manage.lock.yml -e ${EVENTS_DIR}/pr-review-changes-requested.json 2>&1`
    )
    expect(output).toMatch(/activation|pre_activation|Stage/i)
  })
})

// ─── Copilot Setup Steps ────────────────────────────────────────────────────

describe('Copilot setup steps', () => {
  let content: string
  beforeAll(() => {
    content = readFileSync(resolve(WORKFLOWS_DIR, 'copilot-setup-steps.yml'), 'utf-8')
  })

  it('installs Snyk CLI', () => {
    expect(content).toContain('npm install -g snyk')
  })

  it('runs npm ci', () => {
    expect(content).toContain('npm ci')
  })

  it('sets up Node.js', () => {
    expect(content).toContain('node-version')
  })
})

// ─── Workflow Content Validation ─────────────────────────────────────────────

describe('Workflow instructions: snyk-security-triage', () => {
  let content: string
  beforeAll(() => { content = readWorkflow('snyk-security-triage') })

  it('instructs agent to run snyk test', () => {
    expect(content).toMatch(/snyk test/i)
  })

  it('instructs duplicate checking', () => {
    expect(content).toMatch(/duplicate|existing.*issue|already.*exist/i)
  })
})

describe('Workflow instructions: snyk-fix-pr', () => {
  let content: string
  beforeAll(() => { content = readWorkflow('snyk-fix-pr') })

  it('instructs creating draft PR', () => {
    expect(content).toMatch(/draft/i)
  })

  it('instructs running tests', () => {
    expect(content).toMatch(/npm test/i)
  })

  it('instructs requesting Copilot review', () => {
    expect(content).toMatch(/copilot/i)
    expect(content).toMatch(/review/i)
  })
})

describe('Workflow instructions: snyk-review-manage', () => {
  let content: string
  beforeAll(() => { content = readWorkflow('snyk-review-manage') })

  it('uses @copilot for feedback relay', () => {
    expect(content).toContain('@copilot')
  })

  it('assigns Tyler-R-Kendrick as reviewer', () => {
    expect(content).toContain('Tyler-R-Kendrick')
  })

  it('handles both approved and changes_requested states', () => {
    expect(content).toMatch(/approved/i)
    expect(content).toMatch(/changes_requested|changes requested|requests changes/i)
  })

  it('converts draft to ready with gh pr ready', () => {
    expect(content).toMatch(/gh pr ready/i)
  })
})
