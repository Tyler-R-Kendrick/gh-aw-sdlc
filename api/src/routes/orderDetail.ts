/**
 * @swagger
 * tags:
 *   name: Order Details
 *   description: API endpoints for managing order details
 */

/**
 * @swagger
 * /api/order-details:
 *   get:
 *     summary: Returns all order details
 *     tags: [Order Details]
 *     responses:
 *       200:
 *         description: List of all order details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderDetail'
 *   post:
 *     summary: Create a new order detail
 *     tags: [Order Details]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderDetail'
 *     responses:
 *       201:
 *         description: Order detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetail'
 * 
 * /api/order-details/{id}:
 *   get:
 *     summary: Get an order detail by ID
 *     tags: [Order Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order detail ID
 *     responses:
 *       200:
 *         description: Order detail found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetail'
 *       404:
 *         description: Order detail not found
 *   put:
 *     summary: Update an order detail
 *     tags: [Order Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order detail ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderDetail'
 *     responses:
 *       200:
 *         description: Order detail updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetail'
 *       404:
 *         description: Order detail not found
 *   delete:
 *     summary: Delete an order detail
 *     tags: [Order Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order detail ID
 *     responses:
 *       204:
 *         description: Order detail deleted successfully
 *       404:
 *         description: Order detail not found
 */

import express from 'express';
import { OrderDetail } from '../models/orderDetail';
import { orderDetails as seedOrderDetails } from '../seedData';

const router = express.Router();

let orderDetails: OrderDetail[] = [...seedOrderDetails];

// Helper function to validate ID parameter
const parseValidId = (id: string): number | null => {
  const parsed = parseInt(id, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
};

// Create a new order detail
router.post('/', (req, res) => {
  const newOrderDetail: OrderDetail = req.body;
  orderDetails.push(newOrderDetail);
  res.status(201).json(newOrderDetail);
});

// Get all order details
router.get('/', (req, res) => {
  res.json(orderDetails);
});

// Get an order detail by ID
router.get('/:id', (req, res) => {
  const id = parseValidId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid order detail ID' });
  }
  const orderDetail = orderDetails.find(od => od.orderDetailId === id);
  if (orderDetail) {
    res.json(orderDetail);
  } else {
    res.status(404).send('Order detail not found');
  }
});

// Update an order detail by ID
router.put('/:id', (req, res) => {
  const id = parseValidId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid order detail ID' });
  }
  const index = orderDetails.findIndex(od => od.orderDetailId === id);
  if (index !== -1) {
    orderDetails[index] = req.body;
    res.json(orderDetails[index]);
  } else {
    res.status(404).send('Order detail not found');
  }
});

// Delete an order detail by ID
router.delete('/:id', (req, res) => {
  const id = parseValidId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid order detail ID' });
  }
  const index = orderDetails.findIndex(od => od.orderDetailId === id);
  if (index !== -1) {
    orderDetails.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Order detail not found');
  }
});

export default router;
