import { BarChart } from "react-native-gifted-charts";
import { View, Text, StyleSheet } from "react-native";

const BinData = () => {
  const barData = [
    { value: 230, label: 'Mon', frontColor: '#4ABFF4' },
    { value: 180, label: 'Tue', frontColor: '#79C3DB' },
    { value: 195, label: 'Wed', frontColor: '#28B2B3' },
    { value: 250, label: 'Thu', frontColor: '#4ADDBA' },
    { value: 320, label: 'Fri', frontColor: '#91E3E3' },
    { value: 280, label: 'Sat', frontColor: '#FF9F45' }, // Added Saturday
    { value: 210, label: 'Sun', frontColor: '#FF6F61' },   // Added Sunday
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bin Data</Text>
      <BarChart
        data={barData}
        isAnimated
        showFractionalValue
        showYAxisIndices
        noOfSections={4}
        maxValue={400}
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
