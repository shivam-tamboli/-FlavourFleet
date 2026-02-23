import React, { Component } from 'react';
import axios from 'axios';
import '../CSS/Showusrrf.css'
import UserLogin from './UserLogin';
import { getFoodImage } from '../utils/foodImages';

export default class ShowUserRestaurantFoods extends Component {
    constructor(props){
        super(props);

        // Safe data extraction with sessionStorage fallback
        const state = props.location?.state || {};
        const orddata = state.orddata || {};

        this.restaurantname = orddata.restaurantname || "";
        this.userPhoneNumber = state.phonenum || orddata.phonenumber ||
            localStorage.getItem('userPhoneNumber') || '';
        this.restaurantId = orddata.restaurantid;

        // Save to sessionStorage for page refresh survival
        if (this.restaurantId) {
            sessionStorage.setItem('ff_current_restaurant', JSON.stringify({
                restaurantid: this.restaurantId,
                restaurantname: this.restaurantname
            }));
        } else {
            // Try to recover from sessionStorage
            try {
                const saved = JSON.parse(sessionStorage.getItem('ff_current_restaurant'));
                if (saved) {
                    this.restaurantId = saved.restaurantid;
                    this.restaurantname = saved.restaurantname || "Restaurant";
                }
            } catch(e) {}
        }

        if (!this.restaurantname) this.restaurantname = "Restaurant";

        // Initialize state based on whether we have data
        if (!this.restaurantId) {
            this.state = {
                error: "No restaurant selected. Please go back and pick a restaurant.",
                loading: false,
                listOfFoods: [],
                selectedItems: new Set()
            };
        } else {
            this.state = {
                loading: true,
                listOfFoods: null,
                error: null,
                selectedItems: new Set()
            };
        }

        // 🛠 FIX: Preserve existing order items if coming from "Add More"
        const existingOrder = orddata.fooditemid ? orddata : null;
        this.order = {
            restaurantid: this.restaurantId,
            restaurantname: this.restaurantname,
            phonenumber: this.userPhoneNumber,
            deliveryaddress: orddata.deliveryaddress || null,
            totalamount: 0,
            fooditemid: existingOrder ? [...(existingOrder.fooditemid || [])] : [],
            foodname: existingOrder ? [...(existingOrder.foodname || [])] : [],
            amount: existingOrder ? [...(existingOrder.amount || [])] : [],
            quantity: existingOrder ? [...(existingOrder.quantity || [])] : []
        };
        this.isAddMore = !!(existingOrder && existingOrder.fooditemid && existingOrder.fooditemid.length > 0);
    }

    componentDidMount() {
        console.log("🍽️ COMPONENT DID MOUNT");

        // 🛠 FIX: Check if we have restaurantId before making API call
        if (!this.restaurantId) {
            console.error("Cannot fetch foods: No restaurant ID");
            this.setState({
                error: "Cannot load menu. Restaurant information is missing.",
                loading: false
            });
            return;
        }

        // 🛠 FIX: Use the correct request format
        const requestData = {
            restaurantid: this.restaurantId
        };

        console.log("📤 Fetching foods for restaurant:", requestData);

        axios.post("http://localhost:9090/flavorfleet/user/get-fooditems", requestData)
            .then((resp)=>{
                console.log("✅ Food items response:", resp.data);

                if(resp.data && resp.data.length > 0){
                    this.setState({
                        listOfFoods: resp.data,
                        loading: false
                    });
                } else {
                    this.setState({
                        listOfFoods: [],
                        loading: false,
                        error: "No food items available for this restaurant."
                    });
                }
            })
            .catch((err)=>{
                console.error("❌ Error fetching food items:", err);
                this.setState({
                    error: "Failed to load food items. Please try again.",
                    loading: false
                });
            });
    }

    orderFoods = (e) => {
        if (!this.state.listOfFoods || this.state.listOfFoods.length === 0) {
            alert("No food items available to order");
            return;
        }

        // Keep existing items (from "Add More"), then add newly selected items
        const existingIds = new Set(this.order.fooditemid.map(String));
        let newItemsAdded = 0;

        // Collect newly selected items (skip duplicates already in order)
        this.state.listOfFoods.forEach((value, index) => {
            const checkbox = document.getElementById('select' + index);
            if (checkbox && checkbox.checked === true) {
                const itemId = String(value.fooditemid || value.foodItemId);
                if (!existingIds.has(itemId)) {
                    this.order.fooditemid.push(itemId);
                    this.order.foodname.push(String(value.foodname || value.foodName));
                    this.order.amount.push(String(value.price));
                    this.order.quantity.push("1");
                    newItemsAdded++;
                }
            }
        });

        if (this.order.fooditemid.length === 0) {
            alert("Please select at least one food item to order");
            return;
        }

        if (this.isAddMore && newItemsAdded === 0) {
            alert("Please select new items to add, or go back to your order");
            return;
        }

        console.log("📦 Final order data:", this.order);

        // Navigate to place order
        this.props.history.push({
            pathname: "/Placeorder",
            state: {
                orddata: this.order,
                phonenum: this.userPhoneNumber
            }
        });
    };

