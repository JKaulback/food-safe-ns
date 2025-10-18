# Food Safe NS

**RBC HubHack 2025 Submission**

## 👥 Team - NSCC Team 2
- **Project Manager** - Jeremy Paruch
- **Inspiration** - Sarah Poulin
- **DBA** - Merrick Mackay
- **DBA** - Mohammad Shakhawat Hossain
- **Backend Developer** - Justin Kaulback

---

## 🚀 Quick Start (For Judges & Team Members)

**Prerequisites:** Node.js 14+ and npm installed

```bash
# 1. Clone and navigate
git clone https://github.com/JKaulback/food-safe-ns.git
cd food-safe-ns

# 2. Install all dependencies
cd server && npm install
cd ../client && npm install

# 3. Start both applications (use 2 terminals)
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend  
cd client && npm start
```

**🌐 Access:** http://localhost:3001 (auto-opens in browser)

---

## 📖 About

A web application that helps Nova Scotians find food banks and browse their available inventory with advanced filtering options for allergens and dietary requirements.

## ✨ Key Features

- 🗺️ **Smart Search** - Customizable radius (5-100km) with location-based results
- 🔍 **Advanced Filtering** - Allergens, dietary requirements, cultural accommodations
- 📦 **Live Inventory** - Real-time stock with product images and allergen warnings
- 🌐 **Rich Product Data** - OpenFoodFacts API integration for enhanced information
- ♿ **Accessible Design** - Built with accessibility standards in mind

## 🛠️ Tech Stack

**Frontend:** React.js • **Backend:** Node.js/Express • **APIs:** OpenFoodFacts • **Data:** Enhanced JSON samples

## 💻 Detailed Setup (If Needed)

### Environment Configuration (Optional)
- **Server**: Runs on port 5000 by default
- **Client**: Pre-configured for port 3001 in `client/.env`
- **API URL**: Already set to `http://localhost:5000`

### Manual Step-by-Step
1. **Clone:** `git clone https://github.com/JKaulback/food-safe-ns.git`
2. **Server Setup:** `cd server && npm install && npm start`
3. **Client Setup:** `cd ../client && npm install && npm start`
4. **Access:** http://localhost:3001

### Verification
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:5000/api/foodbanks

## Project Structure

```
food-safe-ns/
├── client/                 # React frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend application
│   ├── data/              # Sample JSON data
│   ├── routes/            # Express routes
│   ├── services/          # Business logic services
│   ├── utils/             # Server utilities
│   └── package.json
└── README.md
```

## 🎯 How to Use

**🔍 Search:** Enter address → Set radius (5-100km) → Apply filters → Search  
**📋 Browse:** Click food bank → View "Inventory" tab → Filter by category/allergens  
**⚠️ Allergens:** Supports gluten, dairy/milk, nuts, peanuts, soy, eggs, fish, shellfish (with smart synonym matching)

## 🔧 For Developers

**Key Scripts:**
- `npm start` - Run production servers
- `npm run dev` - Development mode (server only)
- `npm run build` - Build for production (client only)

**API Endpoints:**
- `/api/foodbanks` - Food bank search & filtering
- `/api/foodbanks/:id` - Specific food bank details  
- `/api/inventory/:foodBankId` - Food bank inventory

**Sample Data:** Halifax-area food banks with realistic inventory in `server/data/`

## 🚨 Troubleshooting

**Port Conflicts:** Change ports in `.env` files  
**Dependencies:** Delete `node_modules`, run `npm install` again  
**CORS Errors:** Ensure both servers running + correct API URL  
**Build Issues:** Use Node.js 14+

## 📄 License

Educational project for RBC HubHack 2025

---

**Made with ❤️ for Nova Scotia's food security initiative**
