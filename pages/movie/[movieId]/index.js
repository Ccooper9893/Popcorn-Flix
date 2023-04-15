import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import YouTube from "react-youtube";
import Image from "next/image";
import fetchMovieData from "@/utils/fetchDetails";
import fetchSimilarMovies from "@/utils/fetchSimilar";
import formatVideo from "@/utils/formatVideo";
import Rating from "@/components/Rating";
import emptyBucket from "../../../public/emptyBucket.webp";
import MovieCard from "@/components/MovieCard";

const MovieDetail = () => {

    //Grabbing movie ID from url
    const { asPath } = useRouter();
    const [movieId] = asPath.split('/').slice(-1);

    const [movie, setMovie] = useState(null);
    const [videoKey, setVideoKey] = useState(null);
    const [errorDetails, setErrorDetails] = useState(false);
    const [movieList, setMovieList] = useState([]);
    const [movieGenres, setMovieGenres] = useState([]);
    const [pageNum, setPageNum] = useState(1);


    useEffect(() => {

        const fetchData = async () => {

            const details = await fetchMovieData(movieId);

            if (details) {
                const { movieData, key } = details;
                setMovie(movieData);
                setMovieGenres(movieData.genres);

                const similarMoves = await fetchSimilarMovies(movieData.genres, 1);
                setMovieList(similarMoves);

                if (key) {
                    setVideoKey(key);
                };

            } else {
                setErrorDetails(true);
            };
        }

        fetchData();

    }, [movieId]);

    const handlePageChange = async () => {
        setPageNum(pageNum + 1);
        const filteredResults = await fetchSimilarMovies(movieGenres, pageNum);
        setMovieList([...movieList, ...filteredResults]);
    }

    // Configure options for Youtube player
    const mobileDimensions = {
        height: '300px',
        width: '350px',
    };
    const desktopDimensions = {
        height: '400px',
        width: '750px',
    };
    const videoOptions = formatVideo(mobileDimensions, desktopDimensions, 1);

    return (
        <div>
            <div className="flex justify-center mt-8 lg:mt-20">
                {errorDetails && !movie && (
                    <div className="align-center text-center">
                        <h1 className="text-3xl">Oh No!</h1>
                        <Image
                            className="rounded-lg opacity-40 m-auto my-10"
                            src={emptyBucket}
                            width={75}
                            height={75}
                            alt="Empty Popcorn Bucket">
                        </Image>
                        <h2 className="text-xl">Movie information not yet released! Check back later!</h2>
                    </div>
                )}
                {movie && (

                        <div className="flex flex-col justify-center">
                            {!videoKey && <h1>No video found</h1>}
                            {videoKey && <YouTube className="rounded-2xl m-auto" videoId={videoKey} opts={videoOptions} />}
                            <div className="lg:w-2/5 m-auto">
                                <h1 className="font-bold text-3xl text-center w-full mt-3">{movie.original_title}</h1>
                                <p className="text-center">{movie.overview}</p>
                                <p>Release Date: {movie.release_date}</p>
                                <Rating props={movie.vote_average} />
                            </div>
                        </div>
                )}

            </div>
            <div className="mt-10 text-center border-t border-stone-700">
                <h3 className="text-2xl mt-5">Similar Movies</h3>
                {movieList && (
                        <div className="flex flex-row flex-wrap justify-center gap-2 p-2 lg:gap-4">
                            {movieList.map((movie) => {
                                return (
                                    <MovieCard key={movie.id} movie={movie} />
                                )
                            })}

                        </div>

                    )}
            </div>
            <div className="p-4">
                <button className="btn btn-small text-xs" onClick={handlePageChange}>More</button>
            </div>
        </div>
    )
};

export default MovieDetail;

/*--------- Example movie object --------*/

// {
//     "adult": false,
//     "backdrop_path": "/r7Dfg9aRZ78gJsmDlCirIIlNH3d.jpg",
//     "belongs_to_collection": null,
//     "budget": 3000000,
//     "genres": [
//         {
//             "id": 18,
//             "name": "Drama"
//         }
//     ],
//     "homepage": "https://a24films.com/films/the-whale",
//     "id": 785084,
//     "imdb_id": "tt13833688",
//     "original_language": "en",
//     "original_title": "The Whale",
//     "overview": "A reclusive English teacher suffering from severe obesity attempts to reconnect with his estranged teenage daughter for one last chance at redemption.",
//     "popularity": 400.24,
//     "poster_path": "/jQ0gylJMxWSL490sy0RrPj1Lj7e.jpg",
//     "production_companies": [
//         {
//             "id": 41077,
//             "logo_path": "/1ZXsGaFPgrgS6ZZGS37AqD5uU12.png",
//             "name": "A24",
//             "origin_country": "US"
//         },
//         {
//             "id": 7503,
//             "logo_path": "/3K8wbNkTn7O4wX89ucnp1ZYR1XF.png",
//             "name": "Protozoa Pictures",
//             "origin_country": "US"
//         }
//     ],
//     "production_countries": [
//         {
//             "iso_3166_1": "US",
//             "name": "United States of America"
//         }
//     ],
//     "release_date": "2022-12-09",
//     "revenue": 36752010,
//     "runtime": 116,
//     "spoken_languages": [
//         {
//             "english_name": "English",
//             "iso_639_1": "en",
//             "name": "English"
//         }
//     ],
//     "status": "Released",
//     "tagline": "",
//     "title": "The Whale",
//     "video": false,
//     "vote_average": 8.061,
//     "vote_count": 1940,
//     "videos": {
//         "results": [
//             {
//                 "iso_639_1": "en",
//                 "iso_3166_1": "US",
//                 "name": "Special Feature - Creating Atmosphere with a Flute",
//                 "key": "LKxLnWqlXu4",
//                 "site": "YouTube",
//                 "size": 1080,
//                 "type": "Behind the Scenes",
//                 "official": true,
//                 "published_at": "2023-03-14T17:30:14.000Z",
//                 "id": "641358982667780099a1fd3a"
//             },
