import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../CSS/Addres.css'

class Addrestaurant extends Component {
    constructor(props) {
        super(props);
        this.state = { restaurantName: "", restaurantAddress: "", imagesLink: [], imageInput: "" };
    }

    submit = (e) => {
        e.preventDefault();
        const { restaurantName, restaurantAddress, imagesLink } = this.state;
        if (!restaurantName || !restaurantAddress) { alert("Please fill in all fields"); return; }

        const images = imagesLink.length === 0
            ? ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"]
            : imagesLink;

        axios.post("http://localhost:9090/zomato/admin/add-restaurant", {
            restaurantName, restaurantAddress, restaurantimages: images
        })
        .then((resp) => {
            if (resp.data === "address") { alert("Restaurant already exists at this address"); return; }
            alert("Restaurant added successfully!");
            this.props.history.push("/Admin");
        })
        .catch((err) => alert("Error: " + (err.response?.data || err.message)));
    }

    addImage = () => {
        const { imageInput, imagesLink } = this.state;
        if (!imageInput) return;
        if (imagesLink.length >= 5) { alert("Maximum 5 images"); return; }
        this.setState({ imagesLink: [...imagesLink, imageInput], imageInput: "" });
    }

    removeImage = (idx) => {
        this.setState(prev => ({ imagesLink: prev.imagesLink.filter((_, i) => i !== idx) }));
    }

    back = () => { this.props.history.push("/Admin"); }

    render() {
        const { restaurantName, restaurantAddress, imagesLink, imageInput } = this.state;
        return (
            <div className="admin-form-page">
                <nav className="admin-topnav">
                    <div className="admin-topnav-left">
                        <span className="admin-logo-icon">🚀</span>
                        <span className="admin-logo-text">FlavourFleet</span>
                        <span className="admin-badge">Admin Panel</span>
                    </div>
                    <button className="admin-back-btn" onClick={this.back}>← Back to Dashboard</button>
                </nav>

                <div className="admin-form-container">
                    <div className="admin-form-card">
                        <div className="afc-header">
                            <span className="afc-icon">🏪</span>
                            <div>
                                <h2>Add New Restaurant</h2>
                                <p>Fill in the details to register a new restaurant</p>
                            </div>
                        </div>

                        <form onSubmit={this.submit}>
                            <label className="admin-label">Restaurant Name</label>
                            <input type="text" className="admin-input" placeholder="e.g. Dragon Wok Kitchen"
                                value={restaurantName} onChange={e => this.setState({restaurantName: e.target.value})}
                                maxLength={50} required />

                            <label className="admin-label">Address</label>
                            <input type="text" className="admin-input" placeholder="e.g. 42, MG Road, Bangalore"
                                value={restaurantAddress} onChange={e => this.setState({restaurantAddress: e.target.value})}
                                maxLength={100} required />

                            <label className="admin-label">Restaurant Images ({imagesLink.length}/5)</label>
                            {imagesLink.length > 0 && (
                                <div className="admin-image-preview">
                                    {imagesLink.map((url, i) => (
                                        <div key={i} className="admin-img-thumb">
                                            <img src={url} alt={`Restaurant ${i+1}`} onError={e => { e.target.src='https://via.placeholder.com/80x60?text=Error' }} />
                                            <button type="button" onClick={() => this.removeImage(i)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="admin-image-add">
                                <input type="url" className="admin-input" placeholder="Paste image URL here..."
                                    value={imageInput} onChange={e => this.setState({imageInput: e.target.value})} />
                                <button type="button" className="admin-img-add-btn" onClick={this.addImage}
                                    disabled={imagesLink.length >= 5}>+ Add</button>
                            </div>

                            <button type="submit" className="admin-submit-btn">🏪 Add Restaurant</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}


export default withRouter(Addrestaurant);