const API_URL = "https://api.jikan.moe/v4/anime";
export interface Animes {
    mal_id: number;
    title: string;
    genres: { name: string }[];
    year?: number;
    episodes?: number;
    score?: number;
}

export const fetchAnimes = async (page: number): Promise<Animes[]> => {
    try {
        const response = await fetch(`${API_URL}?page=${page}`);
        const result = await response.json();
        return result.data as Animes[];
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return [];
    }
};

export interface Anime {
    mal_id: number;
    title: string;
    images: {
        jpg: {
            large_image_url: string;
        };
    };
    score?: number;
    scored_by?: number;
    rank?: number;
    type?: string;
    episodes?: number;
    synopsis?: string;
    genres?: { name: string }[];
}

export const fetchAnime = async (id: string): Promise<Anime | null> => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();
        return result.data || null;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return null;
    }
};

