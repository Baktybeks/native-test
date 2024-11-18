import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    ScrollView,
    Button,
    TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Anime, fetchAnime } from '../../utils/api';

const DescriptionScreen: React.FC = () => {
    const router = useRouter();
    const { mal_id } = useLocalSearchParams<{ mal_id: string }>();
    const [data, setData] = useState<Anime | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const getData = async () => {
            if (mal_id) {
                setIsLoading(true);
                const animeData = await fetchAnime(mal_id);
                setData(animeData);
                setIsLoading(false);
            }
        };
        getData();
    }, [mal_id]);

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

    if (!data) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>
                    No data available. Please try again later.
                </Text>
                <Button title="Назад" onPress={() => router.back()} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: data.images.jpg.large_image_url }} style={styles.image} />
            <View style={styles.cardContent}>
                <Text style={styles.animeTitle}>{data.title || 'Unknown Title'}</Text>
                <Text style={styles.rating}>
                    ⭐ {data.score || 'N/A'} ({data.scored_by || 0} users)
                </Text>
                <Text style={styles.rank}>#{data.rank || 'N/A'} Ranking</Text>
                <Text style={styles.episodes}>
                    {data.type || 'Unknown Type'} • {data.episodes || '?'} episodes
                </Text>
                <Text style={styles.synopsis}>{data.synopsis || 'No synopsis available.'}</Text>
                <View style={styles.genres}>
                    {data.genres?.map((genre, index) => (
                        <Text key={index} style={styles.genre}>
                            {genre.name}
                        </Text>
                    ))}
                </View>
            </View>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Назад</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default DescriptionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        textAlign: 'center',
        color: '#ff0000',
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        borderRadius: 8,
        marginBottom: 16,
    },
    cardContent: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    animeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    rating: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    rank: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    episodes: {
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
    },
    synopsis: {
        fontSize: 14,
        color: '#444',
        marginBottom: 12,
        lineHeight: 20,
    },
    genres: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    genre: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        padding: 6,
        fontSize: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: '#007BFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        zIndex: 10,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
