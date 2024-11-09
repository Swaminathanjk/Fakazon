import React from "react";
import HomeItems from "../Components/Home/HomeItems";
import "./Home.css";
import { useSelector } from "react-redux";
import HomeBanner from "./HomeBanner";

const Home = () => {
  const products = useSelector((store) => store.products);
  console.log(products);
  

  // const categories = useSelector((state) => state.category.categories); // Access categories from Redux
  const selectedCategory = useSelector(
    (state) => state.category.selectedCategory
  );

  const filteredProducts =
    selectedCategory === "All" || !selectedCategory
      ? products
      : products.filter((item) => item.category === selectedCategory);
  //  console.log(filteredProducts)
  return (
    <>
    <HomeBanner />
      <div className="home">
        
        <div className="home-container">
          {filteredProducts.map((item) => (
            <HomeItems key={item._id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
