import React, { Component } from 'react'
import '../CSS/Login.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {}, loading: false
        };
    }

    checkNum = (e) => {
        if (Number(e.target.value) === 0 && e.key === "0") e.preventDefault();
        if (e.key !== "Backspace" && e.key !== "Tab") {
            if (String(e.target.value).length === 10 || e.key === "e") e.preventDefault();
        }
    }

    createAccount = (e) => {
        e.preventDefault();
        const fname = document.getElementById("signupfname").value.trim();
        const lname = document.getElementById("signuplname").value.trim();
        const phone = document.getElementById("signupphone").value.trim();
        const address = document.getElementById("signupadd").value.trim();
        const secque = document.getElementById("signupques").value;
        const secans = document.getElementById("signupans").value.trim();
        const pass = document.getElementById("signuppass").value;
        const rpass = document.getElementById("signuprpass").value;

        let errors = {};
        if (!fname) errors.fname = "First name is required";
        if (!lname) errors.lname = "Last name is required";
        if (!phone || phone.length < 10) errors.phone = "Enter a valid 10-digit number";
        if (!address) errors.address = "Address is required";
        if (!secque || secque === "Select Security Question") errors.secque = "Select a security question";
        if (!secans) errors.secans = "Answer is required";
        if (!pass) errors.pass = "Password is required";
        if (!rpass) errors.rpass = "Please confirm password";
        if (pass && rpass && pass !== rpass) { errors.pass = "Passwords don't match"; errors.rpass = "Passwords don't match"; }

        this.setState({ errors });
        if (Object.keys(errors).length > 0) return;

        this.setState({ loading: true });

        const admincode = document.getElementById("signupadmincode").value.trim();

        axios.post("http://localhost:9090/zomato/user/signup", {
            name: fname + " " + lname,
            phonenumber: phone,
            address: address,
            secretquestion: secque,
            answer: secans,
            password: pass,
            admincode: admincode || undefined
        })
        .then((resp) => {
            this.setState({ loading: false });
            if (resp.data === "success") {
                alert("Account created successfully!");
                this.props.history.push('/Login');
            } else if (resp.data === "phone") {
                this.setState({ errors: { phone: "Phone number already registered" } });
            } else {
                alert("Signup failed: " + resp.data);
            }
        })
        .catch(() => {
            this.setState({ loading: false, errors: { rpass: "Server error. Try again." } });
        });
    }

    clearError = (field) => {
        this.setState(prev => {
            const errors = { ...prev.errors };
            delete errors[field];
            return { errors };
        });
    }

    render() {
        const { errors, loading } = this.state;
        return (
            <div className="auth-page">
                <div className="auth-left">
                    <Link to="/" className="auth-back-link">← Back to Home</Link>
                    <div className="auth-brand">
                        <span className="auth-brand-icon">🚀</span>
                        <h1>Flavour<span>Fleet</span></h1>
                        <p>Join thousands of food lovers today</p>
                    </div>
                    <div className="auth-illustration">
                        <div className="float-card fc1">🎉 Free Delivery</div>
                        <div className="float-card fc2">⭐ Top Rated</div>
                        <div className="float-card fc3">🔥 Trending</div>
                        <div className="float-card fc4">💝 Save More</div>
                    </div>
                </div>
                <div className="auth-right" style={{overflowY:'auto'}}>
                    <div className="auth-form-card" style={{maxWidth:'480px'}}>
                        <h2>Create your account</h2>
                        <p className="auth-subtitle">Start ordering your favorite food</p>

                        <form onSubmit={this.createAccount}>
                            <div className="auth-row">
                                <div>
                                    <label className="auth-label">First Name</label>
                                    <input type="text" id="signupfname" placeholder="First name" className="auth-input" onClick={() => this.clearError('fname')} autoComplete="off" />
                                    {errors.fname && <p className="auth-error">{errors.fname}</p>}
                                </div>
                                <div>
                                    <label className="auth-label">Last Name</label>
                                    <input type="text" id="signuplname" placeholder="Last name" className="auth-input" onClick={() => this.clearError('lname')} autoComplete="off" />
                                    {errors.lname && <p className="auth-error">{errors.lname}</p>}
                                </div>
                            </div>

                            <label className="auth-label">Phone Number</label>
                            <div className="auth-phone-group">
                                <div className="auth-phone-prefix">+91</div>
                                <input type="number" id="signupphone" placeholder="Enter 10-digit number" onKeyDown={this.checkNum} onClick={() => this.clearError('phone')} autoComplete="off" />
                            </div>
                            {errors.phone && <p className="auth-error">{errors.phone}</p>}

                            <label className="auth-label">Address</label>
                            <input type="text" id="signupadd" placeholder="Your delivery address" className="auth-input" onClick={() => this.clearError('address')} autoComplete="off" />
                            {errors.address && <p className="auth-error">{errors.address}</p>}

                            <label className="auth-label">Security Question</label>
                            <select id="signupques" className="auth-select" onClick={() => this.clearError('secque')}>
                                <option>Select Security Question</option>
                                <option>What's your favorite movie?</option>
                                <option>What was your first car?</option>
                                <option>What is your astrological sign?</option>
                                <option>What city were you born in?</option>
                            </select>
                            {errors.secque && <p className="auth-error">{errors.secque}</p>}

                            <label className="auth-label">Security Answer</label>
                            <input type="text" id="signupans" placeholder="Your answer" className="auth-input" onClick={() => this.clearError('secans')} autoComplete="off" />
                            {errors.secans && <p className="auth-error">{errors.secans}</p>}

                            <div className="auth-row">
                                <div>
                                    <label className="auth-label">Password</label>
                                    <input type="password" id="signuppass" placeholder="Password" className="auth-input" onClick={() => this.clearError('pass')} autoComplete="off" />
                                    {errors.pass && <p className="auth-error">{errors.pass}</p>}
                                </div>
                                <div>
                                    <label className="auth-label">Confirm Password</label>
                                    <input type="password" id="signuprpass" placeholder="Re-enter password" className="auth-input" onClick={() => this.clearError('rpass')} autoComplete="off" />
                                    {errors.rpass && <p className="auth-error">{errors.rpass}</p>}
                                </div>
                            </div>

                            <label className="auth-label" style={{color:'#9CA3AF',fontSize:'12px'}}>Admin Code (optional)</label>
                            <input type="text" id="signupadmincode" placeholder="Leave blank for regular user account" className="auth-input" style={{borderStyle:'dashed'}} autoComplete="off" />
                            <p style={{fontSize:'12px',color:'#9CA3AF',margin:'4px 0 0 4px'}}>Only enter if you have an admin invitation code</p>

                            <div className="auth-checkbox">
                                <input type="checkbox" id="agree" />
                                <label htmlFor="agree">
                                    I agree to FlavourFleet's <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
                                </label>
                            </div>

                            <button type="submit" className="auth-submit" disabled={loading}>
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>Already have an account? <Link to="/Login" className="auth-link-primary">Log in</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Signup)
