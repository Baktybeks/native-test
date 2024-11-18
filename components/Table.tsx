import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, ActivityIndicator } from "react-native";

const App = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const fetchData = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime?page=${page}`);
            const result = await response.json();
            setData(result.data);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleNextPage = () => {
        setPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    return (
        <View className="flex-1 p-4 bg-gray-100">
            <Text className="text-lg font-bold mb-4">Anime List (Page {page})</Text>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.mal_id.toString()}
                    renderItem={({ item }) => (
                        <View className="p-4 border-b border-gray-300">
                            <Text className="text-lg">{item.title}</Text>
                        </View>
                    )}
                />
            )}

            <View className="flex-row justify-between mt-3">
                <Button title="Previous" onPress={handlePrevPage} disabled={page === 1} />
                <Button title="Next" onPress={handleNextPage} />
            </View>
        </View>
    );
};

export default App;
