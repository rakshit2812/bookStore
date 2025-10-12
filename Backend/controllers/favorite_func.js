import Favorite from "../models/favorite.js";
import {getUser} from "../service/Auth.js";

// Get user favorites
export const getFavorites = async (req, res) => {
  try {
    const token = req.cookies?.id || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userData = getUser(token);
    if (!userData) {
      return res.status(401).json({ message: "Invalid token" });
    }

    let favorite = await Favorite.findOne({ user: userData._id }).populate('books');
    
    if (!favorite) {
      favorite = await Favorite.create({ user: userData._id, books: [] });
    }

    res.status(200).json(favorite);
  } catch (error) {
    console.log("Error in getFavorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add book to favorites
export const addToFavorites = async (req, res) => {
  try {
    const { bookId } = req.body;
    
    const token = req.cookies?.id || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userData = getUser(token);
    if (!userData) {
      return res.status(401).json({ message: "Invalid token" });
    }

    let favorite = await Favorite.findOne({ user: userData._id });

    if (!favorite) {
      favorite = new Favorite({ user: userData._id, books: [] });
    }

    // Check if book is already in favorites
    if (favorite.books.includes(bookId)) {
      return res.status(400).json({ message: "Book already in favorites" });
    }

    favorite.books.push(bookId);
    await favorite.save();
    await favorite.populate('books');

    res.status(200).json(favorite);
  } catch (error) {
    console.log("Error in addToFavorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove book from favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const token = req.cookies?.id || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userData = getUser(token);
    if (!userData) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const favorite = await Favorite.findOne({ user: userData._id });
    
    if (!favorite) {
      return res.status(404).json({ message: "Favorites not found" });
    }

    favorite.books = favorite.books.filter(book => book.toString() !== bookId);
    await favorite.save();
    await favorite.populate('books');

    res.status(200).json(favorite);
  } catch (error) {
    console.log("Error in removeFromFavorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Toggle favorite (add if not present, remove if present)
export const toggleFavorite = async (req, res) => {
  try {
    const { bookId } = req.body;
    
    const token = req.cookies?.id || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userData = getUser(token);
    if (!userData) {
      return res.status(401).json({ message: "Invalid token" });
    }

    let favorite = await Favorite.findOne({ user: userData._id });

    if (!favorite) {
      favorite = new Favorite({ user: userData._id, books: [bookId] });
      await favorite.save();
      await favorite.populate('books');
      return res.status(200).json({ message: "Added to favorites", favorite });
    }

    const bookIndex = favorite.books.findIndex(book => book.toString() === bookId);

    if (bookIndex > -1) {
      favorite.books.splice(bookIndex, 1);
      await favorite.save();
      await favorite.populate('books');
      return res.status(200).json({ message: "Removed from favorites", favorite });
    } else {
      favorite.books.push(bookId);
      await favorite.save();
      await favorite.populate('books');
      return res.status(200).json({ message: "Added to favorites", favorite });
    }
  } catch (error) {
    console.log("Error in toggleFavorite:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
