import React, { Component } from 'react';
import axios from 'axios';
import '../CSS/Showuserres.css'
import UserLogin from './UserLogin';

export default class ShowUserRestaurants extends Component {
    constructor(props){
        super(props);

        this.userPhoneNumber = props.location?.state?.phonenum ||
            localStorage.getItem('userPhoneNumber') || '';

        this.state = {
            listOfRest: [],
            allRestaurants: [],
            loading: true,
            error: null,
            searchQuery: ''
        };
    }

    componentDidMount(){
        console.log("Fetching restaurants from backend...");

        axios.get("http://localhost:9090/zomato/user/get-all-restaurants")
            .then((resp)=>{
                console.log("API Response:", resp.data);

                const transformedRestaurants = resp.data.map(restaurant => ({
                    restaurantid: restaurant.restaurantId,
                    restaurantname: restaurant.restaurantName,
                    restaurantaddress: restaurant.restaurantAddress,
                    restaurantrating: restaurant.restaurantRating,
                    restaurantimages: restaurant.restaurantImages || []
                }));

                console.log("Transformed restaurants:", transformedRestaurants);

                if(transformedRestaurants.length > 0){
                    this.setState({
                        listOfRest: transformedRestaurants,
                        allRestaurants: transformedRestaurants,
                        loading: false
                    });
                } else {
                    this.setState({
                        loading: false,
                        error: "No restaurants found"
                    });
                }
            })
            .catch((err)=>{
                console.log("Error fetching restaurants:", err);
                this.setState({
                    error: "Failed to load restaurants",
                    loading: false
                });
            });
    }

    checkFoods = (restaurant) => {
        console.log("🎯 Navigation to foods page");

        const navigationData = {
            restaurantname: restaurant.restaurantname,
            phonenumber: this.userPhoneNumber,
            restaurantid: restaurant.restaurantid
        };

        console.log("📤 Sending:", navigationData);

        this.props.history.push({
            pathname: "/Userfoods",
            state: {
                orddata: navigationData,
                phonenum: this.userPhoneNumber
            }
        });
    };

    navigateToOrders = () => {
        this.props.history.push({
            pathname: "/Orders",
            state: {
                phonenum: this.userPhoneNumber
            }
        });
    };

    navigateToRateOrders = () => {
        this.props.history.push({
            pathname: "/Orders",
            state: {
                phonenum: this.userPhoneNumber
            }
        });
    };

    searchRestaurants = (e) => {
        const searchValue = e.target.value;
        this.setState({ searchQuery: searchValue });

        if(searchValue.trim() === ""){
            this.setState({listOfRest: this.state.allRestaurants});
            return;
        }

        // Use backend search-by-name API
        axios.post("http://localhost:9090/zomato/user/search-by-name", { search: searchValue })
            .then((resp) => {
                const results = resp.data.map(r => ({
                    restaurantid: r.restaurantId,
                    restaurantname: r.restaurantName,
                    restaurantaddress: r.restaurantAddress,
                    restaurantrating: r.restaurantRating,
                    restaurantimages: r.restaurantImages || []
                }));
                this.setState({ listOfRest: results });
            })
            .catch(() => {
                // Fallback to client-side search
                const filtered = this.state.allRestaurants.filter(r =>
                    r.restaurantname.toLowerCase().includes(searchValue.toLowerCase())
                );
                this.setState({ listOfRest: filtered });
            });
    };

    getRestaurantImage = (name, index) => {
        const n = (name || '').toLowerCase();
        if (n.includes('pizza') || n.includes('italian')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop';
        if (n.includes('burger') || n.includes('american')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop';
        if (n.includes('chinese') || n.includes('noodle') || n.includes('dragon')) return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop';
        if (n.includes('biryani') || n.includes('mughlai') || n.includes('nawab')) return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop';
        if (n.includes('dosa') || n.includes('south') || n.includes('idli')) return 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop';
        if (n.includes('sushi') || n.includes('japanese')) return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop';
        if (n.includes('cafe') || n.includes('coffee') || n.includes('brew')) return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop';
        if (n.includes('tandoor') || n.includes('punjab') || n.includes('dhaba')) return 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop';
        if (n.includes('sweet') || n.includes('dessert') || n.includes('cake') || n.includes('bakery')) return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop';
        if (n.includes('thai') || n.includes('asian')) return 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop';
        if (n.includes('street') || n.includes('chaat')) return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop';
        if (n.includes('seafood') || n.includes('fish')) return 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=300&fit=crop';
        // Generic — use different images based on index so they don't repeat
        const generic = [
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop'
        ];
        return generic[index % generic.length];
    };

    render() {
        const { listOfRest, loading, error, searchQuery } = this.state;

        if (loading) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber} />
                    <div className="user-restaurants-container">
                        <div className="loading-message">
                            <div className="ff-spinner"></div>
                            <h2>Loading restaurants...</h2>
                        </div>
                    </div>
                </>
            );
        }

        if (error) {
            return (
                <>
                    <UserLogin phh={this.userPhoneNumber} />
                    <div className="user-restaurants-container">
                        <div className="error-message">
                            <h2>⚠️ {error}</h2>
                            <button onClick={() => window.location.reload()} className="retry-btn">Try Again</button>
                        </div>
                    </div>
                </>
            );
        }

        return (
            <>
                <UserLogin phh={this.userPhoneNumber} />
                <div className="user-restaurants-container">
                {/* Header Section with Navigation */}
                <header className="restaurants-header">
                    <div className="header-content">
                        <h1>Explore Restaurants</h1>
                        <p className="subtitle">Find the best food near you</p>
                    </div>
                </header>

                {/* Search Section */}
                <div className="search-section">
                    <h2>Restaurants</h2>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={this.searchRestaurants}
                        placeholder='Search Restaurant by name...'
                        className='search-input'
                    />
                    <hr className="section-divider" />
                </div>

                {/* Restaurants List */}
                <div className='restaurants-list'>
                    {listOfRest.length === 0 ? (
                        <div className="no-restaurants-message">
                            <h2>No Restaurants Found</h2>
                            <p>Try adjusting your search criteria</p>
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        this.setState({
                                            listOfRest: this.state.allRestaurants,
                                            searchQuery: ''
                                        });
                                    }}
                                    className="clear-search-btn"
                                >
                                    Show All Restaurants
                                </button>
                            )}
                        </div>
                    ) : (
                        listOfRest.map((restaurant, index) => {
                            const hasImages = restaurant.restaurantimages && restaurant.restaurantimages.length > 0;
                            const smartImage = this.getRestaurantImage(restaurant.restaurantname, index);

                            return(
                                <div className="restaurant-card" key={restaurant.restaurantid}>
                                    <div className="restaurant-images">
                                        <img
                                            src={hasImages ? restaurant.restaurantimages[0].link : smartImage}
                                            alt={restaurant.restaurantname}
                                            className='restaurant-image'
                                            onError={(e) => { e.target.src = smartImage; }}
                                        />
                                    </div>

                                    <h3>{restaurant.restaurantname}</h3>
                                    <p className="restaurant-rating">
                                        ⭐ {restaurant.restaurantrating && restaurant.restaurantrating > 0 ? restaurant.restaurantrating.toFixed(1) : "New"}
                                    </p>
                                    <p className="restaurant-address">
                                        📍 {restaurant.restaurantaddress}
                                    </p>

                                    <button
                                        className='view-menu-btn'
                                        onClick={() => this.checkFoods(restaurant)}
                                    >
                                        View Menu →
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            </>
        );
    }
}