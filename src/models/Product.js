import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    gallery: [
      {
        type: String,
      },
    ],

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
