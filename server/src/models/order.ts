import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

export const Order = mongoose.model('Order', orderSchema);