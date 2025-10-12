# 📚 Bookstore E-Commerce Platform

A full-stack MERN e-commerce application for buying and selling books online. Features include advanced search, shopping cart, order management, favorites, and user dashboard.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-95%25%20Complete-success.svg)

---

## 🌟 Features

### For Customers
- ✅ Browse thousands of books with beautiful cards
- ✅ Advanced search with 1.5-second debouncing
- ✅ Filter by genre, sort by price/rating
- ✅ Detailed book pages with ratings
- ✅ Shopping cart with quantity controls
- ✅ Secure checkout with COD payment
- ✅ Order tracking and history
- ✅ Wishlist/Favorites management
- ✅ User dashboard with order management
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support

### Technical Features
- ✅ JWT-based authentication
- ✅ RESTful API architecture
- ✅ MongoDB database with Mongoose
- ✅ Real-time cart updates
- ✅ Stock management
- ✅ Order status tracking
- ✅ Toast notifications
- ✅ Protected routes
- ✅ Form validation

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd bookStore
```

2. **Setup Backend**
```bash
cd Backend
npm install
```

Create `.env` file in Backend directory:
```env
PORT=4001
MONGO_URL=your_mongodb_connection_string
JWT_KEY=your_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```

3. **Setup Frontend**
```bash
cd ../Frontend
npm install
```

Create `.env` file in Frontend directory:
```env
VITE_API_URL=https://bookstore-gvbx.onrender.com
```

4. **Run the Application**

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: https://bookstore-gvbx.onrender.com

---

## 📖 Usage Guide

### First Time Setup

1. **Create an Account**
   - Go to http://localhost:5173/signup
   - Fill in your details
   - You'll be auto-logged in

2. **Browse Books**
   - Click "Books" in navigation
   - Use search bar and filters
   - Click any book for details

3. **Shopping**
   - Click "Add to Cart" on any book
   - Adjust quantity with +/- buttons
   - Click cart icon to review

4. **Checkout**
   - Click "Proceed to Checkout"
   - Enter shipping address
   - Select Cash on Delivery
   - Place your order

5. **Track Orders**
   - Click profile icon
   - Go to "My Orders"
   - View order details

---

## 🏗️ Project Structure

```
bookStore/
├── Backend/
│   ├── controllers/          # Request handlers
│   ├── models/              # Database schemas
│   ├── routes/              # API routes
│   ├── service/             # JWT authentication
│   ├── middlewares/         # Auth middleware
│   ├── index.js             # Server entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── pages/           # Main page components
│   │   ├── components/      # Reusable components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/book` | Get all books |
| GET | `/book/filter` | Search & filter books |
| GET | `/book/featured` | Top rated books |
| GET | `/book/trending` | Trending books |
| GET | `/book/new-arrivals` | New arrivals |
| GET | `/book/upcoming` | Upcoming books |
| GET | `/book/genres` | All genres |
| GET | `/book/:id` | Single book details |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart` | Get user cart |
| POST | `/cart/add` | Add item to cart |
| PUT | `/cart/update` | Update item quantity |
| DELETE | `/cart/remove/:bookId` | Remove item |
| DELETE | `/cart/clear` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/order/create` | Create order |
| GET | `/order` | Get user orders |
| GET | `/order/:orderId` | Order details |
| PUT | `/order/cancel/:orderId` | Cancel order |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/favorite` | Get favorites |
| POST | `/favorite/add` | Add to favorites |
| POST | `/favorite/toggle` | Toggle favorite |
| DELETE | `/favorite/remove/:bookId` | Remove favorite |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user/signup` | Create account |
| POST | `/user/login` | Login user |

---

## 🎨 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **cors** - CORS handling
- **cookie-parser** - Cookie parsing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Tailwind CSS** - Styling
- **React Slick** - Carousel

---

## 📱 Features Breakdown

### Home Page
- Hero section with search
- Company statistics
- Top rated books with genre filter
- Trending books slider
- New arrivals section
- Upcoming releases

### Books Page
- Search with debouncing (1.5s)
- Genre filter dropdown
- Sort by price/rating/newest
- Pagination
- Grid layout

### Book Detail Page
- Large book image
- Complete book information
- Rating display
- Stock availability
- Quantity selector
- Add to cart
- Add to favorites

### Shopping Cart
- List all cart items
- Adjust quantities
- Remove items
- Price calculations
- Checkout button

