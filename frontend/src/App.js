import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import { AuthProvider } from './Context/AuthContext'; // Import the AuthProvider
import Profile from './Pages/Profile';
import Orders from './Pages/Orders';
// In your App.js or routing file
import Checkout from './Components/Checkout/Checkout';

// Add this route


function App() {
  return (
    <div>
      <BrowserRouter>
      <AuthProvider>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>} />
        <Route path='/freshAndPantry' element={<ShopCategory category={["Fresh Items", "Pantry Staples"]}/>} />
        <Route path='/snacksAndBeverage' element={<ShopCategory category={["Snacks", "Beverages"]}/>} />
        <Route path='/personalAndChild' element={<ShopCategory category={["Personal Care", "Child Care"]}/>} />
        <Route path='/household' element={<ShopCategory category="Household Items"/>} />
        <Route path='/product' element={<Product/>}>
          <Route path=':productId' element={<Product/>} />
        </Route>
        <Route path='/profile' element={<Profile />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/cart' element={<Cart/>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path='/loginSignup' element={<LoginSignup/>} />
      </Routes>
      
      <Footer/>
      </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
