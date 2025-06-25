import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Ads.css";

const Ads = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get("http://localhost:4000/ads");
        setAds(res.data);
      } catch (err) {
        console.error("Failed to fetch ads:", err);
      }
    };

    fetchAds();
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    pauseOnHover: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
  };

  return (
    <div className="ad-slider-container">
      <Slider {...settings}>
        {ads.map((ad) => (
          <div key={ad._id} className="ad-slide">
            <img
              src={`${ad.image}`} // prepend server URL
              alt={ad.title}
              className="ad-img"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Ads;
