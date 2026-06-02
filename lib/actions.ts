'use server';

import { tmdbApi } from './tmdb';

export async function getMovieVideosAction(id: number) {
  try {
    return await tmdbApi.getMovieVideos(id);
  } catch (error) {
    console.error('Error in getMovieVideosAction:', error);
    return [];
  }
}
