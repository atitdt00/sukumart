"use client";

import { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderStatus,
} from "../../../../Services/Order_Service";
import { toast } from "react-toastify";

function Page() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  //fetch ordered data
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();

      if (!response.success) {
        toast.error(response.message || "Failed to fetch orders");
        return;
      }

      setOrders(response.orders);
    } catch (error) {
      console.error("Order fetch error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //handle status change manually

  const handleStatusChange = async (orderId, status) => {
    try {
      const response = await updateOrderStatus(orderId, status);

      if (!response.success) {
        toast.error(response.message || "Failed to update status");
        return;
      }

      //update the order in the current UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: response.order.status }
            : order,
        ),
      );

      toast.success(response.message || "Order status updated");
    } catch (error) {
      console.error("status update error:", error);

      toast.error(
        error.response?.data?.message || "Failed to update order status",
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Loading orders...</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>

        <p className="text-gray-500 mt-2">Manage customer orders</p>
      </div>

      {/* ORDERS */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center">
            <p className="text-gray-500">No orders found.</p>
          </div>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedOrder === order._id;

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* COLLAPSED HEADER */}
                <button
                  onClick={() => toggleOrder(order._id)}
                  className="w-full p-5 text-left hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* ORDER INFO */}
                    <div>
                      <h2
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-lg select-text"
                      >
                        Order #{order.orderId}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* CUSTOMER */}
                    <div>
                      <p className="font-medium">{order.customer.fullName}</p>

                      <p className="text-sm text-gray-500">
                        {order.customer.email}
                      </p>
                    </div>

                    {/* TOTAL */}
                    <div>
                      <p className="font-bold">
                        Rs. {order.total.toLocaleString()}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.products.length} product
                        {order.products.length > 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* STATUS + ARROW */}
                    <div className="flex items-center gap-3">
                      <select
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="font-medium rouded-full  border border-gray-200 bg-yellow-100 outline-none text-yellow-700 px-3 py-1 rounded-full text-sm"
                      >
                        <option value="pending">pending</option>
                        <option value="processing">processing</option>
                        <option value="shipped">shipped</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>

                      <span className="text-xl">{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </div>
                </button>

                {/* EXPANDED CONTENT */}
                {isExpanded && (
                  <div className="border-t p-6">
                    {/* CUSTOMER */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg mb-3">Customer</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {order.customer.fullName}
                        </p>

                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {order.customer.email}
                        </p>

                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {order.customer.phone}
                        </p>

                        <p>
                          <span className="font-medium">City:</span>{" "}
                          {order.customer.city}
                        </p>

                        <p className="md:col-span-2">
                          <span className="font-medium">Address:</span>{" "}
                          {order.customer.address}
                        </p>
                      </div>
                    </div>

                    {/* PRODUCTS */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg mb-3">Products</h3>

                      <div className="space-y-3">
                        {order.products.map((product) => (
                          <div
                            key={product._id}
                            className="flex justify-between items-center border-b pb-3"
                          >
                            <div>
                              <p className="font-medium">{product.name}</p>

                              {/* SELECTED VARIANTS */}
                              {product.selectedVariants &&
                                Object.entries(product.selectedVariants).map(
                                  ([name, value]) => (
                                    <p
                                      key={name}
                                      className="text-sm text-gray-600 mt-1"
                                    >
                                      <span className="font-semibold">
                                        {name}:
                                      </span>{" "}
                                      {value}
                                    </p>
                                  ),
                                )}

                              <p className="text-sm text-gray-500 mt-1">
                                Qty: {product.quantity}
                              </p>
                            </div>

                            <p className="font-medium">
                              Rs.{" "}
                              {(
                                product.price * product.quantity
                              ).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* TOTAL */}
                    <div className="max-w-md ml-auto space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>

                        <span>Rs. {order.subtotal.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Shipping</span>

                        <span>Rs. {order.shipping.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Tax</span>

                        <span>Rs. {order.tax.toLocaleString()}</span>
                      </div>

                      <hr />

                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>

                        <span>Rs. {order.total.toLocaleString()}</span>
                      </div>

                      <p className="text-sm text-gray-500">
                        Payment: {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Page;
