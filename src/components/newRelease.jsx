import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/bundle";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AlbumRootSkeleton from "../components/AlbumRootSkeleton";
import ReleaseCard from "../components/ReleaseCard";
import  apiconnecter from "../services/apiconnecter";

const NewReleasesSlider = () => {
  const query = useSelector((state) => state.User.query);
  const search = useSelector((state) => state.User.search);
  const [loader, setLoader] = useState(true); // Set to true initially to show loader
  const [card, setCard] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const formdata = new FormData();
  formdata.append("Name", query);

  // Shuffle the tracks randomly
  const shuffleTracks = (trackList) => {
    for (let i = trackList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [trackList[i], trackList[j]] = [trackList[j], trackList[i]];
    }
    return trackList;
  };

  // Chunk tracks into groups of 3
  const chunkTracks = (trackList) => {
    const chunked = [];
    for (let i = 0; i < trackList.length; i += 3) {
      chunked.push(trackList.slice(i, i + 3));
    }
    return chunked;
  };

  // Fetch songs from API
  async function searchQuery() {
    try {
      setLoader(true); // Show loader while fetching data
      const response = await apiconnecter("get", "songs/songs");
      const data = response.data; // Axios response structure
      console.log("data is here", data);

      if (!data || !data.songs) {
        console.error("Error: API response does not contain 'songs'");
        setLoader(false); // Hide loader even if there is no data
        return;
      }

      const shuffledTracks = shuffleTracks(data.songs);
      setTracks(shuffledTracks); // Update tracks with shuffled data
      setChunks(chunkTracks(shuffledTracks)); // Update chunks based on shuffled tracks
      setLoader(false); // Hide loader after data is fetched
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setLoader(false); // Hide loader in case of error
    }
  }

  // Update card view based on window size
  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    if (windowWidth < 300) {
      setCard(1);
    } else if (windowWidth < 500) {
      setCard(2);
    } else if (windowWidth < 800) {
      setCard(3);
    } else if (windowWidth < 1000) {
      setCard(4);
    } else if (windowWidth < 1200) {
      setCard(5);
    } else {
      setCard(5);
    }
  }, [windowWidth]);

  useEffect(() => {
    searchQuery();
    window.addEventListener("resize", updateWindowWidth);

    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, [search]);

  return (
    <>
      {loader ? (
        <div className="flex flex-col">
          <div className="opacity-40 m-3 gap-2 flex flex-col">
            <Skeleton height={20} width={180} baseColor="gray" />
            <Skeleton height={140} width={180} baseColor="gray" />
          </div>
          <AlbumRootSkeleton/>
        </div>
      ) : (
        <div className="mb-[10px] mt-20 ml-2">
          <div className="flex items-start ml-3 flex-col text-white"></div>
          <h1 className="text-white text-2xl mb-4 border-b-2 border-white inline-block">New Release</h1>
          <div className="flex flex-col gap-2">

            {chunks.length > 0 ? (
              <Swiper
                slidesPerView={card}
                spaceBetween={1}
                loop={true}
                freeMode={true}
                autoplay={{
                  delay: 2500,
                }}
                className="w-full"
              >
                {chunks.map((chunk, index) => (
                  <SwiperSlide key={index}>
                    <ReleaseCard song={chunk} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div>No songs available</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NewReleasesSlider;
