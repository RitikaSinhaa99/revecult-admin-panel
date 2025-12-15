import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    country: String,
    zip: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    totals: {
      subtotal: Number,
      tax: Number,
      shipping: Number,
      discount: Number,
      grandTotal: Number
    },
    totalAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;

