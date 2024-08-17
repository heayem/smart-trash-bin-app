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
  
    static async fetchData(day) {
      try {
        const dbRef = ref(database, `notification/${day}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          
          const processedData = Object.keys(rawData).map((key) => ({
            description: rawData[key].description,
            time: rawData[key].time,
            title: rawData[key].title,
          }));
          return { success: true, data: processedData };
        } else {
          return { success: true, data: [] }; 
        }
      } catch (error) {
        return {
          success: false,
          message: "Error fetching data: " + error.message,
        };
      }
    }

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

  static async createData(day, events) {
    try {
      const dbRef = ref(database, `notification/${day}`);
      const snapshot = await get(dbRef);

      let existingData = snapshot.exists() ? snapshot.val() : {};
      let highestIndex = 0;

      Object.keys(existingData).forEach((key) => {
        const index = parseInt(key.split("-")[1], 10);
        if (!isNaN(index) && index > highestIndex) {
          highestIndex = index;
        }
      });

      const newData = events.reduce((acc, event, idx) => {
        const newIndex = highestIndex + idx + 1; 
        acc[`event-${newIndex}`] = {
          title: event.title,
          description: event.description,
          time: event.time,
        };
        return acc;
      }, {});

      
      const updatedData = { ...existingData, ...newData };

      await set(dbRef, updatedData);
      return { success: true, message: 'Data has been created.' };
    } catch (error) {
      return {
        success: false,
        message: "Error creating data: " + error.message,
      };
    }
  }

  static async updateData(day, data) {
    try {
      const dbRef = ref(database, `notification/${day}`);
      await update(dbRef, data);
      return { success: true, message: `Data has been updated.` };
    } catch (error) {
      return {
        success: false,
        message: "Error updating data: " + error.message,
      };
    }
  }

  static async deleteData(day) {
    try {
      const dbRef = ref(database, `notification/${day}`);
      await remove(dbRef);
      return { success: true, message: `Data has been deleted.` };
    } catch (error) {
      return {
        success: false,
        message: "Error deleting data: " + error.message,
      };
    }
  }

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

  static async remove(day, eventId) {
    try {
      const dbRef = ref(database, `notification/${day}/${eventId}`);
      await remove(dbRef);
      return { success: true, message: "Event deleted successfully." };
    } catch (error) {
      return { success: false, message: "Error deleting data: " + error.message };
    }
  }
}

export default ScheduleService;
