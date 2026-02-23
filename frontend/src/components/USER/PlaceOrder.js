import React, { Component } from 'react';
import axios from 'axios';
import '../CSS/Placeorder.css'
import UserLogin from './UserLogin';

export default class PlaceOrder extends Component {

    constructor(props){
        super(props);
        console.log("=== PLACE ORDER CONSTRUCTOR ===");
        console.log("STATE : ", this.props.location.state);
        console.log("Order data:", this.props.location.state.orddata);

        // 🛠 FIX: Get phone number from navigation state
        this.obj = this.props.location.state.orddata;
        this.userPhoneNumber = this.props.location.state.phonenum ||
            this.obj.phonenumber ||
            localStorage.getItem('userPhoneNumber') ||
            '';

        console.log("Extracted phone number:", this.userPhoneNumber);

        // Ensure phone number is set
        this.obj.phonenumber = this.userPhoneNumber;

        // Initialize order
        this.obj.totalamount = 0;
        if (this.obj.amount && this.obj.amount.length > 0) {
            this.obj.amount.forEach((value, index) => {
                this.obj.totalamount += parseInt(value) || 0;
                this.obj.quantity[index] = "1";
            });
        }

        this.state = {
            totalamount: this.obj.totalamount
        };

        console.log("Initial order object:", this.obj);
    }

    billCheck = (e) => {
        const tempFoodItemId = [...this.obj.fooditemid];
        const tempFoodName = [...this.obj.foodname];
        const tempAmount = [...this.obj.amount];
        const tempQuantity = [...this.obj.quantity];

        const newFoodItemId = [];
        const newFoodName = [];
        const newAmount = [];
        const newQuantity = [];

        tempFoodItemId.forEach((value, index) => {
            const qtyInput = document.getElementById('quantity' + index);
            if (qtyInput && qtyInput.value !== "") {
                if (qtyInput.value === "0") {
                    console.log("Removing item at index:", index);
                } else {
                    newFoodItemId.push(value);
                    newFoodName.push(tempFoodName[index]);
                    newAmount.push(tempAmount[index]);
                    newQuantity.push(qtyInput.value.toString());
                }
            } else {
                newFoodItemId.push(value);
                newFoodName.push(tempFoodName[index]);
                newAmount.push(tempAmount[index]);
                newQuantity.push(tempQuantity[index]);
            }
        });

        if (newFoodItemId.length === 0 && tempFoodItemId.length > 0) {
            newFoodItemId.push(tempFoodItemId[0]);
            newFoodName.push(tempFoodName[0]);
            newAmount.push(tempAmount[0]);
            newQuantity.push("1");

            const firstQtyInput = document.getElementById('quantity0');
            if (firstQtyInput) {
                firstQtyInput.value = "1";
            }
            console.log("Prevented empty order, kept first item");
        }

        this.obj.fooditemid = newFoodItemId;
        this.obj.foodname = newFoodName;
        this.obj.amount = newAmount;
        this.obj.quantity = newQuantity;

        // Ensure phone number is always set
        this.obj.phonenumber = this.userPhoneNumber;

        this.obj.totalamount = 0;
        this.obj.amount.forEach((value, index) => {
            this.obj.totalamount += parseInt(value) * parseInt(this.obj.quantity[index]);
        });
        this.setState({ totalamount: this.obj.totalamount });

        console.log("After billCheck - order object:", this.obj);
    }

    addMore = (e) => {
        this.props.history.push({
            pathname: "/Addmore",
            state: {
                orddata: this.obj,
                phonenum: this.userPhoneNumber
            }
        });
    }

