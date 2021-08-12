import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        variantId: { type: String },
        variations: [
          {
            name: { type: String, required: true },
            isOptional: { type: Boolean, required: true },
            isSelected: { type: Boolean, required: true },
            selectedOption: { type: Number, required: true },
            options: [
              {
                additionalPrice: { type: Number, required: true },
                name: { type: String, required: true },
                linkedImage: { type: Number },
              },
            ],
          },
        ],
        personalizations: [
          {
            name: { type: String, required: true },
            isOptional: { type: Boolean, required: true },
            isSelected: { type: Boolean, required: true },
            value: { type: String },
            additionalPrice: { type: String, required: true },
            linkedImage: { type: Number },
          },
        ],
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      supdate_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDispatched: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    dispatchedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
