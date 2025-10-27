import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useConfirmation } from "../../contexts/ConfirmationContext";
import { getUsers, getUserById, deleteUser } from "../../services/adminService";
import TableRowSkeleton from "../skeletons/TableRowSkeleton";

export default function ManageUsers({ theme }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { showConfirmation } = useConfirmation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Cookie sent automatically
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoadingDetails(true);
    try {
      // Cookie sent automatically
      const response = await getUserById(userId);
      setSelectedUserDetails(response);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = await showConfirmation({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone and will remove all their data including orders and favorites.',
      confirmText: 'Delete User',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!confirmed) return;

    try {
      // Cookie sent automatically
      await deleteUser(userId);
      toast.success("User deleted successfully!");
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className={`h-10 w-48 rounded mb-2 ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } animate-pulse`}></div>
          <div className={`h-6 w-64 rounded ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } animate-pulse`}></div>
        </div>
        <div className={`rounded-xl shadow-lg overflow-hidden ${
          theme === "dark" ? "bg-slate-900" : "bg-white"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={theme === "dark" ? "bg-slate-800" : "bg-gray-50"}>
                <tr>
                  {['User', 'Email', 'Role', 'Orders', 'Joined', 'Actions'].map((header, idx) => (
                    <th key={idx} className={`px-6 py-4 text-left text-sm font-semibold ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[...Array(5)].map((_, index) => (
                  <TableRowSkeleton key={index} columns={6} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Manage Users
        </h1>
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          View and manage registered users
        </p>
      </div>

      {/* Users Table */}
      <div className={`rounded-xl shadow-lg overflow-hidden ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === "dark" ? "bg-slate-800" : "bg-gray-50"}>
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  User
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Email
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Joined Date
                </th>
                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === "dark" ? "divide-slate-800" : "divide-gray-200"}`}>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className={`hover:${theme === "dark" ? "bg-slate-800" : "bg-gray-50"} transition-colors`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user.fullname?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {user.fullname}
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {user.email}
                  </td>
                  <td className={`px-6 py-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => fetchUserDetails(user._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
            theme === "dark" ? "bg-slate-900" : "bg-white"
          }`}>
            {loadingDetails ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    User Details
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`text-2xl ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    ×
                  </button>
                </div>

                {/* User Info */}
                <div className={`rounded-lg p-6 mb-6 ${theme === "dark" ? "bg-slate-800" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {selectedUserDetails.user?.fullname?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {selectedUserDetails.user?.fullname}
                      </h3>
                      <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                        {selectedUserDetails.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Joined Date
                      </p>
                      <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {new Date(selectedUserDetails.user?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Total Orders
                      </p>
                      <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {selectedUserDetails.orderCount}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Total Spent
                      </p>
                      <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        ₹{selectedUserDetails.totalSpent?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Orders History */}
                <div>
                  <h3 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Order History
                  </h3>

                  {selectedUserDetails.orders?.length > 0 ? (
                    <div className="space-y-4">
                      {selectedUserDetails.orders.map((order) => (
                        <div
                          key={order._id}
                          className={`rounded-lg p-4 ${theme === "dark" ? "bg-slate-800" : "bg-gray-50"}`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                Order #{order._id.slice(-8)}
                              </p>
                              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.orderStatus === "Delivered"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                  : order.orderStatus === "Cancelled"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              }`}>
                                {order.orderStatus}
                              </span>
                              <p className={`text-lg font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                ₹{order.totalAmount.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 overflow-x-auto">
                            {order.items?.slice(0, 4).map((item, index) => (
                              <div key={index} className="flex-shrink-0">
                                <img
                                  src={item.book?.image || "/book1.png"}
                                  alt={item.book?.name}
                                  className="w-12 h-16 object-cover rounded"
                                />
                              </div>
                            ))}
                            {order.items?.length > 4 && (
                              <div className="flex-shrink-0 w-12 h-16 bg-gray-200 dark:bg-slate-700 rounded flex items-center justify-center">
                                <span className={`text-xs font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                  +{order.items.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                      No orders yet
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-6 pt-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-gray-200'}">
                  <button
                    onClick={() => handleDeleteUser(selectedUserDetails.user._id)}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                  >
                    Delete User
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      theme === "dark"
                        ? "bg-slate-800 text-white hover:bg-slate-700"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
