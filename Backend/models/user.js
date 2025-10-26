import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: {
    type: String,
    default: "India"
  },
  phone: String,
  isDefault: {
    type: Boolean,
    default: false
  }
});

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function() {
        // Password is required only if googleId is not present
        return !this.googleId;
      }
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true // allows multiple null values
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    addresses: [addressSchema],
    phone: String,
    avatar: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
