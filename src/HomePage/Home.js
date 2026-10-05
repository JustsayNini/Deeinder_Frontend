import React from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useRef } from "react";
import { members } from "../Context/MembersContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Mousewheel, EffectCoverflow, Autoplay } from "swiper/modules";
import CommonNavbar from "../CommonNavbar/CommonNavbar";

function Home() {
  const { exploreMembers, setExploreMembers, handleSearch } = useContext(members);
  const homeHeader = useRef();
  const homeSwiper = useRef();
  const exploreHeading = useRef();
  const swiperContainer = useRef();
  const nav = useNavigate();

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

  function handleSearchInputBlur() {
    homeHeader.current.textContent = "People You May Know";
    exploreHeading.current.style.display = "block";
    setTimeout(() => {
      setSearchText("");
      handleSearch("", setExploreMembers);
      homeSwiper.current.style.display = "block";
    }, 300);
  }

  // Placeholder function to prevent runtime reference crashes
  function handleAction() {
    // If custom parent action is defined, invoke it here
  }

  return (
    <div id="home">
      <div className="home-navbar">
        <CommonNavbar />
      </div>

      <div id="home-content">
        <div className="home-header">
          <div className="home-headings">
            <h2 ref={homeHeader}>People You May Know</h2>
            
            <button 
              type="button" 
              onClick={handleAction} 
              className="link-style-button"
            >
              Click Me
            </button>
            
            <span ref={searchTextElement} id="search-text"></span>

            <input
              id="search"
              ref={searchInput}
              value={searchText}
              onChange={search}
              onBlur={handleSearchInputBlur}
              placeholder="Search"
              className="search"
            />
          </div>
        </div>
        
        <br />
        
        <div
          ref={swiperContainer}
          tabIndex={0}
          onMouseOver={() => {
            if (swiperContainer.current) swiperContainer.current.focus();
          }}
          onKeyDown={(e) => {
            handleSwipe(e);
            console.log("ppppp");
          }}
          style={{ outline: "none" }}
        >
          <Swiper
            ref={homeSwiper}
            effect={"coverflow"}
            spaceBetween={30}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
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
                <SwiperSlide key={`slide-${member.username}`}>
                  <div 
                    className="slides"
                    onClick={() => {
                      nav(`/MemberProfile/${member.username}`);
                    }}
                  >
                    <img 
                      src={`${member.pfpPath}`} 
                      alt={`${member.fullName}'s profile overview`} 
                    />
                    <div className="swiper-details">
                      <h3>
                        {member.fullName}, {member.age}
                      </h3>
                      <h3>{member.shortDescription}</h3>
                      <h3>{member.relationshipIntent} 💞</h3>
                      <h3 style={{ display: "flex" }}>
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
        {exploreMembers &&
          exploreMembers.map((member) => (
            <Link key={`explore-${member.username}`} to={`/MemberProfile/${member.username}`}>
              <div className="preview-profile">
                <img
                  alt={`${member.username}`}
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
  );
}

export default Home;

