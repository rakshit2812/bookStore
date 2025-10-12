import mongoose from "mongoose";

const favoriteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    books: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book"
    }]
  },
  { timestamps: true }
);

// Compound index to ensure one favorite list per user
favoriteSchema.index({ user: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
