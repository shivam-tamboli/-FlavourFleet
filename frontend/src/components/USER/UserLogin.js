import React, { Component } from 'react';
import '../CSS/Userlogin.css'
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import API_BASE_URL from '../../config/api';

class UserLogin extends Component {

    constructor(props){
        super(props);
        this.userPhoneNumber = this.props.phh;
        this.state = {
            profileOpen: false,
            userName: '',
            userPhone: '',
            userAddress: ''
        };
    }

    componentDidMount() {
        if (this.userPhoneNumber) {
            axios.post(`${API_BASE_URL}/zomato/user/get-profile`, { phonenumber: this.userPhoneNumber })
                .then((resp) => {
                    if (resp.data && resp.data.name) {
                        this.setState({
                            userName: resp.data.name,
                            userPhone: resp.data.phone,
                            userAddress: resp.data.address
                        });
                    }
                })
                .catch(() => {});
        }
    }

    showFoods = () => {
        this.props.history.push({ pathname: "/User", state: { phonenum: this.userPhoneNumber } });
    }

    showRestaurants = () => {
        this.props.history.push({ pathname: "Userrestaurant", state: { phonenum: this.userPhoneNumber } });
    }

    showOrders = () => {
        this.props.history.push({ pathname: "Orders", state: { phonenum: this.userPhoneNumber } });
    }

    back = () => {
        this.props.history.push({ pathname: "/Userrestaurant", state: { phonenum: this.userPhoneNumber } });
    }

    toggleProfile = () => {
        this.setState(prev => ({ profileOpen: !prev.profileOpen }));
    }

    forgotPassword = () => {
        this.setState({ profileOpen: false });
        this.props.history.push('/Forgotpassword');
    }

    logout = () => {
        axios.post(`${API_BASE_URL}/zomato/user/logout`, { phonenumber: this.userPhoneNumber })
            .then(() => {})
            .catch(() => {});
        localStorage.removeItem('userPhoneNumber');
        this.props.history.push('/');
    }

    getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return parts[0][0].toUpperCase();
    }

    render() {
        const { profileOpen, userName, userPhone } = this.state;

        return (
            <>
                <nav className="user-nav-header">
                    <div className="nav-brand" onClick={this.back}>
                        <span className="brand-icon">🚀</span>
                        <span className="brand-text">FlavourFleet</span>
                    </div>
                    <div className='UserLoginButton'>
                        <button className='ShowFoodUsrB' onClick={this.showFoods}>
                            <span>🍕</span> Foods
                        </button>
                        <button className='ShowResUsrB' onClick={this.showRestaurants}>
                            <span>🏪</span> Restaurants
                        </button>
                        <button className='ShowOrderUsrB' onClick={this.showOrders}>
                            <span>📋</span> My Orders
                        </button>
                    </div>

                    <div className="nav-profile-wrapper">
                        <button className="nav-profile-btn" onClick={this.toggleProfile}>
                            <div className="nav-avatar">{this.getInitials(userName)}</div>
                            <span className="nav-profile-name">{userName ? userName.split(' ')[0] : ''}</span>
                        </button>

                        {profileOpen && (
                            <>
                                <div className="profile-overlay" onClick={this.toggleProfile}></div>
                                <div className="profile-dropdown">
                                    <div className="profile-dropdown-header">
                                        <div className="profile-avatar-lg">{this.getInitials(userName)}</div>
                                        <div className="profile-info">
                                            <p className="profile-name">{userName || 'User'}</p>
                                            <p className="profile-phone">📱 +91 {userPhone || this.userPhoneNumber}</p>
                                        </div>
                                    </div>
                                    <div className="profile-dropdown-divider"></div>
                                    <button className="profile-dropdown-item" onClick={this.forgotPassword}>
                                        <span>🔑</span> Change Password
                                    </button>
                                    <div className="profile-dropdown-divider"></div>
                                    <button className="profile-dropdown-item profile-logout-item" onClick={this.logout}>
                                        <span>🚪</span> Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </nav>
                <div className='UserLoginBack'>
                    {this.props.children}
                </div>
            </>
        )
    }
}


export default withRouter(UserLogin);