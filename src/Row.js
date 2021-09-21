import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import Youtube from "react-youtube";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

const baseImgUrl = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [leftDisplay, setLeftDisplay] = useState(false);
  const [rightDisplay, setRightDisplay] = useState(true);

  // Options for react-youtube
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const handleClick = async (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      let trailerurl = await axios.get(
        `/movie/${movie.id}/videos?api_key=fb34530271b349314af0de263d16ab5a`
      );
      setTrailerUrl(trailerurl.data.results[0]?.key);
    }
  };

  const sideScroll = (
    element: HTMLDivElement,
    speed: number,
    distance: number,
    step: number
  ) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      element.scrollLeft += step;
      scrollAmount += Math.abs(step);
      if (scrollAmount >= distance) {
        clearInterval(slideTimer);
      }
    }, speed);
  };
  const contentWrapper = React.useRef(null);

  const scrollRight = () => {
    let scrollWidth =
      contentWrapper.current.scrollWidth - contentWrapper.current.clientWidth;
    let currentScroll = contentWrapper.current.scrollLeft;
    if (scrollWidth - 300 > currentScroll) {
      setRightDisplay(true);
      setLeftDisplay(true);
    } else {
      setRightDisplay(false);
    }
  };

  const scrollLeft = () => {
    let currentScroll = contentWrapper.current.scrollLeft;
    if (currentScroll > 300) {
      setLeftDisplay(true);
      setRightDisplay(true);
    } else {
      setLeftDisplay(false);
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row-posters" ref={contentWrapper}>
        {movies.map(
          (movie) =>
            movie.backdrop_path !== null && (
              <img
                className={`row-poster ${isLargeRow && "row-poster-large"}`}
                src={`${baseImgUrl}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
                key={movie.id}
                onClick={() => handleClick(movie)}
              />
            )
        )}
      </div>
      <div className="scroll-btns">
        <div className={leftDisplay ? "btn-display" : "btn-hide"}>
          <KeyboardArrowLeftIcon
            fontSize="large"
            className={
              isLargeRow
                ? "scroll-left scroll-large"
                : "scroll-left scroll-small"
            }
            onClick={() => {
              sideScroll(contentWrapper.current, 25, 300, -10);
              scrollLeft();
            }}
          />
        </div>
        <div className={rightDisplay ? "btn-display" : "btn-hide"}>
          <KeyboardArrowRightIcon
            fontSize="large"
            className={
              isLargeRow
                ? "scroll-right scroll-large"
                : "scroll-right scroll-small"
            }
            onClick={() => {
              sideScroll(contentWrapper.current, 25, 300, 10);
              scrollRight();
            }}
          />
        </div>
      </div>

      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