    back = () => {
        this.props.history.push({
            pathname: "/Userrestaurant",
            state: {
                phonenum: this.userPhoneNumber
            }
        });
    };

    handleCheckboxChange = (index) => {
        const checkbox = document.getElementById('select' + index);
        const card = checkbox?.parentElement;

        if (checkbox?.checked) {
            this.state.selectedItems.add(index);
            if (card) card.classList.add('selected');
        } else {
            this.state.selectedItems.delete(index);
            if (card) card.classList.remove('selected');
        }
        this.setState({});
    };

    render() {
        const { listOfFoods, loading, error } = this.state;

        if (error) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber} />
                    <div className='Addmorewindow' style={{textAlign:'center',paddingTop:'80px'}}>
                        <h2>Menu</h2>
                        <p style={{color:'#6B7280',margin:'16px 0'}}>{error}</p>
                        <button onClick={this.back} className="ff-btn ff-btn-primary">← Back to Restaurants</button>
                    </div>
                </>
            );
        }

        if (loading) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber} />
                    <div className='Addmorewindow' style={{textAlign:'center',paddingTop:'80px'}}>
                        <div className="ff-spinner"></div>
                        <p style={{marginTop:'16px',color:'#6B7280'}}>Loading menu...</p>
                    </div>
                </>
            );
        }

        if (!listOfFoods || listOfFoods.length === 0) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber} />
                    <div className='Addmorewindow' style={{textAlign:'center',paddingTop:'80px'}}>
                        <h2>{this.restaurantname}</h2>
                        <p style={{color:'#6B7280',margin:'16px 0'}}>No food items available</p>
                        <button onClick={this.back} className="ff-btn ff-btn-primary">← Back to Restaurants</button>
                    </div>
                </>
            );
        }

        return (
            <>
                <UserLogin phh={this.userPhoneNumber} />
                <div className='Addmorewindow'>
                    <h1 id="artext6">{this.restaurantname}</h1>
                    <p style={{textAlign:'center',color:'#6B7280',marginBottom:'24px',fontSize:'15px'}}>Select items to add to your order</p>
                    <div className='SMFlist'>
                        {listOfFoods.map((value, index) => {
                            const foodName = value.foodname || value.foodName || '';
                            // Always use smart image based on food name
                            const imageSrc = getFoodImage(foodName, index);

                            const foodId = value.fooditemid || value.foodItemId;
                            const isSelected = this.state.selectedItems.has(index);
                            return (
                                <div className={`restaurant1${isSelected ? ' selected' : ''}`}
                                     key={foodId || index}
                                     id={foodId}
                                     onClick={() => {
                                         const checkbox = document.getElementById('select' + index);
                                         if (checkbox) {
                                             checkbox.checked = !checkbox.checked;
                                             this.handleCheckboxChange(index);
                                         }
                                     }}>
                                    <img
                                        src={imageSrc}
                                        alt={foodName}
                                        className='Checkfood'
                                        onError={(e) => { e.target.src = getFoodImage('', index); }}
                                    />
                                    <div id="fooddata">
                                        <p>{foodName}</p>
                                        <p>₹{value.price}</p>
                                        <p className='Description'>{value.description || "Freshly prepared"}</p>
                                        <p>★ {(value.foodItemRating || value.fooditemrating) ? (value.foodItemRating || value.fooditemrating).toFixed(1) : "New"}</p>
                                    </div>
                                    <label htmlFor={'select' + index} id="selectfood">
                                        {isSelected ? '✓ Added' : '+ Add'}
                                    </label>
                                    <input
                                        type="checkbox"
                                        id={'select' + index}
                                        className='selectedfoodc'
                                        onChange={() => this.handleCheckboxChange(index)}
                                    />
                                </div>
                            );
                        })}
                        <button id='orderFoods' onClick={this.orderFoods}>Place Order →</button>
                    </div>
                </div>
            </>
        );
    }
}