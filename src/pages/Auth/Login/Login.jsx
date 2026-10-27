import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import {
    FaEye,
    FaEyeSlash,
    FaEnvelope,
    FaLock,
    FaPaw,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import useAuthStore from "../../../store/authStore";
import "./Login.css";
import { DogFace, CatFace } from "./Petfaces";
import authService from "../../../services/authService";
import { validateLogin } from "../../../utils/validators";
const initialState = {
    email: "",
    password: "",
};
function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const setAuth = useAuthStore(state => state.setAuth);
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = {
            ...form,
            [name]: value,
        };
        setForm(updatedForm);
        setErrors(validateLogin(updatedForm));
    };
    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setLoading(true);

            const response =
                await authService.login(form);

            setAuth(
                response.data.data.user,
                response.data.data.accessToken
            );

            toast.success(response.message);

            navigate("/products");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Login failed."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin =
        async credentialResponse => {

            try {

                setLoading(true);

                const response =
                    await authService.googleLogin(
                        credentialResponse.credential
                    );

                const data =
                    response.data.data;

                setAuth(
                    data.user,
                    data.accessToken
                );

                toast.success(
                    "Google sign in successful."
                );

                navigate(
                    "/products",
                    { replace: true }
                );

            } catch (error) {

                console.error(
                    "Google login error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Google sign in failed."
                );

            } finally {

                setLoading(false);

            }
        };

    return (
        <section className="login-page">
            <div className="login-left">
                <FaPaw className="paw-icon" />
                <h1>PawPoint</h1>
                <h2>A Better World for Your Best Friend</h2>
                <div className="hero-words" aria-hidden="true">
                    <span>Woof.</span>
                    <span>Meow.</span>
                </div>
                <p>
                    Treats, toys and everyday essentials for dogs and cats, all in one place.
                </p>
                <span className="delivery-badge">
                    Free delivery over ₹499
                </span>
                <div className="pet-faces" aria-hidden="true">
                    <DogFace />
                    <CatFace />
                </div>
            </div>
            <div className="login-right">
                <form
                    className="login-card"
                >
                    <h2>Sign In</h2>
                    <p className="subtitle">
                        Welcome back! Please login
                        to continue.
                    </p>
                    <div>
                        <div className="input-group">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                        <span className="field-error">
                            {errors.email}
                        </span>
                    </div>
                    <div>
                        <div className="password-box">
                            <FaLock className="input-icon" />
                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {
                                    showPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                }
                            </button>
                        </div>
                        <span className="field-error">
                            {errors.password}
                        </span>
                    </div>
                    <div className="login-options">
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(
                                        e.target.checked
                                    )
                                }
                            />
                            Remember Me
                        </label>
                        <Link
                            to="/forgot-password"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <button
                        className="login-btn"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {
                            loading
                                ?
                                <ClipLoader
                                    color="#fff"
                                    size={20}
                                />
                                :
                                "Sign In"
                        }
                    </button>
                    <div className="google-divider">
                        <span>OR</span>
                    </div>
                    <div className="google-login">
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => {
                                toast.error(
                                    "Google sign in failed."
                                );
                            }}
                            useOneTap={false}
                            width="100%"
                        />
                    </div>
                    <p className="bottom-text">
                        Don't have an account?
                        <Link to="/register">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
}
export default Login;