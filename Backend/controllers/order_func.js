import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Book from "../models/book.js";
import {getUser} from "../service/Auth.js";

// Create order
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    const token = req.cookies?.id || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userData = getUser(token);
    if (!userData) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const cart = await Cart.findOne({ user: userData._id }).populate('items.book');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate stock
    for (const item of cart.items) {
      if (item.book.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.book.name}` 
        });
      }
    }

    const subtotal = cart.totalAmount;
    const shippingCharge = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + shippingCharge + tax;

    const order = await Order.create({
      user: userData._id,
      items: cart.items.map(item => ({
        book: item.book._id,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      subtotal,
      shippingCharge,
      tax,
      totalAmount,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    // Update book stock
    for (const item of cart.items) {
      await Book.findByIdAndUpdate(
        item.book._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    await order.populate('items.book');

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.log("Error in createOrder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const token = req.cookies?.id || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userData = getUser(token);
    if (!userData) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const orders = await Order.find({ user: userData._id })
      .populate('items.book')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in getUserOrders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single order details
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const token = req.cookies?.id || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userData = getUser(token);
    if (!userData) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const order = await Order.findOne({ _id: orderId, user: userData._id })
      .populate('items.book');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.log("Error in getOrderById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel order (only if pending or processing)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const token = req.cookies?.id || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userData = getUser(token);
    if (!userData) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const order = await Order.findOne({ _id: orderId, user: userData._id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      return res.status(400).json({ 
        message: "Cannot cancel order that has been shipped or delivered" 
      });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    // Restore book stock
    for (const item of order.items) {
      await Book.findByIdAndUpdate(
        item.book,
        { $inc: { stock: item.quantity } }
      );
    }

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.log("Error in cancelOrder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