    order = (e) => {
        e.preventDefault();
        console.log("Order object before processing:", this.obj);

        // Validate phone number before sending
        if (!this.userPhoneNumber || this.userPhoneNumber.trim() === "") {
            alert("❌ Phone number is required to place order. Please go back and login again.");
            return;
        }

        if(this.obj.fooditemid && this.obj.fooditemid.length > 0){
            const validItems = [];
            const validNames = [];
            const validAmounts = [];
            const validQuantities = [];

            this.obj.fooditemid.forEach((id, index) => {
                if(id !== "undefined" && id !== undefined && this.obj.foodname[index] !== null) {
                    validItems.push(String(id));
                    validNames.push(String(this.obj.foodname[index] || "Unknown Food"));
                    validAmounts.push(String(this.obj.amount[index]));
                    validQuantities.push(String(this.obj.quantity[index]));
                }
            });

            this.obj.fooditemid = validItems;
            this.obj.foodname = validNames;
            this.obj.amount = validAmounts;
            this.obj.quantity = validQuantities;
        }

        if(!this.obj.fooditemid || this.obj.fooditemid.length === 0){
            alert("No valid food items selected");
            return;
        }

        this.obj.totalamount = Number(this.obj.totalamount);

        const deliveryAddress = document.getElementById('deliveryAddress').value;
        if(!deliveryAddress || deliveryAddress.trim() === ""){
            alert("Please enter delivery address");
            return;
        }
        this.obj.deliveryaddress = deliveryAddress;

        // Final validation and logging
        console.log("Final order object being sent:", JSON.stringify(this.obj, null, 2));
        console.log("Phone number verification:", this.obj.phonenumber);

        axios.post("http://localhost:9090/zomato/user/place-order", this.obj)
            .then((resp) => {
                console.log("Order successful:", resp.data);

                // After placing order, redirect to rate the order
                // First fetch the latest order to get its ID
                axios.post("http://localhost:9090/zomato/user/get-all-order-details", {
                    phonenumber: this.userPhoneNumber
                }).then((orderResp) => {
                    const orders = orderResp.data || [];
                    // Get the most recent order (last one)
                    const latestOrder = orders[orders.length - 1];
                    if (latestOrder) {
                        const orderForRating = {
                            orderId: latestOrder.orderId,
                            orderid: latestOrder.orderId,
                            restaurantId: latestOrder.restaurantId,
                            restaurantid: latestOrder.restaurantId,
                            restaurantName: latestOrder.restaurantName,
                            restaurantname: latestOrder.restaurantName,
                            orderFoodItems: (latestOrder.orderFoodItems || []).map(item => ({
                                foodItemId: item.foodItemId,
                                fooditemid: item.foodItemId,
                                foodName: item.foodName,
                                foodname: item.foodName,
                                quantity: item.quantity,
                                amount: item.amount
                            }))
                        };

                        this.props.history.push({
                            pathname: "/Rate",
                            state: {
                                obj: orderForRating,
                                phonenum: this.userPhoneNumber
                            }
                        });
                    } else {
                        // Fallback to orders page if we can't find the order
                        this.props.history.push({
                            pathname: "/Orders",
                            state: { phonenum: this.userPhoneNumber }
                        });
                    }
                }).catch(() => {
                    // Fallback to orders page
                    this.props.history.push({
                        pathname: "/Orders",
                        state: { phonenum: this.userPhoneNumber }
                    });
                });
            })
            .catch((err) => {
                console.log("Order error:", err);
                console.log("Error response:", err.response);
                alert("Failed to place order. Please check your phone number and try again.");
            });
    }

    increment = (e) => {
        e.preventDefault();
        console.log("Increment button:", e.target.id);
        let index = Number(e.target.id[1]);
        let qtyInput = document.getElementsByClassName("ordqnt")[index];

        if(qtyInput) {
            let qty = qtyInput.value;
            if(qty === "") {
                qtyInput.value = 1;
            } else {
                qtyInput.value = Number(qty) + 1;
            }
            if (this.obj.fooditemid.length > 0) {
                this.billCheck();
            }
        }
    }

    decrement = (e) => {
        e.preventDefault();
        console.log("Decrement button:", e.target.id);
        let index = Number(e.target.id[1]);
        let qtyInput = document.getElementsByClassName("ordqnt")[index];

        if(qtyInput) {
            let qty = qtyInput.value;
            if(qty !== "" && qty !== "1") {
                qtyInput.value = Number(qty) - 1;
            }
            if (this.obj.fooditemid.length > 0) {
                this.billCheck();
            }
        }
    }

    back = () => {
        this.props.history.push({
            pathname: "/User",
            state: {
                phonenum: this.userPhoneNumber
            }
        });
    }

    render() {
        if(this.obj.fooditemid.length === 0){
            return(
                <>
                <UserLogin phh={this.userPhoneNumber} />
                <div className='PlaceOrder'>
                    <div className='order-container'>
                        <div className='order-header'>
                            <h2>No items in order</h2>
                            <p>Please go back and add food items to your order</p>
                        </div>
                        <button onClick={this.back} id="ordsub">← Go Back</button>
                    </div>
                </div>
                </>
            );
        } else {
            return (
                <>
                <UserLogin phh={this.userPhoneNumber} />
                <div className='PlaceOrder'>
                    <div className='order-container'>
                        <div className='order-header'>
                            <h2>Place Order</h2>
                            <p style={{color: '#636e72', marginBottom: '20px'}}>{this.obj.restaurantname}</p>
                        </div>

                        {this.obj.image && (
                            <img
                                src={this.obj.image}
                                alt={this.obj.restaurantname}
                                className='orderimg'
                                onError={(e) => {e.target.style.display='none'}}
                            />
                        )}

                        <div className='Orderform'>
                            {
                                this.obj.fooditemid.map((value, index) => {
                                    return(
                                        <div className='FoodItem' key={index} id={index}>
                                            <p className='Orddishname'>{this.obj.foodname[index]}</p>
                                            <p className='Orddishprice'>₹{this.obj.amount[index]}</p>
                                            <p className='ordqntl'>Quantity</p>
                                            <div className='quantity-controls'>
                                                <button className="ordd" onClick={this.decrement} id={'d'+index}>-</button>
                                                <input
                                                    type='number'
                                                    min={1}
                                                    placeholder='1'
                                                    id={'quantity'+index}
                                                    onChange={this.billCheck}
                                                    className='ordqnt'
                                                    defaultValue="1"
                                                    readOnly
                                                ></input>
                                                <button className="ordi" onClick={this.increment} id={'i'+index}>+</button>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>

                        <div className='Totalamt'>
                            Total Amount: ₹{this.state.totalamount}
                        </div>

                        <input
                            type="text"
                            placeholder='Enter Delivery Address'
                            id='deliveryAddress'
                        />

                        <div className='order-actions'>
                            <button onClick={this.addMore} id="addmore">+ Add More</button>
                            <button onClick={this.order} id="ordsub">Place Order</button>
                        </div>
                    </div>
                </div>
                </>
            );
        }
    }
}