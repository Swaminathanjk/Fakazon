import React, { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
// import Productfetch from "./Productfetch";
import Loading from "./Components/Loading";
// import FetchDB from "./FetchDB";
import ProductfetchDB from "./ProductfetchDB";
import { CartProvider } from "./Context/CartContext";

const App = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const topRef = useRef(null);
  const location = useLocation();

  // Conditional rendering of Header based on current route
  const hideHeaderRoutes = ["/","/login", "/signup"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <CartProvider>
      <div ref={topRef}></div>
      {shouldShowHeader && <Header />}
      {/* <Productfetch /> */}
      {/* <FetchDB /> */}
      <ProductfetchDB/>
      {fetchStatus.CurrFetching ? <Loading /> : <Outlet />}
      {shouldShowHeader && <Footer scrollToTop={scrollToTop} />}
    </CartProvider>
  );
};

export default App;
