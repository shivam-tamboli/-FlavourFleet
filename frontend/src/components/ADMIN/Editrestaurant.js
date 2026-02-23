import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../CSS/Addres.css'

class AdminEditRest extends Component {
    constructor(props) {
        super(props);
        const restaurantData = this.props.location?.state?.resobj;
        const restaurantId = this.props.location?.state?.resid;

        this.restaurantId = restaurantId;
        const images = (restaurantData?.restaurantImages || []).map(img => img.link || '');

        this.state = {
            restaurantName: restaurantData?.restaurantName || '',
            restaurantAddress: restaurantData?.restaurantAddress || '',
            imagesLink: images,
            imageInput: '',
            loading: false
        };
    }

    componentDidMount() {
        if (!this.restaurantId) {
            alert("Missing data.");
            this.props.history.push('/Admin');
        }
    }

    submit = (e) => {
        e.preventDefault();
        const { restaurantName, restaurantAddress, imagesLink } = this.state;
        if (!restaurantName || !restaurantAddress) { alert("Fill all fields"); return; }

        this.setState({ loading: true });
        axios.post("http://localhost:9090/zomato/admin/edit-restaurant", {
            restaurantId: Number(this.restaurantId),
            restaurantName, restaurantAddress,
            restaurantImages: imagesLink.filter(l => l && l.trim())
        })
        .then(() => { this.props.history.push('/Admin'); })
        .catch((err) => {
            this.setState({ loading: false });
            alert("Failed: " + (err.response?.data || err.message));
        });
    }

    addImage = () => {
        const { imageInput, imagesLink } = this.state;
        if (!imageInput) return;
        if (imagesLink.length >= 5) { alert("Maximum 5 images"); return; }
        this.setState({ imagesLink: [...imagesLink, imageInput], imageInput: '' });
    }

    removeImage = (idx) => {
        this.setState(prev => ({ imagesLink: prev.imagesLink.filter((_, i) => i !== idx) }));
    }

    back = () => { this.props.history.push('/Admin'); }

    render() {
        const { restaurantName, restaurantAddress, imagesLink, imageInput, loading } = this.state;
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
                            <span className="afc-icon">✏️</span>
                            <div>
                                <h2>Edit Restaurant</h2>
                                <p>Update restaurant #{this.restaurantId} details</p>
                            </div>
                        </div>

                        <form onSubmit={this.submit}>
                            <label className="admin-label">Restaurant Name</label>
                            <input type="text" className="admin-input" value={restaurantName}
                                onChange={e => this.setState({restaurantName: e.target.value})} maxLength={50} required />

                            <label className="admin-label">Address</label>
                            <input type="text" className="admin-input" value={restaurantAddress}
                                onChange={e => this.setState({restaurantAddress: e.target.value})} maxLength={100} required />

                            <label className="admin-label">Images ({imagesLink.length}/5)</label>
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
                                <input type="url" className="admin-input" placeholder="Paste image URL..."
                                    value={imageInput} onChange={e => this.setState({imageInput: e.target.value})} />
                                <button type="button" className="admin-img-add-btn" onClick={this.addImage}
                                    disabled={imagesLink.length >= 5}>+ Add</button>
                            </div>

                            <button type="submit" className="admin-submit-btn" disabled={loading}>
                                {loading ? 'Saving...' : '✅ Update Restaurant'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(AdminEditRest);

