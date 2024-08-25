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

        const dailyDataRef = ref(database, "daily-bin-data");
        const dailySnapshot = await get(dailyDataRef);
        const dailyData = dailySnapshot.exists() ? dailySnapshot.val() : {};

        const weeklyDataRef = ref(database, "summed-bin-data");
        const weeklySnapshot = await get(weeklyDataRef);
        const weeklyData = weeklySnapshot.exists() ? weeklySnapshot.val() : {};

        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        daysOfWeek.forEach((day) => {
          if (!dailyData[day]) {
            dailyData[day] = 0;
          }
          if (!weeklyData[day]) {
            weeklyData[day] = 0;
          }
        });

        const todayDataRef = ref(database, "trash-bin-data");
        const todaySnapshot = await get(todayDataRef);
        const todayBinData = todaySnapshot.exists() ? todaySnapshot.val() : {};

        Object.values(todayBinData).forEach((bin) => {
          const binFill = parseFloat(bin.fill);
          const binDate = moment(bin.timestamp).format("ddd");
          if (daysOfWeek.includes(binDate)) {
            dailyData[binDate] = (dailyData[binDate] || 0) + binFill;
          }
        });

        Object.keys(dailyData).forEach((day) => {
          weeklyData[day] = (weeklyData[day] || 0) + dailyData[day];
        });

        const chartData = daysOfWeek.map((day) => ({
          value: weeklyData[day] || 0,
          label: day,
          frontColor: colors[day] || "#000000",
        }));

        setBarData(chartData);

        await update(weeklyDataRef, weeklyData);

        if (moment().isSame(endOfWeek, "day")) {
          await set(dailyDataRef, {});
        }
      } catch (error) {
        Alert.alert("Error", "Error fetching or updating data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdateData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trash bin data in weekly </Text>
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
