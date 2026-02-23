<div align="center">

# 🚀 FlavourFleet

### A Full-Stack Food Delivery Platform

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

> *Discover the best food & drinks, delivered fast to your doorstep*

[Getting Started](#-getting-started) · [Features](#-features) · [API Reference](#-api-reference) · [Architecture](#-architecture)

---

</div>

## 📋 Table of Contents

- [About](#-about)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Reference](#-api-reference)
- [Postman Testing](#-postman-testing)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)

---

## 🎯 About

**FlavourFleet** is a complete food delivery platform showcasing **Java** and **Spring Boot** backend development skills. The project features a robust REST API backend built with **Spring Boot**, **Spring Data JPA**, and **Hibernate**, paired with a **React** frontend. It supports two user roles — **Customers** and **Admins** — with full CRUD operations on restaurants and food items, search, order placement, order history, rating system, and profile management.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 21, Spring Boot 3.2.5, Spring Data JPA, Hibernate, REST APIs |
| **Database** | MySQL 8.0 |
| **Frontend** | React 18, React Router v5, Axios, CSS3 |
| **Build Tools** | Maven (backend), npm (frontend) |
| **Libraries** | Lombok 1.18.30, React Icons |

---

## ✨ Features

### 👤 Customer Features

| Feature | Description |
|---------|-------------|
| 🔐 **Sign Up & Login** | Phone number based authentication with password |
| 🔑 **Forgot Password** | Security question based password recovery |
| 👤 **Profile Dropdown** | View name, phone number, change password, logout — from avatar in navbar |
| 🏪 **Browse Restaurants** | View all restaurants with real ratings and images |
| 🍕 **View Menus** | Food items with images, descriptions, prices, and ratings |
| 🔍 **Search** | Search food items and restaurants by name |
| 🛒 **Place Orders** | Select items, set quantities, add more items to same order |
| 📦 **Order History** | View all past orders with rated/unrated status |
| ⭐ **Rate Orders** | Rate restaurant and individual food items after placing order |

### 🛡️ Admin Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Restaurant count, food item stats, sidebar navigation |
| 👤 **Admin Profile** | Profile dropdown with name, phone, admin badge, change password, logout |
| 🏪 **Add / Edit / Delete Restaurant** | Full CRUD on restaurants with image URLs |
| 🍕 **Add / Edit / Delete Food Items** | Full CRUD on food items with auto-image matching |
| 🖼️ **Smart Image Matching** | Auto-assigns food images based on dish name (100+ mappings) |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT  (Browser)                   │
│                                                         │
│   React 18  +  React Router v5  +  Axios                │
│                                                         │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│   │   GENERAL   │  │    USER     │  │    ADMIN    │     │
│   │  Welcome    │  │  Restrnts   │  │  Dashboard  │     │
│   │  Login      │  │  Menu       │  │  Add Rest   │     │
│   │  Signup     │  │  Search     │  │  Edit Rest  │     │
│   │  ForgotPwd  │  │  Order      │  │  Add Food   │     │
│   │             │  │  History    │  │  Edit Food  │     │
│   │             │  │  Rating     │  │  View Menu  │     │
│   └─────────────┘  └─────────────┘  └─────────────┘     │
└────────────────────────────┬────────────────────────────┘
                             │
                             │  HTTP  (REST API)
                             │  Port 3000 → 9090
                             │
┌────────────────────────────┴──────────────────────────────┐
│                   SERVER  (Spring Boot)                   │
│                                                           │
│   ┌───────────────────────────────────────────────────┐   │
│   │                   Controllers                     │   │
│   │   UserController   (/zomato/user/*)               │   │
│   │   AdminController  (/zomato/admin/*)              │   │
│   │   RestaurantController (/zomato/*)                │   │
│   └─────────────────────────┬─────────────────────────┘   │
│                             │                             │
│   ┌─────────────────────────┴─────────────────────────┐   │
│   │                    Services                       │   │
│   │   UserService · AdminService · RestaurantService  │   │
│   │   ValidUser                                       │   │
│   └─────────────────────────┬─────────────────────────┘   │
│                             │                             │
│   ┌─────────────────────────┴─────────────────────────┐   │
│   │                JPA Repositories                   │   │
│   │   UserInfoRepo · RestaurantInfoRepo · FoodItemRepo│   │
│   │   OrderInfoRepo · OrderFoodItemsRepo              │   │
│   │   RestaurantRatingRepo · FoodItemRatingRepo       │   │
│   │   RestaurantImagesRepo                            │   │
│   └─────────────────────────┬─────────────────────────┘   │
│                             │                             │
└────────────────────────────┬──────────────────────────────┘
                             │
                             │  JDBC
                             │
┌────────────────────────────┴──────────────────────────────┐
│                     MySQL Database                        │
│                                                           │
│   Tables:  user_info · restaurant_info · food_items       │
│            restaurant_images · order_info                 │
│            order_food_items · restaurant_rating           │
│            food_item_rating                               │
└───────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Check Command |
|------|---------|---------------|
| **Java JDK** | 21+ | `java --version` |
| **Node.js** | 16+ | `node --version` |
| **npm** | 8+ | `npm --version` |
| **MySQL** | 8.0+ | `mysql --version` |
| **Git** | Any | `git --version` |

### Clone the Repository

```bash
# Step 1: Clone the project
git clone https://github.com/shivam-tamboli/Zomato_clone.git

# Step 2: Navigate into the project folder
cd Zomato_clone
```

---

## 🗄 Database Setup

### Step 1: Create the database

```sql
CREATE DATABASE zomato_clone;
```

> Hibernate will auto-create all tables on first run (`spring.jpa.hibernate.ddl-auto=update`).

### Step 2: Configure credentials

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/zomato_clone
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE
```

### Step 3: Configure backend port (optional)

The backend runs on port **9090** by default. To change it, edit `application.properties`:

```properties
server.port=9090
```

If you change the backend port, also update `frontend/src/config/api.js`:

```javascript
const API_BASE_URL = "http://localhost:YOUR_PORT";
```

### Database Schema (auto-generated)

| Table | Description |
|-------|-------------|
| `user_info` | Users — id, name, phone, password, role (0=admin, 1=user), login_status |
| `restaurant_info` | Restaurants — id, name, address, rating, num_of_rating |
| `restaurant_images` | Restaurant images — id, link, restaurant_id (FK) |
| `food_items` | Food items — id, name, description, price, image, rating, restaurant_id (FK) |
| `order_info` | Orders — id, user_id, restaurant_id, total_amount, delivery_address, order_flag |
| `order_food_items` | Order line items — id, food_name, price, quantity, order_id (FK) |
| `restaurant_rating` | Restaurant ratings — id, rating, restaurant_id, user_id |
| `food_item_rating` | Food item ratings — id, rating, food_item_id, user_id |

---

## ▶️ Running the Application

### Terminal 1 — Backend

```bash
cd backend
./mvnw spring-boot:run
```
> Starts at `http://localhost:9090`

### Terminal 2 — Frontend

```bash
cd frontend
npm install    # first time only
npm start
```
> Starts at `http://localhost:3000`

### Open the App

| URL | Page |
|-----|------|
| `http://localhost:3000` | 🏠 Home / Welcome |
| `http://localhost:3000/Login` | 🔐 Login |
| `http://localhost:3000/Signup` | 📝 Sign Up |
| `http://localhost:3000/Admin` | 🛡️ Admin Dashboard |

---

## 👥 User Roles

### Creating an Admin Account

1. Go to `/Signup`
2. Fill in all fields
3. In the **"Admin Code"** field, enter: **`FLAVOURFLEET2026`**
4. Click "Create Account" → Login → Redirected to **Admin Dashboard**

### Creating a Customer Account

1. Go to `/Signup`
2. Fill in all fields, leave **Admin Code** blank
3. Login → Redirected to **Restaurants** page

| Role | Value | Redirect | Capabilities |
|------|-------|----------|-------------|
| **Admin** | `0` | `/Admin` | Manage restaurants & food items |
| **Customer** | `1` | `/Userrestaurant` | Browse, order, rate |

### Profile Dropdown (Both Roles)

On both user and admin sides, clicking the **avatar** in the navbar opens a dropdown showing:

- **Name** and **Phone Number** (fetched from `/get-profile` API)
- **Change Password** → navigates to Forgot Password page
- **Logout** → clears session and redirects to home

Admin dropdown also shows an **Admin** role badge.

---

## 📡 API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/zomato/get-restaurants` | Get all restaurants |

### User Endpoints (`/zomato/user/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/signup` | Register user |
| `POST` | `/login` | Login |
| `POST` | `/logout` | Logout |
| `POST` | `/forgot-password` | Get security question |
| `POST` | `/reset-password` | Reset password |
| `POST` | `/get-profile` | Get user name, phone, address, role |
| `POST` | `/search-by-name` | Search restaurants by name |
| `POST` | `/search-by-fooditem` | Search food items |
| `POST` | `/place-order` | Place order |
| `POST` | `/get-all-order-details` | Get order history |
| `POST` | `/rate-order` | Rate order |
| `POST` | `/get-fooditems` | Get food items by restaurant |
| `GET` | `/get-all-food-items` | Get all food items |
| `GET` | `/get-all-restaurants` | Get all restaurants |

### Admin Endpoints (`/zomato/admin/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/add-restaurant` | Add restaurant |
| `POST` | `/edit-restaurant` | Edit restaurant |
| `POST` | `/delete-restaurant` | Delete restaurant |
| `POST` | `/add-fooditems` | Add food item |
| `POST` | `/edit-fooditems` | Edit food item |
| `POST` | `/delete-fooditems` | Delete food item |

---

## 🧪 Postman Testing

You can test all APIs using **Postman**. Here are some examples:

### Check if backend is running

- **Method:** `GET`
- **URL:** `http://localhost:9090/zomato/get-restaurants`

### Signup

- **Method:** `POST`
- **URL:** `http://localhost:9090/zomato/user/signup`
- **Body (JSON):**
```json
{
  "name": "John Doe",
  "phonenumber": "9876543210",
  "address": "123 Main St",
  "secretquestion": "What city?",
  "answer": "Mumbai",
  "password": "pass123"
}
```

### Admin Signup (with admin code)

- **Method:** `POST`
- **URL:** `http://localhost:9090/zomato/user/signup`
- **Body (JSON):**
```json
{
  "name": "Admin User",
  "phonenumber": "9999999999",
  "address": "Admin HQ",
  "secretquestion": "What city?",
  "answer": "Delhi",
  "password": "admin123",
  "admincode": "FLAVOURFLEET2026"
}
```

### Login

- **Method:** `POST`
- **URL:** `http://localhost:9090/zomato/user/login`
- **Body (JSON):**
```json
{
  "phonenumber": "9999999999",
  "password": "admin123"
}
```
- **Response:** `Success_admin` or `Success_user`

### Get User Profile

- **Method:** `POST`
- **URL:** `http://localhost:9090/zomato/user/get-profile`
- **Body (JSON):**
```json
{
  "phonenumber": "9999999999"
}
```
- **Response:**
```json
{
  "name": "Admin User",
  "phone": "9999999999",
  "address": "Admin HQ",
  "role": "0"
}
```

### Search Food Items

- **Method:** `POST`
- **URL:** `http://localhost:9090/zomato/user/search-by-fooditem`
- **Body (JSON):**
```json
{
  "search": "pizza"
}
```

---

## 📂 Project Structure

```
Zomato_clone/
│
├── backend/                                          # Spring Boot Backend
│   ├── pom.xml                                       # Maven config + Lombok annotation processing
│   ├── mvnw                                          # Maven wrapper (Mac/Linux)
│   ├── mvnw.cmd                                      # Maven wrapper (Windows)
│   └── src/
│       └── main/
│           ├── java/com/zomato/clone/backend/
│           │   ├── ZomatoCloneApplication.java       # Main Spring Boot entry point
│           │   │
│           │   ├── config/
│           │   │   └── DataLoader.java               # Seeds sample data on startup
│           │   │
│           │   ├── filter/
│           │   │   └── CORSFilter.java               # CORS configuration filter
│           │   │
│           │   ├── controller/
│           │   │   ├── UserController.java           # User APIs (auth, orders, ratings, profile)
│           │   │   ├── AdminController.java          # Admin APIs (CRUD restaurants & food)
│           │   │   └── RestaurantController.java     # Public APIs (get restaurants)
│           │   │
│           │   ├── service/
│           │   │   ├── UserService.java              # Auth, search, orders, ratings, profile
│           │   │   ├── AdminService.java             # Restaurant & food item CRUD
│           │   │   ├── RestaurantService.java        # Restaurant data service
│           │   │   └── ValidUser.java                # Phone/password validation
│           │   │
│           │   ├── models/
│           │   │   ├── UserInfo.java                 # User entity (role-based)
│           │   │   ├── RestaurantInfo.java           # Restaurant entity
│           │   │   ├── RestaurantImages.java         # Restaurant images entity
│           │   │   ├── RestaurantDetails.java        # Restaurant details DTO
│           │   │   ├── RestaurantRating.java         # Restaurant rating entity
│           │   │   ├── FoodItem.java                 # Food item entity
│           │   │   ├── FoodItemDetails.java          # Food item details DTO
│           │   │   ├── FoodItemRating.java           # Food item rating entity
│           │   │   ├── OrderInfo.java                # Order entity
│           │   │   ├── OrderFoodItems.java           # Order line items entity
│           │   │   └── SearchFoodItem.java           # Search result DTO
│           │   │
│           │   └── repository/
│           │       ├── UserInfoRepo.java             # User JPA repository
│           │       ├── RestaurantInfoRepo.java       # Restaurant JPA repository
│           │       ├── RestaurantImagesRepo.java     # Restaurant images repository
│           │       ├── RestaurantRatingRepo.java     # Restaurant rating repository
│           │       ├── FoodItemRepo.java             # Food item repository
│           │       ├── FoodItemRatingRepo.java       # Food item rating repository
│           │       ├── OrderInfoRepo.java            # Order repository
│           │       └── OrderFoodItemsRepo.java       # Order food items repository
│           │
│           └── resources/
│               ├── application.properties            # DB + server config (port 9090)
│               ├── static/                           # Static resources
│               └── templates/                        # Template files
│
├── frontend/                                         # React Frontend
│   ├── package.json                                  # npm dependencies
│   ├── public/
│   │   ├── index.html                                # HTML entry point
│   │   ├── manifest.json                             # PWA manifest
│   │   ├── logo192.png                               # App icon
│   │   └── IMAGES/                                   # Static images
│   │       ├── CF/                                   # Country flag images
│   │       └── SOCIAL/                               # Social media icons
│   │
│   └── src/
│       ├── App.js                                    # Root React component
│       ├── App.css                                   # Global app styles
│       ├── index.js                                  # React entry point
│       ├── index.css                                 # Global CSS variables & resets
│       ├── reportWebVitals.js                        # Performance monitoring
│       ├── setupTests.js                             # Test setup
│       │
│       ├── config/
│       │   └── api.js                                # Centralized API base URL config
│       │
│       └── components/
│           ├── Routercomponents.js                   # All route definitions
│           ├── History.js                            # Browser history config
│           │
│           ├── GENERAL/                              # Public pages
│           │   ├── Welcome.js                        # Landing page
│           │   ├── Login.js                          # Login page
│           │   ├── Signup.js                         # Signup page (with admin code)
│           │   ├── Forgotpassword.js                 # Password recovery
│           │   ├── Grid.js                           # Grid component
│           │   └── Label.js                          # Label component
│           │
│           ├── ADMIN/                                # Admin pages
│           │   ├── AdminLogin.js                     # Admin dashboard + profile dropdown
│           │   ├── Addrestaurant.js                  # Add restaurant form
│           │   ├── Editrestaurant.js                 # Edit restaurant form
│           │   ├── Checkfood.js                      # View menu (food card grid)
│           │   ├── Addfood.js                        # Add food item form
│           │   └── Editfood.js                       # Edit food item form
│           │
│           ├── USER/                                 # Customer pages
│           │   ├── UserLogin.js                      # User navbar + profile dropdown
│           │   ├── ShowUserRestaurants.js             # Browse restaurants
│           │   ├── ShowUserRestaurantFoods.js         # Restaurant menu + add to order
│           │   ├── ShowUserFoods.js                   # All dishes + search
│           │   ├── PlaceOrder.js                      # Order placement + add more
│           │   ├── UserOrders.js                      # Order history + rated status
│           │   └── RateOrder.js                       # Rate restaurant & food items
│           │
│           ├── CSS/                                  # All stylesheets
│           │   ├── Welcome.css                       # Landing page
│           │   ├── Login.css                         # Auth pages (login, signup, forgot)
│           │   ├── Signup.css                        # Signup specific
│           │   ├── Fpass.css                         # Forgot password
│           │   ├── Adminlogin.css                    # Admin dashboard + profile dropdown
│           │   ├── Addres.css                        # Add restaurant form
│           │   ├── Editres.css                       # Edit restaurant
│           │   ├── Editrestaurant.css                # Edit restaurant styles
│           │   ├── Checkfood.css                     # View menu
│           │   ├── Addfood.css                       # Add food form
│           │   ├── Editfood.css                      # Edit food form
│           │   ├── Userlogin.css                     # User navbar + profile dropdown
│           │   ├── Showuserres.css                   # Browse restaurants
│           │   ├── Showuserfood.css                  # All dishes
│           │   ├── Showusrrf.css                     # Restaurant foods
│           │   ├── Placeorder.css                    # Place order
│           │   ├── UserOrders.css                    # Order history
│           │   ├── RateOrder.css                     # Rate order
│           │   ├── Orderhis.css                      # Order history styles
│           │   ├── Grid.css                          # Grid styles
│           │   └── Label.css                         # Label styles
│           │
│           └── utils/
│               └── foodImages.js                     # Smart food image matching (100+ dishes)
│
└── README.md
```

---

## 🔧 Configuration

### Backend Port

The backend server runs on **port 9090** by default. This is configured in:

```
backend/src/main/resources/application.properties
```

### Frontend API Base URL

All frontend API calls use a centralized configuration file:

```
frontend/src/config/api.js
```

```javascript
const API_BASE_URL = "http://localhost:9090";
```

> **Note:** If you change the backend port, update this file to match.

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--ff-primary` | `#FF6B35` | Buttons, links, branding |
| `--ff-accent` | `#2ED573` | Success states, ratings |
| `--ff-text` | `#1B1B2F` | Headings, primary text |
| `--ff-bg` | `#FAFAFA` | Page backgrounds |
| `--ff-danger` | `#FF4757` | Errors, delete actions |
| **Fonts** | Space Grotesk + Inter | Headings + body text |

---

## 📄 License

This project is for educational purposes. Built with ❤️ to demonstrate Java & Spring Boot backend development skills.

---

<div align="center">

**Built with 🚀 by [Shivam Tamboli](https://github.com/shivam-tamboli)**

*Java 21 · Spring Boot 3.2.5 · Spring Data JPA · Hibernate · MySQL · REST APIs · React*

</div>
