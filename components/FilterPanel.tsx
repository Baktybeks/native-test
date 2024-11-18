import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
interface FilterPanelProps {
    startYear: string;
    setStartYear: (value: string) => void;
    endYear: string;
    setEndYear: (value: string) => void;
    categories: string[];
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
                                                     startYear,
                                                     setStartYear,
                                                     endYear,
                                                     setEndYear,
                                                     categories,
                                                     selectedCategories,
                                                     setSelectedCategories,
                                                 }) => {
    return (
        <View style={styles.filters}>
            <TextInput
                style={styles.input}
                placeholder="From Year"
                keyboardType="numeric"
                value={startYear}
                onChangeText={setStartYear}
            />
            <TextInput
                style={styles.input}
                placeholder="To Year"
                keyboardType="numeric"
                value={endYear}
                onChangeText={setEndYear}
            />
            <Picker<string>
                selectedValue={selectedCategories[0] || ''}
                style={styles.picker}
                onValueChange={(value: string) => {
                    if (value && !selectedCategories.includes(value)) {
                        setSelectedCategories([...selectedCategories, value]);
                    }
                }}
            >
                <Picker.Item label="Select Category" value="" />
                {categories.map((category) => (
                    <Picker.Item key={category} label={category} value={category} />
                ))}
            </Picker>
            <View style={styles.selectedCategories}>
                {selectedCategories.map((category) => (
                    <Text key={category} style={styles.category}>
                        {category}
                    </Text>
                ))}
                <Button
                    title="Clear"
                    onPress={() => {
                        setSelectedCategories([]);
                        setStartYear('');
                        setEndYear('');
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    filters: {
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 8,
    },
    picker: {
        height: 50,
        marginBottom: 8,
    },
    selectedCategories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    category: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        padding: 4,
        fontSize: 12,
        marginRight: 4,
    },
});

export default FilterPanel;
