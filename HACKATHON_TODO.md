# Food Safe NS - Hackathon TODO List

## 📋 MVP Development Checklist

### 🏗️ **Day 1 - Foundation & Core Features (8-10 hours)**

#### **Setup & Infrastructure (2 hours)**
<<<<<<< HEAD
- [X] **Project Setup & Structure** - Create folder structure, package.json files, install dependencies
=======
- [ ] **Project Setup & Structure** - Create folder structure, package.json files, install dependencies
>>>>>>> 17c2aface44123eb4d291f1415b7544c8e19b81b
- [ ] **Backend Foundation** - Express server, CORS, basic routing
- [ ] **React App Setup** - Initialize React, install axios/react-router-dom, basic routing

#### **Data & Models (1.5 hours)**
- [ ] **Sample Data Creation** - Nova Scotia food banks, allergen types, sample inventory
- [ ] **Data Models** - FoodBank.js and FoodItem.js with proper schema

#### **Backend API (2 hours)**
- [ ] **Food Bank API Routes** - GET /api/foodbanks with location filtering
- [ ] **Inventory API Routes** - GET /api/inventory/:foodbankId

#### **Frontend Core (2.5 hours)**
- [ ] **Core React Components** - Header, SearchBar, FoodBankCard, LoadingSpinner
- [ ] **Location Search Feature** - PostalCode/city input component
- [ ] **Home Page Implementation** - Search form and results display

#### **End of Day 1 Goal:** Users can search for food banks by location and see basic results

---

### 🚀 **Day 2 - Features & Polish (8-10 hours)**

#### **Filtering & Safety (3 hours)**
- [ ] **Allergen Filter Component** - Multi-select allergen checkboxes
- [ ] **API Integration** - Connect frontend to backend endpoints
- [ ] **Allergen Safety Features** - Matching logic and visual warnings

#### **Details & Inventory (2 hours)**
- [ ] **Food Bank Details Page** - Contact info, hours, inventory display
- [ ] **Error Handling & Loading States** - Proper UX for API calls

#### **Polish & Deployment (3 hours)**
- [ ] **Mobile Responsive Design** - CSS media queries and mobile layout
- [ ] **UI Polish & Styling** - Visual improvements, icons, color scheme
- [ ] **Testing & Bug Fixes** - End-to-end testing and validation

#### **Final Hour**
- [ ] **Deployment Preparation** - Environment setup and deploy to hosting

#### **End of Day 2 Goal:** Fully functional MVP deployed and ready for demo

---

## 🎯 **Priority Order for Maximum Impact**

### **Critical Path (Must Complete):**
1. Basic Express server + sample data
2. React app with search functionality  
3. API connection for food bank listings
4. Location-based search working
5. Basic allergen filtering
6. Mobile-responsive design

### **High Value Features (If Time Permits):**
7. Detailed food bank pages with inventory
8. Visual allergen warnings
9. Enhanced UI/UX polish
10. Food bank staff inventory management

### **Nice-to-Have (Stretch Goals):**
11. Map integration with food bank locations
12. Cultural/dietary preference filters
13. Distance calculation and sorting
14. Export/share functionality

---

## 🛠️ **Quick Start Commands**

```bash
# Root setup
npm init -y
npm install concurrently

# Backend setup
cd server
npm init -y
npm install express cors dotenv nodemon geolib lodash
npm install -D nodemon

# Frontend setup  
cd ../client
npx create-react-app . 
npm install axios react-router-dom

# Start development
cd ..
npm run dev
```

---

## 📊 **Team Task Distribution Suggestions**

### **Backend Developer:**
- Server setup and API routes
- Sample data creation
- Location filtering logic
- Allergen matching algorithms

### **Frontend Developer:**
- React components and pages
- UI/UX design and styling
- API integration
- Mobile responsiveness

### **Full-Stack Developer:**
- API integration testing
- End-to-end functionality
- Deployment setup
- Bug fixes and polish

---

## ⚡ **Success Metrics for Demo**

1. **Functional Search:** Users can find food banks by location
2. **Allergen Safety:** Clear warnings for allergen-containing foods
3. **Mobile Friendly:** Works well on phones/tablets
4. **Real Data:** Uses realistic Nova Scotia food bank information
5. **Deployed:** Live demo accessible via URL

**Target Demo Flow:**
1. Show homepage with location search
2. Enter "Halifax, NS" and show nearby food banks
3. Select allergen filters (e.g., "dairy-free")
4. Click on a food bank to see inventory
5. Highlight allergen warnings and safe options