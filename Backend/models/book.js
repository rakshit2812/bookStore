import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    genre: {
        type: String,
        default: "General"
    },
    image: String,
    title: String,
    author: {
        type: String,
        default: "Unknown Author"
    },
    description: {
        type: String,
        default: "No description available"
    },
    rating: {
        type: Number,
        default: 4,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 100
    },
    isTrending: {
        type: Boolean,
        default: false
    },
    isNewArrival: {
        type: Boolean,
        default: false
    },
    isUpcoming: {
        type: Boolean,
        default: false
    },
    publishedDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);

export default Book
