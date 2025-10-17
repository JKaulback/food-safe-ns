# Food Safe NS - Food Bank Inventory & Search System

## Simplified Structure for 2-Day Hackathon

```
food-safe-ns/
├── README.md
├── .gitignore
├── package.json                # Root package.json for workspace scripts
│
├── client/                     # React Frontend (MVP Focus)
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/         # Keep components simple and flat
│   │   │   ├── Header.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FoodBankCard.jsx
│   │   │   ├── InventoryList.jsx
│   │   │   ├── AllergenFilter.jsx
│   │   │   ├── CulturalFilter.jsx
│   │   │   ├── LocationSearch.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/              # Main pages only
│   │   │   ├── Home.jsx        # Search food banks
│   │   │   ├── FoodBankDetails.jsx  # View food bank inventory
│   │   │   ├── InventoryManagement.jsx  # For food bank staff
│   │   │   └── UserProfile.jsx # User allergen preferences
│   │   ├── services/           # API calls
│   │   │   └── api.js          # Single API service file
│   │   ├── utils/              # Essential utilities only
│   │   │   ├── helpers.js
│   │   │   └── allergenUtils.js
│   │   ├── styles/             # Simple styling approach
│   │   │   └── global.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .env                    # Frontend environment variables
│
├── server/                     # Node.js + Express Backend (MVP Focus)
│   ├── controllers/            # Simplified structure - no src folder
│   │   ├── foodBanks.js        # Food bank controller
│   │   ├── inventory.js        # Food inventory controller
│   │   └── search.js           # Search and filtering controller
│   ├── middleware/             # Essential middleware only
│   │   ├── cors.js
│   │   └── errorHandler.js
│   ├── models/                 # Simple data models
│   │   ├── FoodBank.js         # Food bank information
│   │   ├── FoodItem.js         # Individual food items
│   │   └── User.js             # User preferences (if needed)
│   ├── routes/                 # API routes
│   │   ├── foodBanks.js        # Food bank CRUD operations
│   │   ├── inventory.js        # Inventory management
│   │   └── search.js           # Search and filtering
│   ├── utils/                  # Backend utilities
│   │   ├── database.js         # Database connection (if needed)
│   │   ├── allergenMatcher.js  # Allergen matching logic
│   │   └── locationUtils.js    # Distance/location calculations
│   ├── data/                   # Static/sample data for MVP
│   │   ├── sample-food-banks.json
│   │   ├── sample-inventory.json
│   │   ├── allergen-types.json
│   │   └── cultural-categories.json
│   ├── app.js                  # Express app setup
│   ├── server.js               # Server entry point
│   ├── package.json
│   └── .env                    # Backend environment variables
│
└── docs/                       # Minimal documentation
    ├── API.md                  # Quick API reference
    └── SETUP.md                # Quick setup guide
```

## Key Features of This Hackathon Structure

### 1. **Simplified but Organized**
- Flat component structure for quick development
- Essential folders only - no over-engineering
- Focus on core functionality

### 2. **MVP-Focused Frontend**
- Search food banks by location with radius filtering
- Filter by allergens (dairy-free, gluten-free, nut-free, etc.)
- Filter by cultural/dietary preferences (halal, kosher, vegan, etc.)
- View food bank inventory with allergen warnings
- Simple but effective UI for both users and food bank staff

### 3. **Streamlined Backend**
- Food bank location and contact management
- Inventory tracking with allergen tagging
- Location-based search with distance calculations
- Allergen matching and safety warnings
- Cultural/dietary preference categorization

### 4. **Hackathon-Optimized Features**
- Sample data for Nova Scotia food banks
- Pre-defined allergen categories and cultural tags
- Mock inventory data for immediate testing
- Simple location matching (postal code or city-based for MVP)
- No complex user authentication for MVP

## Quick Setup for Hackathon

### 1. **Initialize Root Package.json:**
```json
{
  "name": "food-safe-ns",
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm start",
    "setup": "cd client && npm install && cd ../server && npm install"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
```

### 2. **Frontend Quick Start:**
```bash
cd client
npx create-react-app . --template typescript  # or regular if no TypeScript
npm install axios react-router-dom
```

### 3. **Backend Quick Start:**
```bash
cd server
npm init -y
npm install express cors dotenv nodemon
npm install -D nodemon
```

### 4. **Additional Dependencies for Food Bank Features:**
```bash
# Frontend additional packages
cd client
npm install axios react-router-dom leaflet react-leaflet

# Backend additional packages  
cd server
npm install geolib lodash
```

### 4. **Essential Package.json Scripts for Server:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## Hackathon Development Strategy

### **Day 1 Focus:**
1. Set up basic Express server with sample food bank data
2. Create React app with location search and food bank listing
3. Build core components (LocationSearch, FoodBankCard, AllergenFilter)
4. Connect frontend to backend API for food bank search
5. Basic styling and mobile responsiveness

### **Day 2 Focus:**
1. Add inventory management for food banks
2. Implement detailed allergen filtering and warnings
3. Add cultural/dietary preference filtering
4. Polish UI/UX with better visual indicators for allergens
5. Deploy to free hosting platform

## MVP Feature Priorities

### **Must-Have (Core MVP):**
- Search food banks by location (city/postal code)
- Filter by major allergens (dairy, gluten, nuts, shellfish)
- View food bank contact info and hours
- Basic inventory display with allergen warnings
- Mobile-responsive design

### **Nice-to-Have (If Time Permits):**
- Interactive map with food bank locations
- Cultural/dietary filters (halal, kosher, vegan)
- Food bank staff portal for inventory updates
- Distance calculation and sorting
- Export/share food bank information

### **Sample Data Categories:**
- **Allergens:** Dairy, Gluten, Nuts, Shellfish, Eggs, Soy, Sesame
- **Cultural/Dietary:** Halal, Kosher, Vegan, Vegetarian, Organic
- **Food Categories:** Canned goods, Fresh produce, Dairy, Meat, Baked goods
- **Nova Scotia Regions:** Halifax, Cape Breton, Annapolis Valley, South Shore, etc.

This structure will let you move fast while keeping things organized enough that your team can work efficiently together!