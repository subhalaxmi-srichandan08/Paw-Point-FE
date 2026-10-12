import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import Products from "../pages/Products/Products";
import Profile from "../pages/Profile/Profile";

import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";

function AppRoutes() {
    return (
        <Routes>
            {/* Default route: open Login page */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/landing" element={<Landing />} />
            <Route path="/products" element={<Products />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/products/:slug" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />

            {/* Handle invalid URLs */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default AppRoutes;