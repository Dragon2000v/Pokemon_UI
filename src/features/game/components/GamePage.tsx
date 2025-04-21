const handleSurrender = async () => {
  try {
    await surrender(gameId);
    // No need for additional state updates or navigation here
    // The surrender function will handle the redirect
  } catch (error) {
    console.error("Error surrendering:", error);
    // Handle error if needed
  }
};
