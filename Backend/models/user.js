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
      required: true,
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
