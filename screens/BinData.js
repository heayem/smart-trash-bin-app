import React, { useState, useEffect } from "react";
import { BarChart } from "react-native-gifted-charts";
import { View, Text, StyleSheet, Alert } from "react-native";
import { getDatabase, ref, get, set, update } from "firebase/database";
import Loading from "../components/Loading";
import moment from "moment";

const database = getDatabase();

const BinData = () => {
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndUpdateData = async () => {
      try {
        const today = moment().format("ddd");
        const startOfWeek = moment().startOf("week").format("YYYY-MM-DD");
        const endOfWeek = moment().endOf("week").format("YYYY-MM-DD");

        const [dailyData, weeklyData, todayBinData] = await Promise.all([
          fetchData("daily-bin-data"),
          fetchData("summed-bin-data"),
          fetchData("trash-bin-data"),
        ]);

        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const updatedDailyData = initializeWeekData(dailyData, daysOfWeek);
        const updatedWeeklyData = initializeWeekData(weeklyData, daysOfWeek);

        processBinData(todayBinData, updatedDailyData, daysOfWeek);

        const chartData = generateChartData(updatedWeeklyData, daysOfWeek);
        setBarData(chartData);

        await update(ref(database, "summed-bin-data"), updatedWeeklyData);

        if (moment().isSame(endOfWeek, "day")) {
          await set(ref(database, "daily-bin-data"), {});
        }
      } catch (error) {
        Alert.alert("Error", "Error fetching or updating data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdateData();
  }, []);

  const fetchData = async (path) => {
    const snapshot = await get(ref(database, path));
    return snapshot.exists() ? snapshot.val() : {};
  };

  const initializeWeekData = (data, daysOfWeek) => {
    return daysOfWeek.reduce((acc, day) => {
      acc[day] = data[day] || 0;
      return acc;
    }, {});
  };

  const processBinData = (binData, dailyData, daysOfWeek) => {
    Object.values(binData).forEach((bin) => {
      const binFill = parseFloat(bin.fill);
      const binDate = moment(bin.timestamp).format("ddd");
      if (daysOfWeek.includes(binDate)) {
        dailyData[binDate] = (dailyData[binDate] || 0) + binFill;
      }
    });

    Object.keys(dailyData).forEach((day) => {
      weeklyData[day] = (weeklyData[day] || 0) + dailyData[day];
    });
  };

  const generateChartData = (weeklyData, daysOfWeek) => {
    return daysOfWeek.map((day) => ({
      value: weeklyData[day] || 0,
      label: day,
      frontColor: colors[day] || "#000000",
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trash bin data in weekly</Text>
      <BarChart
        data={barData}
        isAnimated
        showFractionalValue
        showYAxisIndices
        noOfSections={4}
        maxValue={Math.max(...barData.map((item) => item.value), 400)}
        yAxisLabel="Level"
        xAxisLabel="Day"
        barWidth={30}
        barBackgroundColor="#E0E0E0"
        xAxisLabelStyle={styles.xAxisLabel}
        yAxisLabelStyle={styles.yAxisLabel}
        xAxisLabelRotate={-45}
      />
    </View>
  );
};

const colors = {
  Mon: "#4ABFF4",
  Tue: "#79C3DB",
  Wed: "#28B2B3",
  Thu: "#4ADDBA",
  Fri: "#91E3E3",
  Sat: "#FF9F45",
  Sun: "#FF6F61",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  loadingContainer: {
    height: "100%",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  xAxisLabel: {
    color: "#333",
    fontSize: 12,
  },
  yAxisLabel: {
    color: "#333",
    fontSize: 12,
  },
});

export default BinData;
