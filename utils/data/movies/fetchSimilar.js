import filter from "./filter";

const fetchSimilarMovies = async (genres, page) => {

    // Covert array of genre IDs to a uri encoded string
    let listOfGenreIds = genres.map(genre => genre.id);
    let string = listOfGenreIds.toString();
    let encoded = encodeURIComponent(string);

    try {
        // const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${process.env.movieKey}&language=en-US`);
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.movieKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${encoded}&with_watch_monetization_types=flatrate`);
        const data = await response.json();
        const results = data.results;
        const filteredResults = results.filter(movie => movie.poster_path && movie.backdrop_path);
        return filteredResults;

    } catch (error) {
        console.log(error);
    }
};

export default fetchSimilarMovies;