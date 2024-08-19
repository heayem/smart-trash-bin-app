import axios from "axios";

export const fetchAndCallApi = async (
  bins = [],
  stations = [],
  message = "Analyze this message",
  userLocation = {
    latitude: 11.560173,
    longitude: 104.892526,
    title: "",
    description: "",
  }
) => {
  const response = await axios.post(
    "https://trash-bin-analysis.vercel.app/route-summary",
    {
      userLocation,
      bins,
      stations,
      message,
    }
  );

  if (response?.data?.reply) {
    const reply = response.data.reply;
    const routeDetails = reply.match(
      /Start - (.*) - End at (.*), Total Distance: (.*) km/
    );

    if (routeDetails) {
      const binsOrder = routeDetails[1].split(" - ");
      const endStationId = routeDetails[2].trim();

      const messageRoute = binsOrder
        .map((binId) => {
          const bin = bins.find((b) => b.id === binId.trim());
          if (!bin) {
            alert(`Bin with id ${binId} not found`);
            return null;
          }
          return bin.title;
        })
        .filter((title) => title !== null)
        .join(" -> ");

      const station = stations.find((s) => s.id === endStationId);
      if (!station) {
        alert(`Station ${endStationId} not found`);
        return;
      }

      const finalMessage = `Route: ${messageRoute} finally to ${station.title}`;

      const waypoints = binsOrder
        .map((binId) => {
          const bin = bins.find((b) => b.id === binId.trim());
          if (!bin) {
            alert(`Bin ${binId} not found`);
            return null;
          }

          return {
            latitude: bin.latitude,
            longitude: bin.longitude,
          };
        })
        .filter((waypoint) => waypoint !== null);

      return {
        waypoints,
        endStation: station,
        message: finalMessage,
      };
    } else {
      alert("Route details not found in response.");
    }
  } else {
    alert("No reply in response.");
  }
};
