import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import MovieCard from "@/components/MovieCard";
import fetchMovies from "@/utils/fetchMovies";
import { IntersectionObserver } from "react-intersection-observer";

const Trending = () => {
    const router = useRouter();
    const category = router.query.category;

    const [movieList, setMovieList] = useState(null);
    const [pageNum, setPageNum] = useState(2);

    useEffect(() => {
        const fetchData = async () => {
            const filteredResults = await fetchMovies({ action: category, page: 1 });
            setMovieList(filteredResults);
        }

        fetchData();
    }, [category]);

    const handlePageChange = async () => {
        setPageNum(pageNum + 1);

        const filteredResults = await fetchMovies({ action: category, page: pageNum });
        setMovieList([...movieList, ...filteredResults]);
    }

    return (

        <div>
            {!movieList
                ? (<h1>Loading...</h1>)
                : (
                    <div className="flex flex-col justify-center mt-14">
                        <div className="flex flex-row flex-wrap justify-center gap-2 p-2 lg:gap-4">
                            {movieList.map((movie) => {
                                return (
                                    <MovieCard key={movie.id} movie={movie} />
                                )
                            })}

                        </div>
                        <button className="btn btn-small text-xs m-auto mt-20" onClick={handlePageChange}>More</button>
                    </div>
                )}

            {/* <IntersectionObserver onChange={handleInView}>
                <div className="flex justify-center p-4"></div>
            </IntersectionObserver> */}
        </div>
    )
};

export default Trending;