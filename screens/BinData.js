import React, { useState, useEffect } from 'react';
import { BarChart } from 'react-native-gifted-charts';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { database, ref, get, set } from '../firebaseConfig';
import moment from 'moment';

const BinData = () => {
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndUpdateData = async () => {
      try {
        const binDataRef = ref(database, 'trash-bin-data');
        const weeklyAveragesRef = ref(database, 'weekly-averages');
        const snapshot = await get(binDataRef);
        const weeklySnapshot = await get(weeklyAveragesRef);

        if (!snapshot.exists()) {
          console.log('No bin data available');
          return;
        }

        const binData = snapshot.val();
        const weeklyData = weeklySnapshot.val();

        const startOfWeek = moment().startOf('week');
        const endOfWeek = moment().endOf('week');
        const weekStartKey = startOfWeek.format('YYYY-MM-DD');

        const weeklyBinLevels = {
          Mon: { total: 0, count: 0 },
          Tue: { total: 0, count: 0 },
          Wed: { total: 0, count: 0 },
          Thu: { total: 0, count: 0 },
          Fri: { total: 0, count: 0 },
          Sat: { total: 0, count: 0 },
          Sun: { total: 0, count: 0 }
        };

        Object.values(binData).forEach(bin => {
          const binFill = parseFloat(bin['bin-level']);
          const binTime = moment(bin.timestamp);

          if (binFill && binTime.isBetween(startOfWeek, endOfWeek, 'day', '[]') &&
              binTime.isAfter(moment().set({ hour: 19, minute: 0, second: 0 }))) {
            const dayOfWeek = binTime.format('ddd');
            if (weeklyBinLevels[dayOfWeek]) {
              weeklyBinLevels[dayOfWeek].total += binFill;
              weeklyBinLevels[dayOfWeek].count += 1;
            }
          }
        });

        const colors = {
          Mon: '#4ABFF4',
          Tue: '#79C3DB',
          Wed: '#28B2B3',
          Thu: '#4ADDBA',
          Fri: '#91E3E3',
          Sat: '#FF9F45',
          Sun: '#FF6F61'
        };

        const averageBinLevels = Object.keys(weeklyBinLevels).map(day => {
          const data = weeklyBinLevels[day];
          const average = data.count > 0 ? data.total / data.count : 0;

          return {
            value: average,
            label: day,
            frontColor: colors[day]
          };
        });

        await set(ref(database, `weekly-averages/${weekStartKey}`), weeklyBinLevels);

        setBarData(averageBinLevels);
      } catch (error) {
        console.error('Error fetching or updating data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdateData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bin Data</Text>
      <BarChart
        data={barData}
        isAnimated
        showFractionalValue
        showYAxisIndices
        noOfSections={4}
        maxValue={Math.max(...barData.map(item => item.value), 400)}
        yAxisLabel="Count"
        xAxisLabel="Day"
        barWidth={30}
        barBackgroundColor="#E0E0E0"
        xAxisLabelStyle={styles.xAxisLabel}
        yAxisLabelStyle={styles.yAxisLabel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  xAxisLabel: {
    color: '#333',
    fontSize: 12,
  },
  yAxisLabel: {
    color: '#333',
    fontSize: 12,
  },
});

export default BinData;
