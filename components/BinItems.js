import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const BinItems = ({ label, firstValue, legends }) => {
    // Calculate the second value as 100 - firstValue
    const secondValue = 100 - firstValue;

    // Create the data array with the calculated values
    const data = [
        { value: firstValue, color: legends[0].color },
        { value: secondValue, color: 'white' }
    ];

    const renderLegend = (text, color) => (
        <View style={styles.legendContainer}>
            <View style={[styles.legendColor, { backgroundColor: color || 'white' }]} />
            <Text style={styles.legendText}>{text || ''}</Text>
        </View>
    );

    return (
        <View style={styles.chartContainer}>
            <Text style={styles.chartLabel}>{label}</Text>
            <PieChart
                strokeColor="white"
                strokeWidth={4}
                donut
                data={data}
                innerCircleColor="#414141"
                innerCircleBorderWidth={4}
                innerCircleBorderColor={'white'}
                centerLabelComponent={() => (
                    <View>
                        <Text style={styles.centerLabelValue}>{firstValue}</Text>
                        <Text style={styles.centerLabelText}>Total</Text>
                    </View>
                )}
            />
            <View style={styles.legendWrapper}>
                {legends.map((legend, index) => (
                    renderLegend(legend.text, legend.color, index)
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        borderRadius: 10,
        paddingVertical: 30,
        backgroundColor: '#414141',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartLabel: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    centerLabelValue: {
        color: 'white',
        fontSize: 36,
    },
    centerLabelText: {
        color: 'white',
        fontSize: 18,
    },
    legendWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 30,
    },
    legendContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    legendColor: {
        height: 18,
        width: 18,
        marginRight: 10,
        borderRadius: 4,
    },
    legendText: {
        color: 'white',
        fontSize: 16,
    },
});

export default BinItems;
