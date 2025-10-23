import Cart from "../models/cart.js";
import Book from "../models/book.js";

// Get user cart
export const getCart = async (req, res) => {
  try {
    // req.user is already validated and attached by requireAuth middleware
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], totalAmount: 0 });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.log("Error in getCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;
    // req.user is already validated by middleware

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(item => item.book.toString() === bookId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        book: bookId,
        quantity,
        price: book.price
      });
    }

    // Calculate total
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    await cart.save();
    await cart.populate('items.book');

    res.status(200).json(cart);
  } catch (error) {
    console.log("Error in addToCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    // req.user is already validated by middleware

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Calculate total
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    await cart.save();
    await cart.populate('items.book');

    res.status(200).json(cart);
  } catch (error) {
    console.log("Error in updateCartItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;
    // req.user is already validated by middleware

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.book.toString() !== bookId);

    // Calculate total
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    await cart.save();
    await cart.populate('items.book');

    res.status(200).json(cart);
  } catch (error) {
    console.log("Error in removeFromCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    // req.user is already validated by middleware

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.log("Error in clearCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
