/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: API endpoints for managing deliveries
 */

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Returns all deliveries
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: List of all deliveries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *   post:
 *     summary: Create a new delivery
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       201:
 *         description: Delivery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 * 
 * /api/deliveries/{id}:
 *   get:
 *     summary: Get a delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       200:
 *         description: Delivery found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *   put:
 *     summary: Update a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       200:
 *         description: Delivery updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *   delete:
 *     summary: Delete a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       204:
 *         description: Delivery deleted successfully
 *       404:
 *         description: Delivery not found
 */

import express from 'express';
import { Delivery } from '../models/delivery';
import { deliveries as seedDeliveries } from '../seedData';

const router = express.Router();

let deliveries: Delivery[] = [...seedDeliveries];

// Helper function to validate ID parameter
const parseValidId = (id: string): number | null => {
  const parsed = parseInt(id, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
};

// Create a new delivery
router.post('/', (req, res) => {
  const newDelivery: Delivery = req.body;
  deliveries.push(newDelivery);
  res.status(201).json(newDelivery);
});

// Get all deliveries
router.get('/', (req, res) => {
  res.json(deliveries);
});

// Get a delivery by ID
router.get('/:id', (req, res) => {
  const id = parseValidId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid delivery ID' });
  }
  const delivery = deliveries.find(d => d.deliveryId === id);
  if (delivery) {
    res.json(delivery);
  } else {
    res.status(404).send('Delivery not found');
  }
});

// Update delivery status - removed command injection vulnerability
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const id = parseValidId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid delivery ID' });
  }
  const delivery = deliveries.find(d => d.deliveryId === id);
  
  if (delivery) {
    delivery.status = status;
    res.json(delivery);
  } else {
    res.status(404).send('Delivery not found');
  }
});

// Update a delivery by ID
router.put('/:id', (req, res) => {
  const id = parseValidId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid delivery ID' });
  }
  const index = deliveries.findIndex(d => d.deliveryId === id);
  if (index !== -1) {
    deliveries[index] = req.body;
    res.json(deliveries[index]);
  } else {
    res.status(404).send('Delivery not found');
  }
});

// Delete a delivery by ID
router.delete('/:id', (req, res) => {
  const id = parseValidId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid delivery ID' });
  }
  const index = deliveries.findIndex(d => d.deliveryId === id);
  if (index !== -1) {
    deliveries.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Delivery not found');
  }
});

export default router;
