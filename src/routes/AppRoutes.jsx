import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

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

            <Route
                path="/"
                element={
                    <Navigate
                        to="/products"
                        replace
                    />
                }
            />

            <Route
                path="/landing"
                element={<Landing />}
            />

            <Route
                path="/products"
                element={<Products />}
            />

            <Route
                path="/products/:id"
                element={<ProductDetails />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
            />

            <Route
                path="/cart"
                element={<Cart />}
            />

            <Route
                path="/wishlist"
                element={<Wishlist />}
            />

            <Route
                path="/profile"
                element={<Profile />}
            />

            <Route
                path="*"
                element={
                    <Navigate
                        to="/products"
                        replace
                    />
                }
            />

        </Routes>

    );
}

export default AppRoutes;