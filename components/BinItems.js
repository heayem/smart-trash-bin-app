import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const BinItems = ({ label, firstValue, legends, onLegendPress, binId, lat, lng }) => {
    const secondValue = 100 - firstValue;
    const data = [
        { value: firstValue, color: legends[0]?.color || 'gray' },
        { value: secondValue, color: 'white' }
    ];

    const handleLegendPress = (text) => {
        if (text === 'Location' && onLegendPress) {
            onLegendPress(lat, lng); 
        }
    };

    const renderLegend = (text, color, index) => (
        <TouchableOpacity
            key={index}
            onPress={() => handleLegendPress(text)}
            disabled={text !== 'Location'} 
            accessibilityLabel={text}
            accessibilityHint={text === 'Location' ? "Press to view location" : "Not pressable"}
        >
            <View style={styles.legendContainer}>
                <View style={[styles.legendColor, { backgroundColor: color || 'white' }]} />
                <Text style={styles.legendText}>{text || ''}</Text>
            </View>
        </TouchableOpacity>
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
        alignItems: 'center',
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
