import React from 'react'
import './Hero.css'
import trolley_icon from '../Assets/trolley_icon.png'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>All Your Daily Essentials</h2>
        <div>
            <div className="hero-trolley-icon">
                <p>From fresh produce to pantry staples</p>
                <img src={trolley_icon} alt="" />
            </div>
            <p>Everything for a stocked home.</p>
            <p>Shop easily with just a click.</p>
        </div>
        <div className="hero-shop-btn">
            <div>Shop Now</div>
            <img src={arrow_icon} alt="" />
        </div>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt="" />
      </div>
    </div>
  )
}

export default Hero
