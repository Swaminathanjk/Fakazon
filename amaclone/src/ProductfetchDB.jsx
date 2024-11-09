import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchingActions } from "./Store/FetchSlice";
import { productActions } from "./Store/productSlice";

const Productfetch = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    // Prevent fetching if already done
    if (fetchStatus.fetchDone) return;

    const controller = new AbortController();
    const signal = controller.signal;

    dispatch(fetchingActions.fetchingStart());

    // Fetching products from the backend
    fetch("http://localhost:5000/api/products", { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json(); // Parse the JSON response
      })
      .then((products) => {
        dispatch(productActions.addInitialProducts(products)); // Store products in Redux
        dispatch(fetchingActions.markfetchDone()); // Mark fetching as done
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        dispatch(fetchingActions.fetchingEnd()); // Handle any errors that occur during fetching
      });

    return () => {
      controller.abort(); // Cleanup the fetch request on unmount
    };
  }, [fetchStatus.fetchDone, dispatch]);

  return null; // Return null if no UI is rendered
};

export default Productfetch;
