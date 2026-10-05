import React, { useEffect } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useState, useContext, useRef } from "react";
import useFetch from "../useFetch";
import { UserContext } from "../App";
import { members } from "../Context/MembersContext";
// import Skeleton from "@mui/material/Skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Mousewheel, EffectCoverflow, Autoplay } from "swiper/modules";
import { Scrollbar } from "swiper/modules";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommonNavbar from "../CommonNavbar/CommonNavbar";

function Home() {
  const { user, setUser, url } = useContext(UserContext);
  const { exploreMembers, loading, setExploreMembers, handleSearch } =
    useContext(members);
  const [filterMembers, setFilterMembers] = useState([]);
  const [searching, setSearching] = useState(0);
  const homeHeader = useRef();
  const homeSwiper = useRef(),
  exploreHeading = useRef(),
  swiperContainer = useRef();
  const nav = useNavigate()

  function handleSwipe(e) {
    if (!homeSwiper.current) return;
    const swiper = homeSwiper.current.swiper;
    if (e.key === "ArrowRight") swiper.slideNext();
    if (e.key === "ArrowLeft") swiper.slidePrev();
  }

  const [searchText, setSearchText] = useState("");

  const search = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    handleSearch(value, setExploreMembers);
  };

  const searchTextElement = useRef();
  const searchInput = useRef();
  function handleSearchClick() {
    searchInput.current.style.display = "inline";
    searchInput.current.focus();
    searchTextElement.current.style.display = "none";
    homeSwiper.current.style.display = "none";
    homeHeader.current.textContent = "Search Results";
    exploreHeading.current.style.display = "none";
  }

  function handleSearchInputBlur() {
    // searchInput.current.style.display = "none";
    // searchTextElement.current.style.display = "inline";
    homeHeader.current.textContent = "People You May Know";
    exploreHeading.current.style.display = "block";
    setTimeout(()=>{
      setSearchText("");
      handleSearch("", setExploreMembers);
      homeSwiper.current.style.display = "block"
    },300)
  }

  return (
    <div id="home">
      <div className="home-navbar">
        <CommonNavbar />
      </div>
      {/* <div id="home-navbar" className="main-bg">
        <h1
         
          className="main-heading"
        >
          Deeinder
        </h1>

        <nav>
          <a href="#home">
            <i className="fa-solid fa-house-chimney nav-icons"></i> Home
          </a>
          <a id="home-search" onClick={handleSearchClick}>
            <i className="fa-solid fa-magnifying-glass nav-icons"></i>
            <span ref={searchTextElement} id="search-text">
              Search
            </span>
            <input
              id="search"
              ref={searchInput}
              value={searchText}
              onChange={search}
              onBlur={handleSearchInputBlur}
            />
          </a>
          <Link>
            <i className="fa-solid fa-users-rays nav-icons"></i> Connections
          </Link>
          <Link to="/Home" id="msg-icon-link">
            <SendOutlinedIcon id="msg-icon" className="nav-icons" /> Messages
          </Link>
          <Link to={"/userProfile/" + user.username}>
            <i className="fa-solid fa-user nav-icons"></i> Profile
          </Link>
        </nav>
      </div> */}

      <div id="home-content"
      >

        <div
          className="home-header"
          >
        <div className="home-headings">

          <h2
          ref={homeHeader}
          >People You May Know</h2>
          <a id="home-search" onClick={handleSearchClick}>
              {/* <i className="fa-solid fa-magnifying-glass"></i> */}
              <span ref={searchTextElement} id="search-text">
                
              </span>

              <input
                id="search"
                ref={searchInput}
                value={searchText}
                onChange={search}
                onBlur={handleSearchInputBlur}
                placeholder="Search"
                className="search"
              />
            </a>
        </div>
          
          <br />
          <div
          ref={swiperContainer}
          tabIndex={0} // makes div focusable
          onMouseOver={(e) => {
            swiperContainer.current.focus();

          }}
          onKeyDown={(e)=>{handleSwipe(e);console.log("ppppp")}}
          style={{ outline: "none" }}
          >

          <Swiper
            ref={homeSwiper}
            effect={"coverflow"}
            spaceBetween={30}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            // mousewheel={true}
            // loop={true}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            modules={[Mousewheel, EffectCoverflow, Autoplay]}
            className="mySwiper"
          >
            {exploreMembers &&
              exploreMembers.map((member) => (
                <SwiperSlide>
                  <div className="slides"
                  onClick={()=>{nav(`/MemberProfile/${member.username}`)}}
                  >
                    <img src={`${member.pfpPath}`} />
                    <div className="swiper-details">
                      <h3>
                        {member.fullName}, {member.age}
                      </h3>
                      <h3>{member.shortDescription}</h3>
                      <h3>{member.relationshipIntent} &#128158;</h3>
                      <h3 style={{ display: "flex" }}>
                        {" "}
                        {member.likes.length} likes
                      </h3>
                      <h3>{member.connections} Connections</h3>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
          </div>
        </div>
        <br />
        <h2 ref={exploreHeading}>Explore Profiles</h2>
        <br />

        <div id="explore">
          {/* {allMembers && loading === true ? (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(() => (
                <div
                  className="preview-profile"
                  style={{ display: "flexBox", gap: "10px" }}
                >
                  <Skeleton
                    animation="wave"
                    sx={{ bgcolor: "grey.900" }}
                    variant="rounded"
                    width={250}
                    height="90%"
                  />
                  <Skeleton
                    animation="wave"
                    sx={{ bgcolor: "grey.900" }}
                    variant="rounded"
                    width="50%"
                    height="10%"
                  />
                </div>
              ))}
            </>
          ) :allMembers && allMembers.length === 0 ? (
            <h3>No results found</h3>
          ) : (allMembers && */}
          {exploreMembers &&
            exploreMembers.map((member) => (
              <Link to={`/MemberProfile/${member.username}`}>
                <div key={member.username} className="preview-profile">
                  <img
                    alt={`a picture of ${member.username}`}
                    src={`${member.pfpPath}`}
                  /> 
                  <h3>
                    {member.username}, {member.age}
                  </h3>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
