// src/App.js or your main routing component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import UpdateProduct from "./components/UpdateProduct";
import ManageOrders from "./components/ManageOrders";
import DeleteProduct from "./components/Delete";
import EditProduct from "./components/EditProduct";
import AddProducts from "./components/AddProducts";

const App = () => {
  return (
    
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/addproduct" element={<AddProducts />} />
        <Route path="/orders" element={<ManageOrders />} />
        <Route path="/updateproduct" element={<UpdateProduct />} />
        <Route path="/deleteproduct" element={<DeleteProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
      </Routes>
    </Router>
    
  );
};

export default App;
