// lib/tmdb.ts
// Real-time API integration with TMDB

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
  status?: string;
  tagline?: string;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

let GENRES_CACHE: TmdbGenre[] = [];

async function fetchFromTmdb(endpoint: string) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json;charset=utf-8',
    },
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.statusText}`);
  }

  return response.json();
}

export const tmdbApi = {
  async getGenres(): Promise<TmdbGenre[]> {
    if (GENRES_CACHE.length > 0) return GENRES_CACHE;
    const data = await fetchFromTmdb('/genre/movie/list?language=en-US');
    GENRES_CACHE = data.genres;
    return GENRES_CACHE;
  },

  async getNowPlaying(): Promise<TmdbMovie[]> {
    const data = await fetchFromTmdb('/movie/now_playing?language=en-US&page=1');
    return data.results.map((m: any) => ({
      ...m,
      poster_path: `${IMAGE_BASE_URL}/w500${m.poster_path}`,
      backdrop_path: `${IMAGE_BASE_URL}/original${m.backdrop_path}`
    }));
  },

  async getTrending(): Promise<TmdbMovie[]> {
    const data = await fetchFromTmdb('/trending/movie/day?language=en-US');
    return data.results.map((m: any) => ({
      ...m,
      poster_path: `${IMAGE_BASE_URL}/w500${m.poster_path}`,
      backdrop_path: `${IMAGE_BASE_URL}/original${m.backdrop_path}`
    }));
  },

  async getMovieDetails(id: number): Promise<TmdbMovie> {
    const m = await fetchFromTmdb(`/movie/${id}?language=en-US`);
    return {
      ...m,
      genre_ids: m.genres ? m.genres.map((g: any) => g.id) : [],
      poster_path: `${IMAGE_BASE_URL}/w500${m.poster_path}`,
      backdrop_path: `${IMAGE_BASE_URL}/original${m.backdrop_path}`
    };
  },

  async getMovieVideos(id: number): Promise<{ key: string; site: string; type: string }[]> {
    const data = await fetchFromTmdb(`/movie/${id}/videos?language=en-US`);
    return data.results.filter((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
  },

  async getGenreNames(genreIds: number[]): Promise<string[]> {
    if (!genreIds) return [];
    const genres = await this.getGenres();
    return genreIds
      .map(id => genres.find(g => g.id === id)?.name)
      .filter((name): name is string => name !== undefined);
  }
};
