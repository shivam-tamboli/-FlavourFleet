import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import '../CSS/Adminlogin.css';

class AdminLogin extends Component {
    constructor(props) {
        super(props);
        this.phone = JSON.parse(localStorage.getItem('ap'));
        this.state = {
            listOfRest: [],
            loading: true,
            error: null,
            profileOpen: false,
            adminName: '',
            adminPhone: ''
        };
    }

    componentDidMount() {
        this.fetchRestaurants();
        // Fetch admin profile
        if (this.phone) {
            axios.post("http://localhost:9090/flavorfleet/user/get-profile", { phonenumber: this.phone })
                .then((resp) => {
                    if (resp.data && resp.data.name) {
                        this.setState({ adminName: resp.data.name, adminPhone: resp.data.phone });
                    }
                })
                .catch(() => {});
        }
    }

    fetchRestaurants = () => {
        this.setState({ loading: true, error: null });
        axios.get('http://localhost:9090/flavorfleet/get-restaurants')
            .then((resp) => {
                this.setState({ listOfRest: resp.data || [], loading: false });
            })
            .catch(() => {
                this.setState({ loading: false, error: "Failed to load restaurants" });
            });
    };

    checkFoods = (restaurantId) => {
        this.props.history.push({ pathname: '/Viewmenu', state: { resid: restaurantId } });
    };

    editRestaurant = (restaurantId) => {
        const restaurant = this.state.listOfRest.find(r => r.restaurantId === restaurantId);
        this.props.history.push({ pathname: '/Edit', state: { resid: restaurantId, resobj: restaurant } });
    };

    deleteRestaurant = (restaurantId) => {
        if (!window.confirm("Are you sure you want to delete this restaurant and all its food items?")) return;
        axios.post('http://localhost:9090/flavorfleet/admin/delete-restaurant', { restaurantId: Number(restaurantId) })
            .then(() => this.fetchRestaurants())
            .catch(() => alert("Failed to delete restaurant"));
    };

    logout = () => {
        axios.post('http://localhost:9090/flavorfleet/user/logout', { phonenumber: this.phone }).catch(() => {});
        localStorage.removeItem('ap');
        this.props.history.push('/');
    };

    toggleProfile = () => {
        this.setState(prev => ({ profileOpen: !prev.profileOpen }));
    };

    forgotPassword = () => {
        this.setState({ profileOpen: false });
        this.props.history.push('/Forgotpassword');
    };

    getInitials = (name) => {
        if (!name) return 'A';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return parts[0][0].toUpperCase();
    };

    getRestaurantIcon = (name) => {
        const n = (name || '').toLowerCase();
        if (n.includes('pizza')) return '🍕';
        if (n.includes('burger')) return '🍔';
        if (n.includes('cafe') || n.includes('coffee') || n.includes('mocha')) return '☕';
        if (n.includes('sushi') || n.includes('japanese')) return '🍣';
        if (n.includes('tandoori') || n.includes('indian') || n.includes('biryani') || n.includes('nawab')) return '🍛';
        if (n.includes('chinese') || n.includes('dragon') || n.includes('wok') || n.includes('noodle')) return '🥡';
        if (n.includes('dosa') || n.includes('south') || n.includes('spice')) return '🥘';
        if (n.includes('barn')) return '🍔';
        return '🍽️';
    };

