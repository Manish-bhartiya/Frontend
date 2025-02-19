import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlaylist } from "../features/playlistslice";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/bundle";
import { MDBCard, MDBCardBody, MDBCardImage } from "mdb-react-ui-kit";
import Skeleton from "react-loading-skeleton"; // Import Skeleton for loading state

function Cart() {
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.playlist.playlists);
  const playlistStatus = useSelector((state) => state.playlist.status);

  useEffect(() => {
      if (playlistStatus === "idle") {
          dispatch(fetchPlaylist());
      }
  }, [playlistStatus, dispatch]);

  return (
      <div className="min-h-screen bg-black px-4 py-6">
          <main>
              <section>
                  <div>
                      <h1 className="text-white text-2xl mb-4 border-b-2 border-white inline-block">Artists</h1>
                      {playlistStatus === "loading" ? (
                          <Swiper
                              spaceBetween={10}
                              slidesPerView={2}
                              breakpoints={{
                                  640: { slidesPerView: 3 },
                                  768: { slidesPerView: 3 },
                                  1024: { slidesPerView: 5 },
                              }}
                          >
                              {[...Array(6)].map((_, index) => (
                                  <SwiperSlide key={index}>
                                      <MDBCard className="bg-black flex flex-col justify-center items-center hover:shadow-2xl p-2">
                                          <div className="w-32 h-32 mb-2 relative">
                                              <Skeleton
                                                  circle={true}
                                                  height="100%"
                                                  width="100%"
                                                  baseColor="gray"
                                                  containerClassName="rounded-full"
                                                  className="opacity-40 backdrop-blur-3xl"
                                              />
                                          </div>
                                          <Skeleton height={20} width={150} baseColor="gray" className="opacity-40 backdrop-blur-3xl" />
                                      </MDBCard>
                                  </SwiperSlide>
                              ))}
                          </Swiper>
                      ) : (
                          <Swiper
                              spaceBetween={10}
                              slidesPerView={2}
                              breakpoints={{
                                  640: { slidesPerView: 3 },
                                  768: { slidesPerView: 3 },
                                  1024: { slidesPerView: 5 },
                              }}
                          >
                              {Array.isArray(playlists) &&
                                  playlists.map((playlist) => (
                                      <SwiperSlide key={playlist._id}>
                                          <MDBCard className="bg-black flex flex-col justify-center items-center hover:shadow-2xl p-2">
                                              <Link to={`/playlist/${playlist.name}`} className="text-center">
                                                  <MDBCardImage
                                                      component="img"
                                                      className="rounded-full sm:size-72 lg:size-40 opacity-90 transition-opacity duration-300 hover:opacity-50"
                                                      src={playlist.image}
                                                      alt={`${playlist.name} cover`}
                                                  />
                                                  <MDBCardBody className="mt-2">
                                                      <span className="text-md font-semibold text-white hover:text-gray-400">
                                                          {playlist.name}
                                                      </span>
                                                  </MDBCardBody>
                                              </Link>
                                          </MDBCard>
                                      </SwiperSlide>
                                  ))}
                          </Swiper>
                      )}
                  </div>
              </section>
          </main>
      </div>
  );
}

export default Cart;
