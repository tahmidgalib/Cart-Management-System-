# 🚗 Live Cart Tracking — JU (Jahangirnagar University)

[![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS%20%7C%20Node%20%7C%20Express%20%7C%20MySQL-blue?style=for-the-badge)](https://github.com/tahmidgalib/Cart-Management-System-)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Map Engine](https://img.shields.io/badge/Map%20Engine-Leaflet.js-orange?style=for-the-badge)](https://leafletjs.com/)

An interactive, live-simulated smart transit management and passenger boarding web application tailored for the **Jahangirnagar University (JU)** campus. This project bridges the gap between campus commuters and drivers by providing real-time vehicle geolocation, automated dynamic fare calculation, instant wallet top-ups, and a QR-based contactless boarding verification mechanism.

---

## 🌟 Key Features

*   🗺️ **Interactive Geolocation Map:** Live tracking of multiple campus passenger carts (e.g., `UC-101`, `UC-102`) plotted using **Leaflet.js** with customized SVG/HTML markers depicting real-time passenger counts and available seating statuses.
*   🔄 **Real-Time Geolocation Simulation:** Integrated background simulator that models vehicle physics, dynamic passenger boarding states, and coordinate drift across standard campus hubs.
*   🎟️ **Contactless QR-Code Boarding:**
    *   **Generates High-Quality Boarding Pass QR Codes** containing encrypted profile configurations upon student/staff registration via `QRCode.js`.
    *   **Embedded In-Browser QR Decoder** (`jsQR`) that scans customer QR codes using the device camera, queries profile validity, updates wallet states, and securely boards passengers.
*   💳 **Commuter Wallet & Top-up:** Logged-in users can securely monitor their campus transit balance, receive a complimentary starter credit of ৳100 upon registration, and perform instant top-ups.
*   📐 **Fare Matrix Calculator:** Instantly calculates travel fares between principal hubs (Main Gate, Bottola, Old/New Arts, Shahid Minar, Shahid Rafiq-Jabbar Hall) customized by user category (Student, Staff, Guest).
*   🌐 **Hybrid Persistence Architecture:** Seamlessly syncs user authentication profiles, local wallet updates, and simulation settings between a secure **MySQL** backend and robust fallback client **LocalStorage**.

---

## ⚙️ Architecture & Technology Stack

The project is structured under an active client-server hierarchy:

### Frontend
- **Structure & Layout:** Semantic HTML5.
- **Styling Engine:** Vanilla CSS3 featuring glassmorphism elements, sticky headers, CSS keyframe transition micro-animations, and full mobile-responsive flexbox layouts.
- **Mapping & Geofencing:** Leaflet.js rendering OpenStreetMap tiles.
- **QR Operations:** `QRCode.js` for pass rendering, `jsQR` for camera image canvas stream decoding.

### Backend & Databases
- **Runtime Environment:** Node.js
- **Server Framework:** Express.js (handling cross-origin resource sharing via `cors` and parsing via `body-parser`).
- **Database Engine:** MySQL
- **Driver Driver:** `mysql2` supporting promises and prepared statements.

---

## 📁 Repository Structure

```directory
├── Backend/
│   ├── node_modules/        # Server dependencies
│   ├── package.json         # Server dependency manifests
│   ├── package-lock.json    # Strict dependency lockfile
│   └── server.js            # Express API server & MySQL database router
├── index.html               # Main frontend user interface
├── index.js                 # Frontend application & simulation engine
├── style.css                # Custom visual styling & design system
├── LICENSE                  # Open-source MIT license details
└── README.md                # Comprehensive documentation
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
Before setting up the project, make sure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   [MySQL Server](https://dev.mysql.com/downloads/mysql/) (packaged stand-alone or via XAMPP/WampServer)
*   A modern web browser with camera permissions enabled (for QR scanner testing)

---

### 2. Database Schema Configuration
Launch your MySQL Command Line or open `phpMyAdmin`, create a database named `live_cart2`, and execute the following SQL script to set up the necessary `users` table:

```sql
CREATE DATABASE IF NOT EXISTS `live_cart2` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `live_cart2`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `universityId` VARCHAR(50) NOT NULL UNIQUE,
  `type` VARCHAR(50) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `pass` VARCHAR(255) NOT NULL,
  `balance` DECIMAL(10, 2) DEFAULT 100.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed data for testing credentials
INSERT INTO `users` (`name`, `universityId`, `type`, `department`, `pass`, `balance`) 
VALUES 
('রহিম আহমেদ', '2021001', 'student', 'CSE', '1234', 250.00),
('করিম হোসেন', '2021002', 'student', 'Math', '1234', 180.00),
('ফারহানা বেগম', 'S001', 'staff', 'Admin', '1234', 500.00)
ON DUPLICATE KEY UPDATE universityId=universityId;
```

---

### 3. Server-Side Installation (Backend)
Navigate to the `Backend` directory, install the required NPM packages, and spin up the API gateway:

```bash
# Navigate to Backend folder
cd Backend

# Install dependencies (Express, Cors, MySQL2, Body-Parser)
npm install

# Start the Express server
node server.js
```
The server will boot and run on: **`http://localhost:3000`**

---

### 4. Client-Side Execution (Frontend)
Since the frontend consists of native web files, it does not require a compilation step. 

*   Simply open the root `index.html` file in your preferred web browser, OR
*   Launch it via a local development server (e.g., VS Code's **Live Server** extension or Node's `http-server`).

---

## 🧪 Demo Credentials & Testing Walkthrough

To verify the app features immediately without registering a new account, you can use these built-in simulation profiles:

| Role | University ID | Password | Sample Starting Wallet |
| :--- | :--- | :--- | :--- |
| **Student** | `2021001` | `1234` | ৳250 |
| **Student** | `2021002` | `1234` | ৳180 |
| **Staff** | `S001` | `1234` | ৳500 |

### Recommended Test Run:
1.  **Map Tracking:** Go to the **লাইভ ম্যাপ** tab. Watch the live carts simulate routes around Jahangirnagar University. Click **ট্র্যাক করুন** next to any active cart to center the Leaflet map and open its stats popup.
2.  **Fare Lookup:** Open the **ভাড়া হিসাব** tab. Select "মেইন গেট" as the starting point and "শহিদ রফিক-জব্বার হল" as the destination. Select your commuter type and click **ভাড়া হিসাব করুন** to view distance and price calculations.
3.  **Account Registration & QR Generation:** 
    *   Click on **লগইন** in the header.
    *   Switch to **রেজিস্ট্রেশন** inside the modal.
    *   Fill out the user form. Upon submitting, a customized, downloadable **boarding pass QR code** will render instantly. 
    *   Click **QR ডাউনলোড করুন** to save it locally.
4.  **QR Boarding Verification:** 
    *   Head to the **স্ক্যানার** tab.
    *   Upload/Scan your downloaded QR code badge using your webcam, or simply write your custom `University ID` under **ম্যানুয়াল এন্ট্রি** and select **যাচাই করুন**.
    *   Once validated, click **বোর্ড করুন** to see the system seat count increment and update the real-time simulation counters!

---

## 📜 License

This project is licensed under the terms of the [MIT License](LICENSE). Feel free to modify, extend, or distribute as required.

---

*Developed for smart transit and commuter tracking at Jahangirnagar University.*