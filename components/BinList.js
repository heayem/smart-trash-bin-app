import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import BinItems from '../components/BinItems';

const BinList = [
    {
        label: "Smart Bin 1",
        level: 20,
        legends: [
            { text: 'Level', color: 'orange' },
            { text: 'Location', color: 'red' }
        ]
    },
    {
        label: "Smart Bin 2",
        level: 100,
        legends: [
            { text: 'Level', color: 'green' },
            { text: 'Location', color: 'gray' }
        ]
    },
    {
        label: "Smart Bin 3",
        level: 70,
        legends: [
            { text: 'Level', color: 'blue' },
            { text: 'Location', color: 'black' }
        ]
    }
];

const Bins = () => {
    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            {BinList.map((bin, index) => (
                <BinItems
                    key={index}
                    label={bin.label}
                    firstValue={bin.level}
                    legends={bin.legends}
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        padding: 20,
        gap: 20,
    },
});

export default Bins;
