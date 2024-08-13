import { database, ref, get, set, update, remove, onValue } from '../../firebaseConfig'; 

class BinService {
  static async fetchData(binId) {
    try {
      const dbRef = ref(database, `trash-bin-database/${binId}`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return { success: true, data };
      } else {
        return { success: true, data: null };
      }
    } catch (error) {
      return { success: false, message: 'Error fetching data: ' + error.message };
    }
  }

  static async getAll(path) {
    try {
      const dbRef = ref(database, path);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return { success: true, data };
      } else {
        return { success: true, data: null };
      }
    } catch (error) {
      return { success: false, message: 'Error fetching all data: ' + error.message };
    }
  }

  static async createOrUpdateData(binId, data) {
    try {
      const dbRef = ref(database, `trash-bin-database/${binId}`);
      await set(dbRef, data);
      return { success: true, message: `Data for ${binId} has been set/updated.` };
    } catch (error) {
      return { success: false, message: 'Error creating/updating data: ' + error.message };
    }
  }

  static async updateData(binId, data) {
    try {
      const dbRef = ref(database, `trash-bin-database/${binId}`);
      await update(dbRef, data);
      return { success: true, message: `Data for ${binId} has been updated.` };
    } catch (error) {
      return { success: false, message: 'Error updating data: ' + error.message };
    }
  }

  static async deleteData(binId) {
    try {
      const dbRef = ref(database, `trash-bin-database/${binId}`);
      await remove(dbRef);
      return { success: true, message: `Data for ${binId} has been deleted.` };
    } catch (error) {
      return { success: false, message: 'Error deleting data: ' + error.message };
    }
  }

  static listenForData(binId, callback) {
    try {
      const dbRef = ref(database, `trash-bin-database/${binId}`);
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        callback({ success: true, data });
      });
    } catch (error) {
      callback({ success: false, message: 'Error setting up real-time listener: ' + error.message });
    }
  }
}

export default BinService;