    render() {
        const { listOfRest, loading, error } = this.state;
        const totalFoods = listOfRest.reduce((sum, r) => sum + (r.foodItems ? r.foodItems.length : 0), 0);

        return (
            <div className="admin-dashboard">
                {/* ─── Top Nav ─── */}
                <nav className="admin-topnav">
                    <div className="admin-topnav-left">
                        <span className="admin-logo-icon">🚀</span>
                        <span className="admin-logo-text">FlavourFleet</span>
                        <span className="admin-badge">Admin Panel</span>
                    </div>
                    <div className="admin-topnav-right">
                        <div className="admin-profile-wrapper">
                            <button className="admin-profile-btn" onClick={this.toggleProfile}>
                                <div className="admin-avatar">{this.getInitials(this.state.adminName)}</div>
                                <span className="admin-profile-name">{this.state.adminName ? this.state.adminName.split(' ')[0] : 'Admin'}</span>
                                <span className="admin-profile-arrow">{this.state.profileOpen ? '▲' : '▼'}</span>
                            </button>

                            {this.state.profileOpen && (
                                <>
                                    <div className="admin-profile-overlay" onClick={this.toggleProfile}></div>
                                    <div className="admin-profile-dropdown">
                                        <div className="admin-profile-dropdown-header">
                                            <div className="admin-avatar-lg">{this.getInitials(this.state.adminName)}</div>
                                            <div className="admin-profile-info">
                                                <p className="admin-profile-name-lg">{this.state.adminName || 'Admin'}</p>
                                                <p className="admin-profile-phone">📱 +91 {this.state.adminPhone || this.phone}</p>
                                                <span className="admin-role-badge">Admin</span>
                                            </div>
                                        </div>
                                        <div className="admin-profile-divider"></div>
                                        <button className="admin-profile-item" onClick={this.forgotPassword}>
                                            <span>🔑</span> Change Password
                                        </button>
                                        <div className="admin-profile-divider"></div>
                                        <button className="admin-profile-item admin-profile-logout" onClick={this.logout}>
                                            <span>🚪</span> Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="admin-body">
                    {/* ─── Sidebar ─── */}
                    <aside className="admin-sidebar">
                        <div className="sidebar-section">
                            <p className="sidebar-label">Dashboard</p>
                            <div className="sidebar-item active">
                                <span>🏪</span> Restaurants
                            </div>
                        </div>
                        <div className="sidebar-section">
                            <p className="sidebar-label">Actions</p>
                            <Link to="/Addrestaurant" className="sidebar-item add">
                                <span>➕</span> Add Restaurant
                            </Link>
                        </div>
                        <div className="sidebar-section sidebar-stats">
                            <p className="sidebar-label">Overview</p>
                            <div className="sidebar-stat">
                                <div className="stat-value">{listOfRest.length}</div>
                                <div className="stat-name">Restaurants</div>
                            </div>
                            <div className="sidebar-stat">
                                <div className="stat-value">{totalFoods}</div>
                                <div className="stat-name">Food Items</div>
                            </div>
                        </div>
                    </aside>

                    {/* ─── Main Content ─── */}
                    <main className="admin-main">
                        <div className="admin-main-header">
                            <div>
                                <h1>Restaurants</h1>
                                <p>Manage your restaurants and their menus</p>
                            </div>
                            <Link to="/Addrestaurant" className="admin-add-btn">
                                + Add Restaurant
                            </Link>
                        </div>

                        {loading ? (
                            <div className="admin-empty-state">
                                <div className="ff-spinner"></div>
                                <p>Loading restaurants...</p>
                            </div>
                        ) : error ? (
                            <div className="admin-empty-state">
                                <span style={{fontSize:'48px'}}>⚠️</span>
                                <h3>{error}</h3>
                                <button onClick={this.fetchRestaurants} className="admin-add-btn">Retry</button>
                            </div>
                        ) : listOfRest.length === 0 ? (
                            <div className="admin-empty-state">
                                <span style={{fontSize:'64px'}}>🏪</span>
                                <h3>No restaurants yet</h3>
                                <p>Start by adding your first restaurant</p>
                                <Link to="/Addrestaurant" className="admin-add-btn">+ Add Restaurant</Link>
                            </div>
                        ) : (
                            <div className="admin-rest-grid">
                                {listOfRest.map((rest) => {
                                    const id = rest.restaurantId;
                                    const foodCount = rest.foodItems ? rest.foodItems.length : 0;
                                    const rating = rest.restaurantRating ? rest.restaurantRating.toFixed(1) : '—';
                                    const icon = this.getRestaurantIcon(rest.restaurantName);

                                    return (
                                        <div className="admin-rest-card" key={id}>
                                            <div className="arc-header">
                                                <div className="arc-icon">{icon}</div>
                                                <div className="arc-info">
                                                    <h3>{rest.restaurantName}</h3>
                                                    <p className="arc-address">📍 {rest.restaurantAddress}</p>
                                                </div>
                                            </div>
                                            <div className="arc-stats">
                                                <div className="arc-stat">
                                                    <span className="arc-stat-val">{foodCount}</span>
                                                    <span className="arc-stat-label">Items</span>
                                                </div>
                                                <div className="arc-stat">
                                                    <span className="arc-stat-val">{rating}</span>
                                                    <span className="arc-stat-label">Rating</span>
                                                </div>
                                                <div className="arc-stat">
                                                    <span className="arc-stat-val">#{id}</span>
                                                    <span className="arc-stat-label">ID</span>
                                                </div>
                                            </div>
                                            <div className="arc-actions">
                                                <button className="arc-btn arc-btn-view" onClick={() => this.checkFoods(id)}>
                                                    👁️ View Menu
                                                </button>
                                                <button className="arc-btn arc-btn-edit" onClick={() => this.editRestaurant(id)}>
                                                    ✏️ Edit
                                                </button>
                                                <button className="arc-btn arc-btn-delete" onClick={() => this.deleteRestaurant(id)}>
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        );
    }
}

export default withRouter(AdminLogin);





