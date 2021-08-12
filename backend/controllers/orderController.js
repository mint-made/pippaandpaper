import asyncHandler from 'express-async-handler';

import Order from '../models/orderModel.js';

// @description Get order by ID
// @route GET /api/orders/:id
// @access Private
/**
 * @api {get} /api/orders/:id getOrderById
 * @apiGroup Order
 * @apiPermission Private
 *
 * @apiParam {String} orderId ID of the order requested
 *
 *
 * @apiSuccess {Object} order The order with given ID
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @description Post create new order
// @route POST /api/orders
// @access Private
/**
 * @api {post} /api/orders createOrder
 * @apiGroup Order
 * @apiPermission Private
 *
 * @apiDescription This route will create a new order from details provided
 *
 * @apiParam {Array} orderItems all items included in the order
 * @apiParam {Object} shippingAddress containing address , city, postalCode, country
 * @apiParam {String} paymentMethod how the order was paid e.g. Paypal, Stripe
 * @apiParam {Number} itemsPrice total items price ex. shipping/tax
 * @apiParam {Number} shippingPrice cost of shipping the order
 * @apiParam {Number} taxPrice tax due for the order
 * @apiParam {Number} totalPrice total cost of the order inc. shipping/tax
 * @apiParam {Object} paymentResult containing payment info such id, status, time and email of payer
 *
 * @apiSuccess {Object} createdOrder The order created
 */
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentResult,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: paymentResult.id,
        status: paymentResult.status,
        update_time: paymentResult.update_time,
        email_address: paymentResult.payer.email_address,
      },
    });

    const placedOrder = await order.save();

    res.status(201).json(placedOrder);
  }
});

// @description Get logged in user order
// @route GET /api/orders/myorders
// @access Private
/**
 * @api {get} /api/orders/myorders getMyOrders
 * @apiGroup Order
 * @apiPermission Private
 *
 * @apiSuccess {Array} orders The orders for the user who sent the request
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @description Get all orders
// @route GET /api/orders/
// @access Private/Admin
/**
 * @api {get} /api/orders/ getOrders
 * @apiGroup Order
 * @apiPermission Private/Admin
 *
 * @apiSuccess {Array} orders All orders
 */
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'id name');
  res.json(orders);
});

// @description Update order to delivered
// @route GET /api/orders/:id/deliver
// @access Private/Admin
/**
 * @api {get} /api/orders/:id/deliver updateOrderToDelivered
 * @apiGroup Order
 * @apiPermission Private/Admin
 *
 * @apiParam {String} orderId ID of the order to be marked as delivered
 *
 * @apiSuccess {Object} order Order that has been updated as delivered
 */
const updateOrderToDispatched = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDispatched = true;
    order.dispatchedAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDispatched,
};
