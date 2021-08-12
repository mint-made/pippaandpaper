import express from 'express';
const router = express.Router();
import {
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDispatched,
  createOrder,
} from '../controllers/orderController.js';
import { isAdmin, protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, isAdmin, getOrders).post(protect, createOrder);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/dispatch').put(protect, isAdmin, updateOrderToDispatched);

export default router;
