import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../CSS/Addres.css'
import { getFoodImage } from '../utils/foodImages';

class AdminCheckFood extends Component {
    constructor(props) {
        super(props);
        this.restaurantId = this.props.location?.state?.resid;
        this.state = { listOfFoods: [], loading: true };
    }

    componentDidMount() {
        if (!this.restaurantId) {
            this.props.history.push('/Admin');
            return;
        }
        this.fetchFoodItems();
    }

    fetchFoodItems = () => {
        axios.get("http://localhost:9090/zomato/get-fooditems", { params: { restaurantId: this.restaurantId } })
            .then((resp) => this.setState({ listOfFoods: resp.data || [], loading: false }))
            .catch(() => this.setState({ loading: false }));
    }

    addFood = () => {
        this.props.history.push({ pathname: "/Addfood", state: { resid: this.restaurantId } });
    }

    editFood = (foodItem) => {
        this.props.history.push({ pathname: '/Editfood', state: { resid: this.restaurantId, resdata: foodItem } });
    }

    deleteFood = (foodItemId) => {
        if (!window.confirm("Delete this food item?")) return;
        axios.post("http://localhost:9090/zomato/admin/delete-fooditems", { foodItemId: String(foodItemId) })
            .then(() => this.fetchFoodItems())
            .catch((err) => alert("Failed: " + (err.response?.data || err.message)));
    }

    back = () => { this.props.history.push("/Admin"); }

    render() {
        const { listOfFoods, loading } = this.state;

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

                <div className="admin-form-container" style={{maxWidth:'960px'}}>
                    <div className="admin-main-header" style={{marginBottom:'24px',display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'16px'}}>
                        <div>
                            <h1 style={{fontFamily:'Space Grotesk,sans-serif',fontSize:'28px',fontWeight:800,color:'#1B1B2F',margin:0}}>
                                Restaurant Menu
                            </h1>
                            <p style={{color:'#6B7280',fontSize:'14px',margin:'4px 0 0'}}>
                                {listOfFoods.length} item{listOfFoods.length !== 1 ? 's' : ''} · Restaurant #{this.restaurantId}
                            </p>
                        </div>
                        <button className="admin-add-btn" onClick={this.addFood} style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'12px 24px',background:'#FF6B35',color:'#fff',border:'none',borderRadius:'10px',fontSize:'14px',fontWeight:700,cursor:'pointer',textDecoration:'none'}}>
                            + Add Food Item
                        </button>
                    </div>

                    {loading ? (
                        <div style={{textAlign:'center',padding:'80px 24px'}}>
                            <div className="ff-spinner"></div>
                            <p style={{marginTop:'16px',color:'#6B7280'}}>Loading menu...</p>
                        </div>
                    ) : listOfFoods.length === 0 ? (
                        <div style={{textAlign:'center',padding:'80px 24px',background:'#fff',borderRadius:'16px',border:'1px solid #E5E7EB'}}>
                            <span style={{fontSize:'64px'}}>🍽️</span>
                            <h3 style={{fontSize:'20px',color:'#374151',margin:'16px 0 8px'}}>Menu is empty</h3>
                            <p style={{color:'#6B7280',fontSize:'15px',margin:'0 0 20px'}}>Add your first dish to get started</p>
                            <button className="admin-add-btn" onClick={this.addFood} style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'12px 24px',background:'#FF6B35',color:'#fff',border:'none',borderRadius:'10px',fontSize:'14px',fontWeight:700,cursor:'pointer'}}>
                                + Add Food Item
                            </button>
                        </div>
                    ) : (
                        <div className="admin-menu-grid">
                            {listOfFoods.map((foodItem, idx) => {
                                const foodName = foodItem.foodname || foodItem.foodName || '';
                                const foodId = foodItem.fooditemid || foodItem.foodItemId;
                                const imgSrc = getFoodImage(foodName, idx);

                                return (
                                    <div className="admin-food-card" key={foodId}>
                                        <img
                                            src={imgSrc} alt={foodName} className="admin-food-img"
                                            onError={(e) => { e.target.src = getFoodImage('', idx); }}
                                        />
                                        <div className="admin-food-body">
                                            <h4>{foodName}</h4>
                                            <p className="food-desc">{foodItem.description || "No description"}</p>
                                            <p className="food-price">₹{foodItem.price}</p>
                                            <div className="admin-food-actions">
                                                <button className="admin-food-edit" onClick={() => this.editFood(foodItem)}>✏️ Edit</button>
                                                <button className="admin-food-del" onClick={() => this.deleteFood(foodId)}>🗑️ Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(AdminCheckFood);


