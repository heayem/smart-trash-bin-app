import {
  database,
  ref,
  get,
  set,
  update,
  remove,
  onValue,
} from "../../firebaseConfig";

class ScheduleService {
  // Read: Fetch a single day's schedulestatic async fetchData(day) {
  static async fetchData(day) {
    try {
      const dbRef = ref(database, `notification/${day}`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        // Process the raw data if needed
        const processedData = Object.keys(rawData).map((key) => ({
          description: rawData[key]["description"],
          time: rawData[key]["time"],
          title: rawData[key]["title"],
        }));
        return { success: true, data: processedData };
      } else {
        return { success: true, data: null };
      }
    } catch (error) {
      return {
        success: false,
        message: "Error fetching data: " + error.message,
      };
    }
  }

  // Read: Fetch all schedules
  static async getAll() {
    try {
      const dbRef = ref(database, "notification");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return { success: true, data };
      } else {
        return { success: true, data: null };
      }
    } catch (error) {
      return {
        success: false,
        message: "Error fetching all data: " + error.message,
      };
    }
  }

  // Create: Add new schedule data for a specific day
  static async createData(day, events) {
    try {
      const dbRef = ref(database, `notification/${day}`);
      const snapshot = await get(dbRef);

      // Read existing data
      let existingData = snapshot.exists() ? snapshot.val() : {};
      let highestIndex = 0;

      // Determine the highest existing index
      Object.keys(existingData).forEach((key) => {
        const index = parseInt(key.split("-")[1], 10);
        if (!isNaN(index) && index > highestIndex) {
          highestIndex = index;
        }
      });

      // Add new events with incremented indices
      const newData = events.reduce((acc, event, idx) => {
        const newIndex = highestIndex + idx + 1; // Start from the next number
        acc[`event-${newIndex}`] = {
          title: event.title,
          description: event.description,
          time: event.time,
        };
        return acc;
      }, {});

      // Combine existing data with new data
      const updatedData = { ...existingData, ...newData };

      // Write updated data back to the database
      await set(dbRef, updatedData);
      console.log("Data submitted successfully for day:", day);
      return { success: true, message: `Data for ${day} has been created.` };
    } catch (error) {
      console.error("Error creating data:", error.message);
      return {
        success: false,
        message: "Error creating data: " + error.message,
      };
    }
  }

  // Update: Update existing schedule data for a specific day
  static async updateData(day, data) {
    try {
      const dbRef = ref(database, `notification/${day}`);
      await update(dbRef, data);
      return { success: true, message: `Data for ${day} has been updated.` };
    } catch (error) {
      return {
        success: false,
        message: "Error updating data: " + error.message,
      };
    }
  }

  // Delete: Remove schedule data for a specific day
  static async deleteData(day) {
    try {
      const dbRef = ref(database, `notification/${day}`);
      await remove(dbRef);
      return { success: true, message: `Data for ${day} has been deleted.` };
    } catch (error) {
      return {
        success: false,
        message: "Error deleting data: " + error.message,
      };
    }
  }

  // Real-time updates: Listen for changes to schedule data for a specific day
  static listenForData(day, callback) {
    try {
      const dbRef = ref(database, `notification/${day}`);
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        callback({ success: true, data });
      });
    } catch (error) {
      callback({
        success: false,
        message: "Error setting up real-time listener: " + error.message,
      });
    }
  }
}

export default ScheduleService;
