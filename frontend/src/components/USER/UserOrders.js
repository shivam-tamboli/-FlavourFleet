import React, { Component } from 'react';
import axios from 'axios';
import '../CSS/UserOrders.css';
import UserLogin from './UserLogin';
import API_BASE_URL from '../../config/api';

export default class UserOrders extends Component {
    constructor(props) {
        super(props);

        console.log("📦 USER ORDERS CONSTRUCTOR");
        console.log("Props:", props);
        console.log("Location state:", props.location?.state);

        const locationState = props.location?.state || {};
        this.userPhoneNumber = locationState.phonenum ||
            localStorage.getItem('userPhoneNumber') ||
            '';

        console.log("📱 User phone number:", this.userPhoneNumber);

        this.state = {
            orders: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchUserOrders();
    }

    fetchUserOrders = async () => {
        if (!this.userPhoneNumber) {
            console.error("❌ No phone number available");
            this.setState({
                error: "User information not found. Please login again.",
                loading: false
            });
            return;
        }

        try {
            console.log("📥 Fetching orders for phone:", this.userPhoneNumber);

            const response = await axios.post(
                `${API_BASE_URL}/flavorfleet/user/get-all-order-details`,
                { phonenumber: this.userPhoneNumber },
                {
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("📥 Full API Response:", response);
            console.log("📥 Response status:", response.status);
            console.log("📥 Response data:", response.data);

            if (!response.data) {
                console.warn("⚠️ Response data is empty or null");
                this.setState({
                    orders: [],
                    loading: false
                });
                return;
            }

            let ordersData = response.data;
            if (typeof ordersData === 'object' && !Array.isArray(ordersData)) {
                console.warn("⚠️ Response is object, converting to array");
                ordersData = [ordersData];
            }

            const transformedOrders = ordersData.map((order, index) => {
                console.log(`🔍 Processing order ${index}:`, order);

                return {
                    orderId: order.orderId || order.orderid || `ORD-${index + 1}`,
                    restaurantId: order.restaurantId || order.restaurantid,
                    restaurantName: order.restaurantName || order.restaurantname || "Unknown Restaurant",
                    totalAmount: order.totalAmount || order.totalamount || 0,
                    deliveryAddress: order.deliveryAddress || order.deliveryaddress || "Not specified",
                    orderFlag: order.orderFlag || order.orderflag || 0,
                    foodItems: order.orderFoodItems || order.foodItems || order.fooditems || []
                };
            });

            console.log("📥 Transformed orders:", transformedOrders);

            this.setState({
                orders: transformedOrders,
                loading: false,
                error: null
            });

        } catch (error) {
            console.error("❌ Error fetching orders:", error);

            let errorMessage = "Failed to load orders. Please try again.";

            if (error.code === 'ECONNABORTED') {
                errorMessage = "Request timeout. Please check your connection.";
            } else if (error.response) {
                console.error("❌ Server error response:", error.response);
                errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;

                if (error.response.status === 404) {
                    errorMessage = "Orders endpoint not found. Please check backend.";
                } else if (error.response.status === 500) {
                    errorMessage = "Server error. Please try again later.";
                }
            } else if (error.request) {
                console.error("❌ No response received:", error.request);
                errorMessage = "No response from server. Please check if backend is running.";
            }

            this.setState({
                error: errorMessage,
                loading: false,
                orders: []
            });
        }
    }

    rateOrder = (order) => {
        console.log("⭐ Rating order:", order);

        const orderForRating = {
            orderid: order.orderId,
            orderId: order.orderId,
            restaurantid: order.restaurantId,
            restaurantId: order.restaurantId,
            restaurantname: order.restaurantName,
            restaurantName: order.restaurantName,
            orderFoodItems: order.foodItems ? order.foodItems.map(item => ({
                foodItemId: item.foodItemId || item.fooditemid || item.id,
                fooditemid: item.foodItemId || item.fooditemid || item.id,
                foodName: item.foodName || item.foodname || "Unknown Food",
                foodname: item.foodName || item.foodname || "Unknown Food",
                quantity: item.quantity || 1,
                amount: item.amount || 0
            })) : []
        };

        console.log("📤 Transformed order for rating:", orderForRating);

        this.props.history.push({
            pathname: "/Rate",
            state: {
                obj: orderForRating,
                phonenum: this.userPhoneNumber
            }
        });
    }

    retryFetchOrders = () => {
        this.setState({ loading: true, error: null });
        this.fetchUserOrders();
    }

    navigateToRestaurants = () => {
        this.props.history.push({
            pathname: "/Userrestaurant",
            state: {
                phonenum: this.userPhoneNumber
            }
        });
    }

    navigateToHome = () => {
        this.props.history.push("/");
    }

    render() {
        const { orders, loading, error } = this.state;

        if (loading) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber} />
                    <div className="user-orders-container">
                        <div className="loading-message">
                            <div className="ff-spinner"></div>
                            <h2>Loading your orders...</h2>
                        </div>
                    </div>
                </>
            );
        }

        if (error) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber} />
                    <div className="user-orders-container">
                        <div className="error-message">
                            <h2>⚠️ Error</h2>
                            <p>{error}</p>
                            <div className="error-actions">
                                <button onClick={this.retryFetchOrders} className="retry-btn">🔄 Try Again</button>
                                <button onClick={this.navigateToHome} className="home-btn">🏠 Home</button>
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        if (orders.length === 0) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber} />
                    <div className="user-orders-container">
                        <div className="no-orders-message">
                            <h2>No Orders Yet</h2>
                            <p>You haven't placed any orders yet. Start exploring restaurants!</p>
                            <button onClick={this.navigateToRestaurants} className="order-now-btn">🍕 Order Now</button>
                        </div>
                    </div>
                </>
            );
        }

        return (
            <>
                <UserLogin phh={this.userPhoneNumber} />
                <div className="user-orders-container">
                {/* Header Section with New Order Button */}
                <header className="orders-header">
                    <div className="header-content">
                        <h1>Your Orders</h1>
                        <button onClick={this.navigateToRestaurants} className="new-order-btn">
                            + New Order
                        </button>
                    </div>
                </header>

                {/* Orders List */}
                <div className="orders-list">
                    {orders.map((order, index) => {
                        return (
                            <div key={order.orderId || index} className="order-card">
                                <h2>Order #{order.orderId}</h2>

                                <div className="order-details">
                                    <p className="restaurant-name">
                                        <strong>🍽️ {order.restaurantName}</strong>
                                    </p>
                                    <p className="delivery-address">
                                        📍 {order.deliveryAddress}
                                    </p>
                                    <p className="total-amount">
                                        ₹{order.totalAmount}
                                    </p>

                                    <div className="food-items">
                                        <strong>Items Ordered:</strong>
                                        <ul>
                                            {order.foodItems && order.foodItems.length > 0 ? (
                                                order.foodItems.map((item, itemIndex) => (
                                                    <li key={itemIndex}>
                                                        {item.foodName || "Unknown Item"} × {item.quantity || 1} — ₹{item.amount || 0}
                                                    </li>
                                                ))
                                            ) : (
                                                <li>No item details available</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                <hr className="order-divider" />

                                <div className="order-actions">
                                    {order.orderFlag === 1 ? (
                                        <span className="rated-badge">✅ Rated</span>
                                    ) : (
                                        <button onClick={() => this.rateOrder(order)} className="rate-btn">
                                            ⭐ Rate This Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            </>
        );
    }
}