import React, { Component } from 'react';
import axios from 'axios';
import '../CSS/Showuserfood.css';
import UserLogin from './UserLogin';
import { withRouter } from 'react-router-dom';
import { getFoodImage } from '../utils/foodImages';

class ShowUserFoods extends Component {
    constructor(props) {
        super(props);

        const locationState = this.props.location?.state || {};
        this.userPhoneNumber = locationState.phonenum ||
            localStorage.getItem('userPhoneNumber') || '';

        this.state = {
            listOfFoods: [],
            allFoods: [],
            loading: true,
            searchQuery: '',
        };
    }

    componentDidMount() {
        if (!this.userPhoneNumber) {
            this.props.history.push("/Login");
            return;
        }
        this.fetchFoodItems();
    }

    fetchFoodItems = () => {
        axios
            .get(`http://localhost:9090/zomato/user/get-all-food-items`)
            .then((resp) => {
                if (resp.data && Array.isArray(resp.data)) {
                    this.setState({
                        listOfFoods: resp.data,
                        allFoods: resp.data,
                        loading: false
                    });
                } else {
                    this.setState({ loading: false });
                }
            })
            .catch((err) => {
                console.error("Error fetching foods:", err);
                this.setState({ loading: false });
            });
    };

    searchFoods = (e) => {
        const query = e.target.value;
        this.setState({ searchQuery: query });

        if (query.trim() === '') {
            this.setState({ listOfFoods: this.state.allFoods });
            return;
        }

        const q = query.toLowerCase();

        // Also try backend search-by-fooditem API
        axios.post("http://localhost:9090/zomato/user/search-by-fooditem", { search: query })
            .then((resp) => {
                if (resp.data && resp.data.length > 0) {
                    // Map SearchFoodItem results to same format as get-all-food-items
                    const mapped = resp.data.map(item => ({
                        restaurantId: item.restaurantId,
                        restaurantName: item.restaurantName,
                        foodItem: item.foodItem
                    }));
                    this.setState({ listOfFoods: mapped });
                } else {
                    // Fallback to client-side filter
                    const filtered = this.state.allFoods.filter(item => {
                        const fn = (item.foodItem?.foodName || '').toLowerCase();
                        const rn = (item.restaurantName || '').toLowerCase();
                        return fn.includes(q) || rn.includes(q);
                    });
                    this.setState({ listOfFoods: filtered });
                }
            })
            .catch(() => {
                // Fallback to client-side
                const filtered = this.state.allFoods.filter(item => {
                    const fn = (item.foodItem?.foodName || '').toLowerCase();
                    const rn = (item.restaurantName || '').toLowerCase();
                    return fn.includes(q) || rn.includes(q);
                });
                this.setState({ listOfFoods: filtered });
            });
    };

    orderFood = (index) => {
        const foodDetail = this.state.listOfFoods[index];
        if (!foodDetail || !foodDetail.foodItem) {
            alert("Error: Could not find food item data.");
            return;
        }
        const foodData = foodDetail.foodItem;

        let obj = {
            image: foodData.image,
            restaurantid: foodDetail.restaurantId,
            restaurantname: foodDetail.restaurantName,
            phonenumber: this.userPhoneNumber,
            deliveryaddress: null,
            totalamount: foodData.price || 0,
            fooditemid: [foodData.foodItemId],
            foodname: [foodData.foodName],
            amount: [foodData.price || 0],
            quantity: [1],
        };

        this.props.history.push({
            pathname: "/Placeorder",
            state: {
                orddata: obj,
                phonenum: this.userPhoneNumber,
            },
        });
    };

    render() {
        const { listOfFoods, loading, searchQuery } = this.state;

        if (loading) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber} />
                    <div className="ShowUserFoods" style={{textAlign:'center',paddingTop:'80px'}}>
                        <div className="ff-spinner"></div>
                        <p style={{marginTop:'16px',color:'#6B7280'}}>Loading foods...</p>
                    </div>
                </>
            );
        }

        return (
            <>
                <UserLogin phh={this.userPhoneNumber} />
                <div className="ShowUserFoods">
                    <div className="food-search-section">
                        <h2>All Dishes</h2>
                        <div className="food-search-bar">
                            <span className="search-icon">🔍</span>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={this.searchFoods}
                                placeholder="Search dishes by name or restaurant..."
                                className="food-search-input"
                            />
                            {searchQuery && (
                                <button
                                    className="search-clear-btn"
                                    onClick={() => this.setState({ searchQuery: '', listOfFoods: this.state.allFoods })}
                                >✕</button>
                            )}
                        </div>
                        {searchQuery && (
                            <p className="search-result-count">{listOfFoods.length} result{listOfFoods.length !== 1 ? 's' : ''} found</p>
                        )}
                    </div>

                    {listOfFoods.length === 0 ? (
                        <div style={{textAlign:'center',padding:'60px 24px'}}>
                            <h3 style={{color:'#374151'}}>No dishes found</h3>
                            <p style={{color:'#6B7280',margin:'8px 0 20px'}}>Try a different search term</p>
                            <button
                                className="ff-btn ff-btn-secondary"
                                onClick={() => this.setState({ searchQuery: '', listOfFoods: this.state.allFoods })}
                            >Show All Dishes</button>
                        </div>
                    ) : (
                    <div className="foodlistuser">
                        {listOfFoods.map((foodDetail, index) => {
                            const foodData = foodDetail?.foodItem;
                            if (!foodData) return null;
                            const rating = foodData.foodItemRating ? foodData.foodItemRating.toFixed(1) : "New";
                            const price = foodData.price || "199";
                            const foodName = foodData.foodName || 'Delicious Food';
                            const foodImage = getFoodImage(foodName, index);

                            return (
                                <div className="restaurantsf" key={foodData.foodItemId || index} id={index}>
                                    <div className="food-image-container">
                                        <img
                                            src={foodImage}
                                            alt={foodName}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getFoodImage('', index);
                                            }}
                                        />
                                    </div>
                                    <div className="food-content">
                                        <div className="food-info">
                                            <h3 className="food-name">{foodName}</h3>
                                            <p className="food-price">₹{price}</p>
                                            <p className="UFLResname">{foodDetail.restaurantName || 'Restaurant'}</p>
                                            <p className="UFLDescription">{foodData.description || "Freshly prepared with quality ingredients"}</p>
                                        </div>
                                        <div className="food-footer">
                                            <span className="UFLRating">★ {rating}</span>
                                            <button onClick={() => this.orderFood(index)} className="UFLOrderb">
                                                Order Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    )}
                </div>
            </>
        );
    }
}

export default withRouter(ShowUserFoods);





