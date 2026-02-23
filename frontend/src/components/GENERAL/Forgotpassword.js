import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import '../CSS/Login.css'
import axios from 'axios'

class Forgotpassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1, // 1 = enter phone, 2 = answer + reset
            question: '',
            phonenum: '',
            error1: '', error2: '', error3: '',
            loading: false
        };
    }

    checkNum = (e) => {
        if (Number(e.target.value) === 0 && e.key === "0") e.preventDefault();
        if (e.key !== "Backspace" && e.key !== "Tab") {
            if (String(e.target.value).length === 10 || e.key === "e") e.preventDefault();
        }
    }

    getQuestion = () => {
        const num = document.getElementById("fpphonenum").value;
        if (String(num).length < 10) {
            this.setState({ error1: "Enter a valid 10-digit number" });
            return;
        }
        this.setState({ loading: true, error1: '' });
        axios.post("http://localhost:9090/zomato/user/forgot-password", { phonenumber: num })
            .then((resp) => {
                this.setState({ loading: false });
                if (resp.data === "phone") {
                    this.setState({ error1: "Phone number not found" });
                } else {
                    this.setState({ step: 2, question: resp.data, phonenum: num });
                }
            })
            .catch(() => {
                this.setState({ loading: false, error1: "Server error" });
            });
    }

    resetPass = () => {
        const ans = document.getElementById("bsecans").value;
        const newp = document.getElementById("brpass").value;
        let hasError = false;
        if (!ans) { this.setState({ error2: "Answer is required" }); hasError = true; }
        if (!newp) { this.setState({ error3: "New password is required" }); hasError = true; }
        if (hasError) return;

        this.setState({ loading: true, error2: '', error3: '' });
        axios.post("http://localhost:9090/zomato/user/reset-password", {
            phonenumber: this.state.phonenum,
            secretquestion: this.state.question,
            answer: ans,
            newpassword: newp
        })
        .then((resp) => {
            this.setState({ loading: false });
            if (resp.data === "answer") {
                this.setState({ error2: "Incorrect answer" });
            } else {
                alert("Password reset successful!");
                this.props.history.push('/Login');
            }
        })
        .catch(() => {
            this.setState({ loading: false, error3: "Server error" });
        });
    }

    render() {
        const { step, question, error1, error2, error3, loading } = this.state;
        return (
            <div className="auth-page">
                <div className="auth-left">
                    <Link to="/" className="auth-back-link">← Back to Home</Link>
                    <div className="auth-brand">
                        <span className="auth-brand-icon">🔒</span>
                        <h1>Flavour<span>Fleet</span></h1>
                        <p>We'll help you get back in</p>
                    </div>
                    <div className="auth-illustration">
                        <div className="float-card fc1">🛡️ Secure</div>
                        <div className="float-card fc2">✅ Verified</div>
                        <div className="float-card fc3">🔑 Reset</div>
                        <div className="float-card fc4">🚀 Quick</div>
                    </div>
                </div>
                <div className="auth-right">
                    <div className="auth-form-card">
                        <h2>Reset Password</h2>
                        <p className="auth-subtitle">
                            {step === 1 ? "Enter your phone number to get your security question" : "Answer your security question to reset password"}
                        </p>

                        {step === 1 ? (
                            <>
                                <label className="auth-label">Phone Number</label>
                                <div className="auth-phone-group">
                                    <div className="auth-phone-prefix">+91</div>
                                    <input type="number" id="fpphonenum" placeholder="Enter 10-digit number"
                                        onKeyDown={this.checkNum} onClick={() => this.setState({error1:''})} autoComplete="off" />
                                </div>
                                {error1 && <p className="auth-error">{error1}</p>}

                                <button type="button" className="auth-submit" onClick={this.getQuestion} disabled={loading}>
                                    {loading ? 'Verifying...' : 'Get Security Question'}
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:'12px',padding:'14px 18px',marginBottom:'20px'}}>
                                    <p style={{fontSize:'13px',color:'#166534',fontWeight:600,margin:'0 0 4px'}}>Security Question</p>
                                    <p style={{fontSize:'15px',color:'#15803D',margin:0,fontWeight:500}}>{question}</p>
                                </div>

                                <label className="auth-label">Your Answer</label>
                                <input type="text" id="bsecans" placeholder="Enter your answer" className="auth-input"
                                    onClick={() => this.setState({error2:''})} autoComplete="off" />
                                {error2 && <p className="auth-error">{error2}</p>}

                                <label className="auth-label">New Password</label>
                                <input type="password" id="brpass" placeholder="Enter new password" className="auth-input"
                                    onClick={() => this.setState({error3:''})} autoComplete="off" />
                                {error3 && <p className="auth-error">{error3}</p>}

                                <button type="button" className="auth-submit" onClick={this.resetPass} disabled={loading}>
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </>
                        )}

                        <div className="auth-footer">
                            <div className="auth-footer-divider"></div>
                            <p>Remember your password? <Link to="/Login" className="auth-link-primary">Log in</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Forgotpassword)
