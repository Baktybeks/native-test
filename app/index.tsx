import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AnimeTable from '../components/AnimeTable';
import Pagination from '../components/Pagination';
import FilterPanel from '../components/FilterPanel';
import { Animes, fetchAnimes } from '../utils/api';

const MainPage: React.FC = () => {
    const [ data, setData ] = useState<Animes[]>([]);
    const [ filteredData, setFilteredData ] = useState<Animes[]>([]);
    const [ page, setPage ] = useState<number>(1);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ startYear, setStartYear ] = useState<string>('');
    const [ endYear, setEndYear ] = useState<string>('');
    const [ categories, setCategories ] = useState<string[]>([]);
    const [ selectedCategories, setSelectedCategories ] = useState<string[]>([]);

    useEffect(() => {
        const loadData = async() => {
            setIsLoading(true);
            const animeData = await fetchAnimes(page);
            setData(animeData);
            if (categories.length === 0) {
                const uniqueCategories = new Set<string>();
                animeData.forEach((item) =>
                    item.genres.forEach((genre) => uniqueCategories.add(genre.name))
                );
                setCategories(Array.from(uniqueCategories));
            }
            setIsLoading(false);
        };
        loadData();
    }, [ page ]);

    useEffect(() => {
        let filtered = data;

        if (selectedCategories.length > 0) {
            filtered = filtered.filter((item) =>
                item.genres.some((genre) => selectedCategories.includes(genre.name))
            );
        }

        if (startYear || endYear) {
            filtered = filtered.filter((item) => {
                const animeYear = item.year || 0;
                const isAfterStartYear = startYear ? animeYear >= parseInt(startYear, 10) : true;
                const isBeforeEndYear = endYear ? animeYear <= parseInt(endYear, 10) : true;
                return isAfterStartYear && isBeforeEndYear;
            });
        }

        setFilteredData(filtered);
    }, [ data, selectedCategories, startYear, endYear ]);

    const hasPrevious = page > 1;
    const hasNext = filteredData.length > 0;

    return (
        <View style={styles.container}>
            <FilterPanel
                startYear={ startYear }
                setStartYear={ setStartYear }
                endYear={ endYear }
                setEndYear={ setEndYear }
                categories={ categories }
                selectedCategories={ selectedCategories }
                setSelectedCategories={ setSelectedCategories }
            />
            <AnimeTable
                data={ data }
                isLoading={ isLoading }
                startYear={ startYear }
                endYear={ endYear }
                selectedCategories={ selectedCategories }
            />
            <Pagination
                page={ page }
                setPage={ setPage }
                hasPrevious={ hasPrevious }
                hasNext={ hasNext }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
});

export default MainPage;
