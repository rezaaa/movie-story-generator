const env = 'pro';

// poster
const posterUrlBase = {
  dev: 'https://image.tmdb.org',
  pro: 'https://image.tmdb.org',
};
export const posterUrl1280 = `${posterUrlBase[env]}/t/p/w1280`;
export const posterUrl600 = `${posterUrlBase[env]}/t/p/w600_and_h900_bestv2`;
export const posterUrl300 = `${posterUrlBase[env]}/t/p/w300_and_h450_bestv2`;
export const posterUrl185 = `${posterUrlBase[env]}/t/p/w185_and_h278_bestv2`;

// api
const apiBase = {
  dev: 'https://api.themoviedb.org/',
  pro: 'https://api.themoviedb.org/',
};
export const moviesApiBase = apiBase[env];
export const apiKey = '4ba2c80bd43f2892ecb3349fa445015f';