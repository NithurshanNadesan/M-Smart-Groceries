import React from "react";
import "./Footer.css";
import bestPricesIcon from "../Assets/best-prices.jpg";
import wideAssortmentIcon from "../Assets/wide-assortment.jpg";
import easyReturnsIcon from "../Assets/easy-returns.jpg";

const Footer = () => {
  return (
    <footer className="footer">
      <hr/>
      <div className="footer-container">
        <p className="footer-intro">
        Enter to M Smart Groceries – your one-stop online grocery store for fresh, frozen, and everything in between! Order all your daily essentials from the comfort of your home or on the go. Choose same-day, next-day, or saver delivery options to get what you need, when you need it!
        </p>
        <hr/>
        <div class="footer-highlights">
          <div class="highlight">
            <img src={bestPricesIcon} alt="Icon 1"/>
            <div class="highlight-text">
              <h3>Best Prices & Offers</h3>
              <p>Enjoy the same lowest prices as your local Murugan Stores!</p>
            </div>
          </div>
          <div class="highlight">
            <img src={wideAssortmentIcon} alt="Icon 2"/>
            <div class="highlight-text">
              <h3>Wide Assortment</h3>
              <p>Choose from a variety of products from branded, chilled, fresh & frozen.</p>
            </div>
          </div>
          <div class="highlight">
            <img src={easyReturnsIcon} alt="Icon 3"/>
            <div class="highlight-text">
              <h3>Multiple Payment Options</h3>
              <p>Choose from credit/debit cards, or cash on delivery!</p>
            </div>
          </div>
        </div>
        
        <hr/>
        <p className="footer-bottom">&copy; 2024 - 2025 M Smart Groceries. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
