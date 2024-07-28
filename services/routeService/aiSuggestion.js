const API_BASE_URL = "https://smart-trash-bin-service.vercel.app";

export const fetchAllRouteCoordinates = async (userLocation, markers) => {
  console.log(userLocation);
  console.log(markers);
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userLocation: userLocation,
        bins: markers,
        stations: markers,
        message: "Analy for this message",
      }),
    });

    if (!response.ok) {
      console.error("HTTP error! Status: ", response.status);
      throw new Error(`HTTP error! Status: ${response}`);
    }

    const data = await response.json();

    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching route coordinates:", error);
    throw error;
  }
};
