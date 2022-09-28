import { useState, useEffect } from "react";
import { Popover, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Movie from "./Movie";
import "antd/dist/antd.css";
import styles from "../styles/Home.module.css";

function Home() {
	const [likedMovies, setLikedMovies] = useState([]);

	// Liked movies (inverse data flow)
	const updateLikedMovies = (movieTitle) => {
		if (likedMovies.find((movie) => movie === movieTitle)) {
			setLikedMovies(likedMovies.filter((movie) => movie !== movieTitle));
		} else {
			setLikedMovies([...likedMovies, movieTitle]);
		}
	};

	const likedMoviesPopover = likedMovies.map((data, i) => {
		return (
			<div key={i} className={styles.likedMoviesContainer}>
				<span className="likedMovie">{data}</span>
				<FontAwesomeIcon
					icon={faCircleXmark}
					onClick={() => updateLikedMovies(data)}
					className={styles.crossIcon}
				/>
			</div>
		);
	});

	const popoverContent = <div className={styles.popoverContent}>{likedMoviesPopover}</div>;

	// via webservices
	const [moviesData, setMoviesData] = useState([]);
	useEffect(() => {
		console.log("Mount movie");
		fetch("movies-backend-mauve.vercel.app/movies")
			.then((response) => response.json())
			.then((data) => {
				setMoviesData(data.movies);
				console.log(moviesData);
			});
		return () => {
			console.log("Unmount");
		};
	}, []);
	// test

	const moviesApi = moviesData.map((data, i) => {
		const isLiked = likedMovies.some((movie) => movie === data.title);
		return (
			<Movie
				key={i}
				updateLikedMovies={updateLikedMovies}
				isLiked={isLiked}
				title={data.title}
				overview={data.overview}
				// poster={data.poster_path.substr(1)}
				poster={"https://image.tmdb.org/t/p/original/" + data.poster_path}
				voteAverage={data.vote_average}
				voteCount={data.vote_count}
			/>
		);
	});
	// test
	return (
		<div className={styles.main}>
			<div className={styles.header}>
				<div className={styles.logocontainer}>
					<img src="logo.png" alt="Logo" />
					<img className={styles.logo} src="logoletter.png" alt="Letter logo" />
				</div>
				<Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
					<Button>♥ {likedMovies.length} movie(s)</Button>
				</Popover>
			</div>
			<div className={styles.title}>LAST RELEASES</div>
			<div className={styles.moviesContainer}>{moviesApi}</div>
		</div>
	);
}

export default Home;