### Checkout
- Shipping address form
- Payment method selection
- Order summary
- Place order

### User Dashboard
- My Orders
- Favorites
- Profile info
- Logout

### My Orders
- Order list with status
- Order details modal
- Cancel order option
- Order tracking

---

## 🎯 User Flows

### Shopping Flow
```
Browse Books → View Details → Add to Cart → 
Checkout → Enter Address → Place Order → 
Track Order
```

### Favorites Flow
```
Browse Books → Click Heart Icon → View in Dashboard → 
Add to Cart or Remove
```

### Order Management Flow
```
Dashboard → My Orders → View Details → 
Track Status or Cancel
```

---

## 🔐 Authentication

- JWT-based authentication
- Token stored in localStorage
- Protected routes for cart/checkout/dashboard
- Auto-redirect to login for protected pages

---

## 💡 Key Highlights

### Search Implementation
```javascript
// Debounced search with 1.5-second delay
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 1500);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

### Cart Badge
- Real-time cart count in navbar
- Updates on add/remove
- Fetched on page load

### Order Calculations
```
Subtotal = Sum of (price × quantity)
Shipping = FREE if subtotal > ₹500, else ₹50
Tax = Subtotal × 18%
Total = Subtotal + Shipping + Tax
```

### Stock Management
- Quantity cannot exceed stock
- Stock decreases on order
- Stock restores on cancel

---

## 🐛 Known Issues & Limitations

### Current Limitations (5%)
1. Online payment is dummy/disabled (only COD works)
2. No profile edit functionality
3. No admin panel for book management
4. No email notifications
5. No password reset

### Planned Features
- Online payment integration (Razorpay/Stripe)
- Admin dashboard for book CRUD
- Email notifications
- Advanced profile management
- Book reviews and ratings submission
- Order tracking with shipment details

---

## 🧪 Testing

### Manual Testing

1. **Authentication**
   - Signup with new account
   - Login with credentials
   - Logout functionality

2. **Book Browsing**
   - Search books
   - Apply filters
   - Sort options

3. **Shopping Cart**
   - Add items
   - Update quantities
   - Remove items

4. **Checkout**
   - Enter address
   - Select payment method
   - Place order

5. **Orders**
   - View orders list
   - Check order details
   - Cancel order

6. **Favorites**
   - Add to favorites
   - View favorites
   - Remove favorites

---

## 🚀 Deployment

### Backend Deployment (e.g., Render, Heroku)
1. Push code to GitHub
2. Create new web service
3. Set environment variables
4. Deploy

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build frontend: `npm run build`
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Environment Variables for Production
Update URLs in `.env` files to production URLs.

---

## 📝 Database Schema

### User
```javascript
{
  fullname: String,
  email: String (unique),
  password: String (hashed),
  addresses: [Address],
  phone: String,
  avatar: String
}
```

### Book
```javascript
{
  name: String,
  price: Number,
  category: String,
  genre: String,
  author: String,
  description: String,
  rating: Number (0-5),
  reviews: Number,
  stock: Number,
  image: String,
  isTrending: Boolean,
  isNewArrival: Boolean,
  isUpcoming: Boolean
}
```

### Cart
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    book: ObjectId (ref: Book),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number
}
```

### Order
```javascript
{
  user: ObjectId (ref: User),
  items: [OrderItem],
  shippingAddress: Address,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  subtotal: Number,
  shippingCharge: Number,
  tax: Number,
  totalAmount: Number,
  orderDate: Date,
  deliveryDate: Date
}
```

### Favorite
```javascript
{
  user: ObjectId (ref: User),
  books: [ObjectId (ref: Book)]
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Rakshit Gupta**

---

## 🙏 Acknowledgments

- React documentation
- MongoDB documentation
- Tailwind CSS
- React Router
- All open-source contributors

---

## 📞 Support

For support, email support@bookstore.com or open an issue on GitHub.

---

## 🎉 Status

**Current Version:** 1.0.0  
**Completion:** 95%  
**Status:** Production Ready (with minor enhancements needed)

---

**Built with ❤️ using MERN Stack**

---

## 📚 Additional Documentation

- [Project Implementation Guide](./PROJECT_IMPLEMENTATION_GUIDE.md)
- [Completed Work Summary](./COMPLETED_WORK_SUMMARY.md)
- [Final Project Status](./FINAL_PROJECT_STATUS.md)

---

**Happy Coding! 🚀**
