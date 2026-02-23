import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../CSS/Addres.css'
import { getFoodImage } from '../utils/foodImages';

class AddFooditem extends Component {
    constructor(props) {
        super(props);
        this.restaurantId = this.props.location?.state?.resid;
        this.state = { foodName: '', description: '', price: '', image: '' };
    }

    componentDidMount() {
        if (!this.restaurantId) {
            alert("No restaurant selected.");
            this.props.history.push('/Admin');
        }
    }

    submit = (e) => {
        e.preventDefault();
        const { foodName, description, price, image } = this.state;
        if (!foodName || !description || !price) { alert("Please fill all fields"); return; }

        const finalImage = image || getFoodImage(foodName, 0);

        axios.post("http://localhost:9090/flavorfleet/admin/add-fooditems", {
            restaurantId: Number(this.restaurantId),
            foodName, description,
            price: Number(price),
            image: finalImage
        })
        .then(() => {
            this.props.history.push({ pathname: '/Viewmenu', state: { resid: this.restaurantId } });
        })
        .catch((err) => alert("Failed: " + (err.response?.data || err.message)));
    }

    back = () => {
        this.props.history.push({ pathname: '/Viewmenu', state: { resid: this.restaurantId } });
    }

    render() {
        const { foodName, description, price, image } = this.state;
        const previewImg = image || (foodName ? getFoodImage(foodName, 0) : '');

        return (
            <div className="admin-form-page">
                <nav className="admin-topnav">
                    <div className="admin-topnav-left">
                        <span className="admin-logo-icon">🚀</span>
                        <span className="admin-logo-text">FlavourFleet</span>
                        <span className="admin-badge">Admin Panel</span>
                    </div>
                    <button className="admin-back-btn" onClick={this.back}>← Back to Menu</button>
                </nav>

                <div className="admin-form-container">
                    <div className="admin-form-card">
                        <div className="afc-header">
                            <span className="afc-icon">🍕</span>
                            <div>
                                <h2>Add Food Item</h2>
                                <p>Restaurant #{this.restaurantId}</p>
                            </div>
                        </div>

                        <form onSubmit={this.submit}>
                            <label className="admin-label">Food Name</label>
                            <input type="text" className="admin-input" placeholder="e.g. Margherita Pizza"
                                value={foodName} onChange={e => this.setState({foodName: e.target.value})} required />

                            <label className="admin-label">Description</label>
                            <textarea className="admin-textarea" placeholder="Describe the dish..."
                                value={description} onChange={e => this.setState({description: e.target.value})} required />

                            <label className="admin-label">Price (₹)</label>
                            <input type="number" className="admin-input" placeholder="e.g. 299"
                                value={price} onChange={e => this.setState({price: e.target.value})} min="1" max="9999" required />

                            <label className="admin-label">Image URL (optional)</label>
                            <input type="url" className="admin-input" placeholder="Paste image URL or leave blank for auto-image"
                                value={image} onChange={e => this.setState({image: e.target.value})} />

                            {previewImg && (
                                <div style={{marginTop:'12px',borderRadius:'12px',overflow:'hidden',height:'160px',border:'1px solid #E5E7EB'}}>
                                    <img src={previewImg} alt="Preview" style={{width:'100%',height:'100%',objectFit:'cover'}}
                                        onError={e => { e.target.style.display='none'; }} />
                                </div>
                            )}

                            <button type="submit" className="admin-submit-btn">🍕 Add Food Item</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(AddFooditem);

