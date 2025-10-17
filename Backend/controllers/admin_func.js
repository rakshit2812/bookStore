import User from "../models/user.js";
import Book from "../models/book.js";
import Order from "../models/order.js";

// Get analytics data
export const getAnalytics = async (req, res) => {
    try {
        // Get current month start and end dates
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        // Previous month dates
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // Total books
        const totalBooks = await Book.countDocuments();
        const totalBooksLastMonth = await Book.countDocuments({
            createdAt: { $lt: monthStart }
        });
        const booksTrend = totalBooksLastMonth > 0 
            ? ((totalBooks - totalBooksLastMonth) / totalBooksLastMonth) * 100 
            : 0;

        // Total users
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalUsersLastMonth = await User.countDocuments({
            role: "user",
            createdAt: { $lt: monthStart }
        });
        const usersTrend = totalUsersLastMonth > 0 
            ? ((totalUsers - totalUsersLastMonth) / totalUsersLastMonth) * 100 
            : 0;

        // Users registered this month
        const usersThisMonth = await User.countDocuments({
            createdAt: { $gte: monthStart, $lte: monthEnd }
        });

        // Total revenue (all time)
        const allOrders = await Order.find({
            orderStatus: { $ne: "Cancelled" }
        });
        const totalRevenueAllTime = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Revenue this month
        const ordersThisMonth = await Order.find({
            createdAt: { $gte: monthStart, $lte: monthEnd },
            orderStatus: { $ne: "Cancelled" }
        });
        const monthlyRevenue = ordersThisMonth.reduce((sum, order) => sum + order.totalAmount, 0);

        // Revenue last month
        const ordersLastMonth = await Order.find({
            createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
            orderStatus: { $ne: "Cancelled" }
        });
        const lastMonthRevenue = ordersLastMonth.reduce((sum, order) => sum + order.totalAmount, 0);
        const revenueTrend = lastMonthRevenue > 0 
            ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
            : 0;

        // Average Order Value (AOV)
        const avgOrderValue = ordersThisMonth.length > 0 
            ? monthlyRevenue / ordersThisMonth.length 
            : 0;
        const lastMonthAvgOrderValue = ordersLastMonth.length > 0 
            ? lastMonthRevenue / ordersLastMonth.length 
            : 0;
        const aovTrend = lastMonthAvgOrderValue > 0 
            ? ((avgOrderValue - lastMonthAvgOrderValue) / lastMonthAvgOrderValue) * 100 
            : 0;

        // Active users this month (users who placed orders)
        const activeUsersThisMonth = await Order.distinct('user', {
            createdAt: { $gte: monthStart, $lte: monthEnd }
        });
        const activeUsersLastMonth = await Order.distinct('user', {
            createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd }
        });
        const activeUsersTrend = activeUsersLastMonth.length > 0 
            ? ((activeUsersThisMonth.length - activeUsersLastMonth.length) / activeUsersLastMonth.length) * 100 
            : 0;

        // Top-selling genre
        const topGenre = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthStart, $lte: monthEnd },
                    orderStatus: { $ne: "Cancelled" }
                }
            },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "books",
                    localField: "items.book",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            { $unwind: "$bookDetails" },
            {
                $group: {
                    _id: "$bookDetails.genre",
                    totalSold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 1 }
        ]);
        const topSellingGenre = topGenre.length > 0 ? topGenre[0]._id : "N/A";

        // Total orders
        const totalOrders = await Order.countDocuments();

        // Monthly revenue trends (last 12 months)
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        const monthlyRevenueTrends = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: twelveMonthsAgo },
                    orderStatus: { $ne: "Cancelled" }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    revenue: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Monthly user registrations (last 12 months)
        const monthlyUserTrends = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: twelveMonthsAgo },
                    role: "user"
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Most sold book of the month
        const mostSoldBook = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthStart, $lte: monthEnd },
                    orderStatus: { $ne: "Cancelled" }
                }
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.book",
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 1 },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            { $unwind: "$bookDetails" }
        ]);

        // Top 3 customers by purchase volume
        const topCustomers = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthStart, $lte: monthEnd },
                    orderStatus: { $ne: "Cancelled" }
                }
            },
            {
                $group: {
                    _id: "$user",
                    totalSpent: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 3 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" }
        ]);

        // Average number of books sold per order
        const avgBooksPerOrder = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthStart, $lte: monthEnd },
                    orderStatus: { $ne: "Cancelled" }
                }
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$_id",
                    totalBooks: { $sum: "$items.quantity" }
                }
            },
            {
                $group: {
                    _id: null,
                    avgBooks: { $avg: "$totalBooks" }
                }
            }
        ]);

        // Daily revenue for current month
        const dailyRevenueCurrentMonth = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthStart, $lte: monthEnd },
                    orderStatus: { $ne: "Cancelled" }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    revenue: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Daily users for current month
        const dailyUsersCurrentMonth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthStart, $lte: monthEnd },
                    role: "user"
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Order status distribution - Monthly
        const monthlyOrderStatus = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthStart, $lte: monthEnd }
                }
            },
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Order status distribution - Daily (current month)
        const dailyOrderStatus = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthStart, $lte: monthEnd }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        status: "$orderStatus"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.date": 1 }
            }
        ]);

        res.status(200).json({
            // Overview stats
            totalBooks,
            booksTrend,
            totalUsers,
            usersTrend,
            totalRevenueAllTime,
            monthlyRevenue,
            revenueTrend,
            avgOrderValue,
            aovTrend,
            activeUsersThisMonth: activeUsersThisMonth.length,
            activeUsersTrend,
            topSellingGenre,
            usersThisMonth,
            totalOrders,

            // Charts data - Monthly
            monthlyRevenueTrends,
            monthlyUserTrends,

            // Charts data - Daily (current month)
            dailyRevenueCurrentMonth,
            dailyUsersCurrentMonth,

            // Order status data
            monthlyOrderStatus,
            dailyOrderStatus,

            // Summary insights
            mostSoldBook: mostSoldBook.length > 0 ? {
                name: mostSoldBook[0].bookDetails.name,
                author: mostSoldBook[0].bookDetails.author,
                quantity: mostSoldBook[0].totalQuantity,
                revenue: mostSoldBook[0].totalRevenue
            } : null,
            topCustomers: topCustomers.map(c => ({
                name: c.userDetails.fullname,
                email: c.userDetails.email,
                totalSpent: c.totalSpent,
                orderCount: c.orderCount
            })),
            avgBooksPerOrder: avgBooksPerOrder.length > 0 ? avgBooksPerOrder[0].avgBooks : 0
        });
    } catch (error) {
        console.log("Error in getAnalytics:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all users with their details
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getAllUsers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get admin profile
export const getAdminProfile = async (req, res) => {
    try {
        const adminId = req.user._id;
        const admin = await User.findById(adminId).select("-password");
        
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json(admin);
    } catch (error) {
        console.log("Error in getAdminProfile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.user._id;
        const { fullname, email, avatar } = req.body;

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: adminId } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        const updateData = {};
        if (fullname) updateData.fullname = fullname;
        if (email) updateData.email = email;
        if (avatar) updateData.avatar = avatar;

        const updatedAdmin = await User.findByIdAndUpdate(
            adminId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedAdmin
        });
    } catch (error) {
        console.log("Error in updateAdminProfile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Change admin password
export const changeAdminPassword = async (req, res) => {
    try {
        const adminId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide both current and new password" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" });
        }

        const admin = await User.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Verify current password
        const isMatch = await bcryptjs.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.log("Error in changeAdminPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get user details with orders
export const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const orders = await Order.find({ user: userId })
            .populate('items.book')
            .sort({ createdAt: -1 });

        const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        res.status(200).json({
            user,
            orders,
            totalSpent,
            orderCount: orders.length
        });
    } catch (error) {
        console.log("Error in getUserDetails:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(403).json({ message: "Cannot delete admin user" });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log("Error in deleteUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update book
export const updateBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const updateData = req.body;

        const book = await Book.findByIdAndUpdate(
            bookId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book updated successfully", book });
    } catch (error) {
        console.log("Error in updateBook:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete book
export const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        const book = await Book.findByIdAndDelete(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.log("Error in deleteBook:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create book
export const createBook = async (req, res) => {
    try {
        const bookData = req.body;

        const newBook = await Book.create(bookData);

        res.status(201).json({ message: "Book created successfully", book: newBook });
    } catch (error) {
        console.log("Error in createBook:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;
        
        const filter = status && status !== "all" ? { orderStatus: status } : {};
        
        const orders = await Order.find(filter)
            .populate('user', 'fullname email')
            .populate('items.book', 'name author')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.log("Error in getAllOrders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get order details
export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate('user', 'fullname email phone')
            .populate('items.book', 'name author price image');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        console.log("Error in getOrderDetails:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true }
        ).populate('user', 'fullname email');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        console.log("Error in updateOrderStatus:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
