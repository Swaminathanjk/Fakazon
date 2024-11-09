import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const FetchDB = () => {
  const products = useSelector((store) => store.products);
  const { url } = useSelector((store) => store.url);
  const uploadProducts = async () => {
    for (const item of products) {
      const formData = new FormData();

      const response = await fetch(item.image);
      const blob = await response.blob();
      const file = new File([blob], item.item_name + ".jpg");

      // Append the file and other product details
      formData.append("image", file);
      formData.append("company", item.company);
      formData.append("item_name", item.item_name);
      formData.append("category", item.category);
      formData.append("original_price", item.original_price);
      formData.append("current_price", item.current_price);
      formData.append("discount_percentage", item.discount_percentage);
      formData.append("return_period", item.return_period);
      formData.append("delivery_date", item.delivery_date);
      formData.append("rating", JSON.stringify(item.rating));

      try {
        const response = await axios.post(
          `${url}/api/products`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  useEffect(() => {
    uploadProducts();
  }, [products]);

  return null;
};

export default FetchDB;
