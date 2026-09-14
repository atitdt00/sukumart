import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type:String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      fullName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        thumbnail: {
          type: String,
        },
        gallery:[{
            type:String,
            default: [],
        }],

        selectedVariants:{
          type: Map,
          of: String,
          default: {},
        }
      },
    ],

    subtotal: {
      type: Number,
      required: true,
    },

    shipping: {
      type: Number,
      required: true,
    },

    tax: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    // PAYMENT METHOD
    paymentMethod: {
      type: String,
      enum: ["cod", "esewa", "khalti"],
      required: true,
    },

    // PAYMENT STATUS
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // eSewa/Khalti transaction ID
    transactionId: {
      type: String,
      default: null,
    },

    // Payment gateway response
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // ORDER DELIVERY STATUS
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);