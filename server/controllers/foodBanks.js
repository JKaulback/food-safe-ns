const FoodBankController = {
  filterByLocation: async (foodBanks, location, radius) => {
    // Simulate filtering food banks by location and radius
    
    return foodBanks.filter(bank =>
      bank.location.toLowerCase().includes(location.toLowerCase())
    );
  }
};
