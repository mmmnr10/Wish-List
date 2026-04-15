import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  targetSize: {
    type: String,
    required: true,
  },
  isSizeInStock: {
    type: Boolean,
    default: true,
  },
  priceHistory: [
    {
      price: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
