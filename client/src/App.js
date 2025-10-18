  import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/global.css';

// Import pages
import Home from './pages/Home';
import FoodBankDetails from './pages/FoodBankDetails';
import InventoryManagement from './pages/InventoryManagement';

// Import components
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/foodbank/:id" element={<FoodBankDetails />} />
            <Route path="/manage" element={<InventoryManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
