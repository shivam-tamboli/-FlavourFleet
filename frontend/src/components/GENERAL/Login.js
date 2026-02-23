import React, { Component } from 'react'
import '../CSS/Login.css'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { error1: '', error2: '', loading: false };
    }

    checkLogin = (e) => {
        e.preventDefault();
        const phonenum = document.getElementById("phonenum").value;
        const password = document.getElementById("loginpass").value;

        if (!phonenum || !password) {
            this.setState({
                error1: !phonenum ? 'Please enter phone number' : '',
                error2: !password ? 'Please enter password' : ''
            });
            return;
        }

        this.setState({ loading: true, error1: '', error2: '' });

        axios.post("http://localhost:9090/zomato/user/login", { phonenumber: phonenum, password })
            .then((res) => {
                this.setState({ loading: false });
                if (res.data === "phone") {
                    this.setState({ error1: "Phone number not registered" });
                } else if (res.data === "password") {
                    this.setState({ error2: "Incorrect password" });
                } else if (res.data === "Success_admin") {
                    localStorage.setItem('ap', JSON.stringify(phonenum));
                    this.props.history.push("/Admin");
                } else if (res.data === "Success_user") {
                    localStorage.setItem('userPhoneNumber', phonenum);
                    this.props.history.push({ pathname: "/Userrestaurant", state: { phonenum } });
                } else {
                    this.setState({ error2: "Login failed. Try again." });
                }
            })
            .catch(() => {
                this.setState({ loading: false, error2: "Server error. Please try again." });
            });
    }

    checkNum = (e) => {
        if (Number(e.target.value) === 0 && e.key === "0") e.preventDefault();
        if (e.key !== "Backspace" && e.key !== "Tab") {
            if (String(e.target.value).length === 10 || e.key === "e") e.preventDefault();
        }
    }

    clearErrors = () => { this.setState({ error1: '', error2: '' }); }

    render() {
        const { error1, error2, loading } = this.state;
        return (
            <div className="auth-page">
                <div className="auth-left">
                    <Link to="/" className="auth-back-link">← Back to Home</Link>
                    <div className="auth-brand">
                        <span className="auth-brand-icon">🚀</span>
                        <h1>Flavour<span>Fleet</span></h1>
                        <p>Discover the best food & drinks, delivered fast</p>
                    </div>
                    <div className="auth-illustration">
                        <div className="float-card fc1">🍕 Pizza</div>
                        <div className="float-card fc2">🍔 Burgers</div>
                        <div className="float-card fc3">🍜 Noodles</div>
                        <div className="float-card fc4">☕ Coffee</div>
                    </div>
                </div>
                <div className="auth-right">
                    <div className="auth-form-card">
                        <h2>Welcome back</h2>
                        <p className="auth-subtitle">Log in to your account</p>

                        <form onSubmit={this.checkLogin}>
                            <label className="auth-label">Phone Number</label>
                            <div className="auth-phone-group">
                                <div className="auth-phone-prefix">+91</div>
                                <input
                                    type="number" id="phonenum"
                                    placeholder="Enter 10-digit number"
                                    onKeyDown={this.checkNum}
                                    onClick={this.clearErrors}
                                    autoComplete="off"
                                />
                            </div>
                            {error1 && <p className="auth-error">{error1}</p>}

                            <label className="auth-label">Password</label>
                            <input
                                type="password" id="loginpass"
                                placeholder="Enter your password"
                                onClick={this.clearErrors}
                                autoComplete="off"
                                className="auth-input"
                            />
                            {error2 && <p className="auth-error">{error2}</p>}

                            <button type="submit" className="auth-submit" disabled={loading}>
                                {loading ? 'Logging in...' : 'Log in'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <Link to="/Forgotpassword" className="auth-link">Forgot password?</Link>
                            <div className="auth-footer-divider"></div>
                            <p>Don't have an account? <Link to="/Signup" className="auth-link-primary">Sign up</Link></p>
                            <p style={{fontSize:'12px',color:'#9CA3AF',marginTop:'12px'}}>🔒 Admin? Use the same login — you'll be redirected automatically</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Login)