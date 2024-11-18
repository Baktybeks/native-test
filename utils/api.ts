const API_URL = "https://api.jikan.moe/v4/anime";

export const fetchAnime = async (page: number = 1) => {
    const response = await fetch(`${API_URL}?page=${page}`);
    const data = await response.json();
    return data.data;
};
