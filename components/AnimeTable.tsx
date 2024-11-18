import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import sort from '../assets/sort.png';
import sortActive from '../assets/sortActive.png';
import { Link } from 'expo-router';

interface Anime {
    mal_id: number;
    title: string;
    genres: { name: string }[];
    year?: number;
    score?: number;
    episodes?: number;
}

interface AnimeTableProps {
    data: Anime[];
    isLoading: boolean;
    startYear: string;
    endYear: string;
    selectedCategories: string[];
}

const AnimeTable: React.FC<AnimeTableProps> = ({
                                                   data,
                                                   isLoading,
                                                   startYear,
                                                   endYear,
                                                   selectedCategories,
                                               }) => {
    const [ sortField, setSortField ] = useState<keyof Anime>('title');
    const [ sortDirection, setSortDirection ] = useState<'asc' | 'desc'>('asc');
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesCategories =
                selectedCategories.length === 0 ||
                item.genres.some((genre) => selectedCategories.includes(genre.name));
            const animeYear = item.year || 0;
            const matchesYear =
                (!startYear || animeYear >= parseInt(startYear, 10)) &&
                (!endYear || animeYear <= parseInt(endYear, 10));

            return matchesCategories && matchesYear;
        });
    }, [ data, selectedCategories, startYear, endYear ]);
    const sortedData = useMemo(() => {
        return [ ...filteredData ].sort((a, b) => {
            const valueA = a[ sortField ] || '';
            const valueB = b[ sortField ] || '';

            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [ filteredData, sortField, sortDirection ]);

    const renderHeaderCell = (field: keyof Anime, label: string) => {
        const dynamicStyle = `column${ label }` in styles
            ? styles[ `column${ label }` as keyof typeof styles ]
            : undefined;

        return (
            <TouchableOpacity
                style={ [ styles.cell, dynamicStyle ] }
                onPress={ () => {
                    setSortField(field);
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                } }
            >
                <View style={ styles.headerCellContent }>
                    <Text
                        style={ [
                            styles.headerCellText,
                            sortField === field && styles.headerCellTextActive,
                        ] }
                    >
                        { label }
                    </Text>
                    <Image
                        source={ sortField === field ? sortActive : sort }
                        style={ styles.sortIcon }
                    />
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <ScrollView horizontal>
            <View>
                <View style={ [ styles.row, styles.headerRow ] }>
                    { renderHeaderCell('title', 'Title') }
                    { renderHeaderCell('year', 'Year') }
                    { renderHeaderCell('score', 'Score') }
                    { renderHeaderCell('episodes', 'Episodes') }
                </View>
                { isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff"/>
                ) : (
                    <FlatList
                        data={ sortedData }
                        keyExtractor={ (item) => item.mal_id.toString() }
                        renderItem={ ({ item }) => (
                            <View style={ styles.row }>
                                <Text style={ [ styles.cell, styles.columnTitle ] }>
                                    <Link
                                        href={ `/description/${ item.mal_id }` }
                                        style={ styles.row }
                                    >
                                        { item.title || 'N/A' }
                                    </Link>
                                </Text>
                                <Text style={ [ styles.cell, styles.columnYear ] }>
                                    { item.year || 'Unknown' }
                                </Text>
                                <Text style={ [ styles.cell, styles.columnScore ] }>
                                    { item.score || 'N/A' }
                                </Text>
                                <Text style={ [ styles.cell, styles.columnEpisodes ] }>
                                    { item.episodes || 'N/A' }
                                </Text>
                            </View>
                        ) }
                    />
                ) }
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    headerRow: {
        backgroundColor: '#f0f0f0',
    },
    cell: {
        flex: 0,
        textAlign: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    headerCellContainer: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCellContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerCellText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000',
        marginRight: 8,
    },
    headerCellTextActive: {
        color: '#0000ff',
    },
    sortIcon: {
        width: 12,
        height: 12,
    },
    columnTitle: {
        width: 150,
        textAlign: 'left',
        textDecorationLine: 'underline',
        color: '#0000ff',
    },
    columnYear: {
        width: 100,
        textAlign: 'center',
    },
    columnScore: {
        width: 120,
        textAlign: 'center',
    },
    columnEpisodes: {
        width: 100,
        textAlign: 'center',
    },
});


export default AnimeTable;
