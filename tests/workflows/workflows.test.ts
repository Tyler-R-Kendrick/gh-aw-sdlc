import { beforeAll, describe, expect, it } from 'vitest'
import { execFileSync, spawnSync } from 'child_process'
import { existsSync, readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'

const REPO_ROOT = resolve(__dirname, '../..')
const WORKFLOWS_DIR = resolve(REPO_ROOT, '.github/workflows')
const DOCS_DIR = resolve(REPO_ROOT, 'docs')
const ISSUE_TEMPLATE_DIR = resolve(REPO_ROOT, '.github/ISSUE_TEMPLATE')
const HAS_ACT = /act version/i.test(runMerged('act', ['--version']))

const WORKFLOW_SPECS = [
  {
    name: 'issue-triage',
    classification: 'Adopt with light adaptation',
    loop: 'outer',
    source: 'gh-aw auto-triage-issues',
    triggerPatterns: [/issues:/, /opened/, /edited/, /schedule:/, /workflow_dispatch:/],
  },
  {
    name: 'pr-contribution-check',
    classification: 'Adapt',
    loop: 'inner',
    source: 'gh-aw contribution-check',
    triggerPatterns: [/pull_request:/, /opened/, /synchronize/, /ready_for_review/],
  },
  {
    name: 'ci-doctor',
    classification: 'Adopt',
    loop: 'inner',
    source: 'gh-aw ci-doctor',
    triggerPatterns: [/workflow_run:/, /workflow_dispatch:/],
  },
  {
    name: 'code-scanning-fixer',
    classification: 'Adopt, then lightly extend',
    loop: 'inner',
    source: 'gh-aw code-scanning-fixer',
    triggerPatterns: [/workflow_dispatch:/, /schedule:/],
  },
  {
    name: 'breaking-change-checker',
    classification: 'Adopt with policy adaptation',
    loop: 'inner + outer',
    source: 'gh-aw breaking-change-checker',
    triggerPatterns: [/schedule:/, /workflow_dispatch:/],
  },
  {
    name: 'architecture-guardian',
    classification: 'Adopt with repo-specific rules',
    loop: 'outer',
    source: 'gh-aw architecture-guardian',
    triggerPatterns: [/schedule:/, /workflow_dispatch:/],
  },
  {
    name: 'changeset-generator',
    classification: 'Adopt',
    loop: 'inner',
    source: 'gh-aw changeset',
    triggerPatterns: [/pull_request:/, /labeled/, /workflow_dispatch:/],
  },
  {
    name: 'daily-repo-status',
    classification: 'Adapt',
    loop: 'outer',
    source: 'GH-AW quick start pattern',
    triggerPatterns: [/schedule:/, /workflow_dispatch:/],
  },
  {
    name: 'merged-pr-report',
    classification: 'Adopt with repo-specific reporting adjustments',
    loop: 'outer',
    source: 'gh-aw copilot-pr-merged-report',
    triggerPatterns: [/schedule:/, /workflow_dispatch:/],
  },
  {
    name: 'resource-staleness-report',
    classification: 'Adopt',
    loop: 'outer',
    source: 'awesome-copilot resource-staleness-report',
    triggerPatterns: [/schedule:/, /workflow_dispatch:/],
  },
  {
    name: 'pr-duplicate-check',
    classification: 'Conditional adopt',
    loop: 'inner',
    source: 'awesome-copilot pr-duplicate-check',
    triggerPatterns: [/pull_request:/, /opened/, /synchronize/],
  },
] as const

const REQUIRED_DOCS = [
  'sdlc-agent-map.md',
  'inner-loop.md',
  'outer-loop.md',
  'repo-demo-scenarios.md',
  'operations.md',
]

const REQUIRED_ISSUE_TEMPLATES = [
  'bug-report.yml',
  'feature-request.yml',
  'security-report.yml',
  'architecture-review.yml',
]

function run(command: string, args: string[] = []): string {
  return execFileSync(command, args, {
    cwd: REPO_ROOT,
    encoding: 'utf-8',
    timeout: 60_000,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function runMerged(command: string, args: string[] = []): string {
  const result = spawnSync(command, args, {
    cwd: REPO_ROOT,
    encoding: 'utf-8',
    timeout: 60_000,
  })

  return (result.stdout ?? '') + (result.stderr ?? '')
}

function readWorkflow(name: string): string {
  return readFileSync(resolve(WORKFLOWS_DIR, `${name}.md`), 'utf-8')
}

function readLockFile(name: string): string {
  return readFileSync(resolve(WORKFLOWS_DIR, `${name}.lock.yml`), 'utf-8')
}

describe('Workflow prerequisites', () => {
  const ciWorkflow = readFileSync(resolve(WORKFLOWS_DIR, 'ci.yml'), 'utf-8')

  it('installs act in the CI workflow validation job', () => {
    expect(ciWorkflow).toMatch(/name:\s+Install act/)
    expect(ciWorkflow).toMatch(/act --version/)
  })

  it('gh-aw CLI is installed', () => {
    expect(runMerged('gh', ['aw', 'version'])).toMatch(/gh aw version/i)
  })
})

describe('Repository scaffolding', () => {
  it('includes the required workflow markdown files', () => {
    for (const { name } of WORKFLOW_SPECS) {
      expect(existsSync(resolve(WORKFLOWS_DIR, `${name}.md`))).toBe(true)
    }
  })

  it('includes the required lock files', () => {
    for (const { name } of WORKFLOW_SPECS) {
      expect(existsSync(resolve(WORKFLOWS_DIR, `${name}.lock.yml`))).toBe(true)
    }
  })

  it('contains the expected docs, templates, and architecture assets', () => {
    for (const doc of REQUIRED_DOCS) {
      expect(existsSync(resolve(DOCS_DIR, doc))).toBe(true)
    }

    expect(existsSync(resolve(DOCS_DIR, 'architecture/architecture-principles.md'))).toBe(true)
    expect(existsSync(resolve(REPO_ROOT, '.architecture.yml'))).toBe(true)
    expect(existsSync(resolve(REPO_ROOT, '.changeset/README.md'))).toBe(true)
    expect(existsSync(resolve(REPO_ROOT, '.github/PULL_REQUEST_TEMPLATE.md'))).toBe(true)
    expect(existsSync(resolve(REPO_ROOT, '.github/labels.yml'))).toBe(true)
    expect(existsSync(resolve(REPO_ROOT, 'CONTRIBUTING.md'))).toBe(true)
  })

  it('contains the issue templates required for intake and governance demos', () => {
    for (const template of REQUIRED_ISSUE_TEMPLATES) {
      expect(existsSync(resolve(ISSUE_TEMPLATE_DIR, template))).toBe(true)
    }
  })
})

describe('Workflow compilation', () => {
  let compileOutput = ''

  beforeAll(() => {
    compileOutput = runMerged('gh', ['aw', 'compile', '--no-emit'])
  })

  it('compiles without errors', () => {
    expect(compileOutput).toContain('0 error(s)')
  })

  it('compiles the full workflow inventory', () => {
    expect(compileOutput).toContain(`Compiled ${WORKFLOW_SPECS.length} workflow(s)`)
  })

  it('keeps only the expected markdown workflows in .github/workflows', () => {
    const markdownWorkflows = readdirSync(WORKFLOWS_DIR)
      .filter((file) => file.endsWith('.md'))
      .sort()

    expect(markdownWorkflows).toEqual(WORKFLOW_SPECS.map(({ name }) => `${name}.md`).sort())
  })
})

describe.each(WORKFLOW_SPECS)('Workflow metadata: $name', ({ name, classification, loop, source, triggerPatterns }) => {
  let workflow = ''

  beforeAll(() => {
    workflow = readWorkflow(name)
  })

  it('documents its provenance and SDLC placement', () => {
    expect(workflow).toContain('## Workflow Metadata')
    expect(workflow).toContain(`- Source Example: ${source}`)
    expect(workflow).toContain(`- Classification: ${classification}`)
    expect(workflow).toContain(`- Loop Placement: ${loop}`)
  })

  it('contains the expected triggers in frontmatter', () => {
    for (const pattern of triggerPatterns) {
      expect(workflow).toMatch(pattern)
    }
  })
})

describe('Issue triage workflow guidance', () => {
  const workflow = readWorkflow('issue-triage')

  it('makes scheduled no-op handling explicit', () => {
    expect(workflow).toContain('If a scheduled/manual run finds no unlabeled or weakly labeled issues, call `noop`')
    expect(workflow).toContain('No action needed: scheduled backlog sweep found no unlabeled or weakly labeled issues.')
  })

  it('requires GitHub MCP reads instead of shell fallbacks', () => {
    expect(workflow).toContain('Use GitHub MCP tools for GitHub reads.')
    expect(workflow).toContain('Do not use shell `gh`, `curl`, or unsupported helper tools to inspect issues.')
    expect(workflow).toContain('call `noop` explaining the blocker instead of ending with prose only or attempting unsupported tools.')
  })
})

describe.each(WORKFLOW_SPECS)('Lock file structure: $name', ({ name }) => {
  let lock = ''

  beforeAll(() => {
    lock = readLockFile(name)
  })

  it('contains the standard activation and agent jobs', () => {
    expect(lock).toMatch(/^\s{2}activation:/m)
    expect(lock).toMatch(/^\s{2}agent:/m)
  })

  it('pins the runtime import back to the markdown workflow', () => {
    expect(lock).toContain(`runtime-import .github/workflows/${name}.md`)
  })

  it('uses the Copilot engine and validates tokens', () => {
    expect(lock).toContain('GH_AW_INFO_ENGINE_ID: "copilot"')
    expect(lock).toContain('COPILOT_GITHUB_TOKEN')
  })
})

describe.skipIf(!HAS_ACT)('Workflow lock files can be parsed by act', () => {
  it.each(WORKFLOW_SPECS)('%s.lock.yml is parseable by act', ({ name }) => {
    const output = runMerged('act', ['-l', '-W', `${WORKFLOWS_DIR}/${name}.lock.yml`])
    expect(output).toContain('activation')
    expect(output).toContain('agent')
  })
})

describe('Setup prerequisites for coding agents', () => {
  const devcontainer = readFileSync(resolve(REPO_ROOT, '.devcontainer/devcontainer.json'), 'utf-8')
  const devcontainerPostCreate = readFileSync(resolve(REPO_ROOT, '.devcontainer/post-create.sh'), 'utf-8')
  const copilotSetup = readFileSync(resolve(WORKFLOWS_DIR, 'copilot-setup-steps.yml'), 'utf-8')

  it('installs act in the dev container', () => {
    expect(devcontainer).toMatch(/devcontainers-extra\/features\/act|post-create\.sh/)
    expect(devcontainerPostCreate).toMatch(/act --version/)
  })

  it('installs gh-aw in the dev container', () => {
    expect(devcontainer).toMatch(/post-create\.sh/)
    expect(devcontainerPostCreate).toMatch(/gh aw version|install-gh-aw\.sh|gh extension install github\/gh-aw/)
  })

  it('installs act in copilot setup steps', () => {
    expect(copilotSetup).toMatch(/name:\s+Install act/)
    expect(copilotSetup).toMatch(/act --version/)
  })

  it('installs gh-aw in copilot setup steps', () => {
    expect(copilotSetup).toMatch(/install-gh-aw\.sh|gh extension install github\/gh-aw/)
    expect(copilotSetup).toMatch(/gh aw version/)
  })
})

describe('Documentation map', () => {
  const map = readFileSync(resolve(DOCS_DIR, 'sdlc-agent-map.md'), 'utf-8')

  it('lists every workflow in the SDLC map', () => {
    for (const { name } of WORKFLOW_SPECS) {
      expect(map).toContain(name)
    }
  })

  it('clearly separates inner and outer loop terminology', () => {
    expect(map).toMatch(/Inner \/ Outer Loop/)
    expect(map).toMatch(/inner/)
    expect(map).toMatch(/outer/)
  })
})
