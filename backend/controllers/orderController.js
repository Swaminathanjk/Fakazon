import Order from "../models/Order.js"; // Assuming your Order model is in the models folder
import { Cart } from "../models/Cart.js"; // Assuming you have a Cart model

export const getallOrders = async (req, res) => {
  try {
    // Fetch all orders from the database, sorted by creation date (or any other field you prefer)
    const orders = await Order.find()
      .populate("items.productId") // Populate product details for each item in the order
      .sort({ createdAt: -1 }); // Sort orders by creation date (newest first)

    // Return the fetched orders in the response
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch orders. Please try again." });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { customerName, userId, address } = req.body; // Get the userId and address from the request

    // Fetch the user's cart and populate product details
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate the total amount from the cart items
    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.productId.current_price * item.quantity;
    }, 0);

    // Create a new order
    const newOrder = new Order({
      customerName,
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id, // Use the product ID
        quantity: item.quantity,
        price: item.productId.current_price,
        totalPrice: item.productId.current_price * item.quantity,
      })),
      amount: totalAmount,
      address,
      status: "Processing", // Initial status
    });

    // Save the order
    await newOrder.save();

    // Optionally, clear the user's cart after the order is placed
    await Cart.deleteOne({ userId });

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order" });
  }
};
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from the request params

    // Find all orders for the user
    const orders = await Order.find({ userId }).populate("items.productId");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Error fetching user orders" });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; // Get the orderId and new status from the request body

    const { id } = req.params; // Get the orderId from the request params
    // Validate status (only allow certain values)
    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the order by ID and update its status
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status" });
  }
};
export const updateOrderAddress = async (req, res) => {
  try {
    const { orderId, newAddress } = req.body; // Get the orderId and new address from the request body

    // Find the order by ID and update its address
    const order = await Order.findByIdAndUpdate(
      orderId,
      { address: newAddress },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order address updated", order });
  } catch (error) {
    console.error("Error updating order address:", error);
    res.status(500).json({ message: "Error updating order address" });
  }
};
