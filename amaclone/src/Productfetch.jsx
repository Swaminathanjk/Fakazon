import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchingActions } from "./Store/FetchSlice";
import { productActions } from "./Store/productSlice";

const Productfetch = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus.fetchDone === true) return;
    const controller = new AbortController();
    const signal = controller.signal;
    dispatch(fetchingActions.fetchingStart());
    fetch("http://localhost:8000/items", { signal })
      .then((res) => res.json())
      .then(({ items }) => {
        // console.log(items);
        
        
       
        
        dispatch(fetchingActions.markfetchDone()); 
        dispatch(fetchingActions.fetchingEnd());
        dispatch(productActions.addInitialProducts(items));
      });

    return () => {
      controller.abort();
    };
  }, [fetchStatus.fetchDone]);

  return <></>;
};

export default Productfetch;
