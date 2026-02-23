import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../CSS/Addres.css'
import { getFoodImage } from '../utils/foodImages';

class EditFooditem extends Component {
    constructor(props) {
        super(props);
        const foodData = this.props.location?.state?.resdata;
        const restaurantId = this.props.location?.state?.resid;

        this.restaurantId = Number(restaurantId);
        this.foodItemId = Number(foodData?.fooditemid || foodData?.foodItemId || 0);

        this.state = {
            foodName: foodData?.foodname || foodData?.foodName || '',
            description: foodData?.description || '',
            price: foodData?.price || '',
            image: foodData?.image || '',
            loading: false
        };
    }

    componentDidMount() {
        if (!this.restaurantId || !this.foodItemId) {
            alert("Missing data. Returning to admin.");
            this.props.history.push('/Admin');
        }
    }

    submit = (e) => {
        e.preventDefault();
        const { foodName, description, price, image } = this.state;
        if (!foodName || !description || !price) { alert("Please fill all fields"); return; }

        this.setState({ loading: true });
        const finalImage = image || getFoodImage(foodName, 0);

        axios.post("http://localhost:9090/flavorfleet/admin/edit-fooditems", {
            fooditemid: this.foodItemId,
            restaurantId: this.restaurantId,
            foodName, description,
            price: Number(price),
            image: finalImage
        })
        .then((resp) => {
            this.setState({ loading: false });
            if (resp.data === "name") {
                alert("A food item with this name already exists!");
            } else {
                this.props.history.push({ pathname: '/Viewmenu', state: { resid: this.restaurantId } });
            }
        })
        .catch((err) => {
            this.setState({ loading: false });
            alert("Failed: " + (err.response?.data || err.message));
        });
    }

    back = () => {
        this.props.history.push({ pathname: '/Viewmenu', state: { resid: this.restaurantId } });
    }

    render() {
        const { foodName, description, price, image, loading } = this.state;
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
                            <span className="afc-icon">✏️</span>
                            <div>
                                <h2>Edit Food Item</h2>
                                <p>ID #{this.foodItemId} · Restaurant #{this.restaurantId}</p>
                            </div>
                        </div>

                        <form onSubmit={this.submit}>
                            <label className="admin-label">Food Name</label>
                            <input type="text" className="admin-input" value={foodName}
                                onChange={e => this.setState({foodName: e.target.value})} required />

                            <label className="admin-label">Description</label>
                            <textarea className="admin-textarea" value={description}
                                onChange={e => this.setState({description: e.target.value})} required />

                            <label className="admin-label">Price (₹)</label>
                            <input type="number" className="admin-input" value={price}
                                onChange={e => this.setState({price: e.target.value})} min="1" max="9999" required />

                            <label className="admin-label">Image URL (optional)</label>
                            <input type="url" className="admin-input" placeholder="Paste image URL or leave blank for auto-image"
                                value={image} onChange={e => this.setState({image: e.target.value})} />

                            {previewImg && (
                                <div style={{marginTop:'12px',borderRadius:'12px',overflow:'hidden',height:'160px',border:'1px solid #E5E7EB'}}>
                                    <img src={previewImg} alt="Preview" style={{width:'100%',height:'100%',objectFit:'cover'}}
                                        onError={e => { e.target.style.display='none'; }} />
                                </div>
                            )}

                            <button type="submit" className="admin-submit-btn" disabled={loading}>
                                {loading ? 'Saving...' : '✅ Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(EditFooditem);

