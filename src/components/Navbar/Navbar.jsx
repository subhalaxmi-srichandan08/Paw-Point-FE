import "./Navbar.css";

import {
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";

import {
    FaPaw,
    FaUser
} from "react-icons/fa";

import {
    BsCart3
} from "react-icons/bs";

import {
    FiSearch,
    FiX,
    FiLoader
} from "react-icons/fi";

import authService from "../../services/authService";
import productService from "../../services/productService";

import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";

import {
    useEffect,
    useRef,
    useState
} from "react";


function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const searchContainerRef = useRef(null);
    const requestIdRef = useRef(0);

    const user = useAuthStore(
        state => state.user
    );

    const isAuthenticated = useAuthStore(
        state => state.isAuthenticated
    );

    const logoutStore = useAuthStore(
        state => state.logout
    );

    const count = useCartStore(
        state => state.count
    );

    const fetchCart = useCartStore(
        state => state.fetchCart
    );


    /* =========================================
       SEARCH STATE
    ========================================= */

    const [search, setSearch] = useState(() => {

        const params =
            new URLSearchParams(
                window.location.search
            );

        return params.get("search") || "";

    });

    const [suggestions, setSuggestions] = useState({
        products: [],
        brands: [],
        categories: []
    });

    const [showSuggestions, setShowSuggestions] =
        useState(false);

    const [suggestionsLoading, setSuggestionsLoading] =
        useState(false);


    /* =========================================
       SYNC SEARCH WITH URL
    ========================================= */

    useEffect(() => {

        const params =
            new URLSearchParams(
                location.search
            );

        setSearch(
            params.get("search") || ""
        );

        setShowSuggestions(false);

    }, [location.search]);


    /* =========================================
       SEARCH SUGGESTIONS
    ========================================= */

    useEffect(() => {

        const keyword = search.trim();

        /*
         * Don't search for empty strings
         * or a single character.
         */

        if (keyword.length < 2) {

            requestIdRef.current += 1;

            setSuggestions({
                products: [],
                brands: [],
                categories: []
            });

            setSuggestionsLoading(false);
            setShowSuggestions(false);

            return;

        }


        /*
         * Create request ID.
         *
         * This prevents an old API response
         * from replacing a newer search result.
         */

        const requestId =
            ++requestIdRef.current;


        /*
         * Debounce API call.
         */

        const timer = setTimeout(
            async () => {

                try {

                    setSuggestionsLoading(true);
                    setShowSuggestions(true);


                    const response =
                        await productService.getSearchSuggestions(
                            keyword
                        );


                    /*
                     * Ignore stale response.
                     */

                    if (
                        requestId !==
                        requestIdRef.current
                    ) {

                        return;

                    }


                    const data =
                        response?.data || {};


                    setSuggestions({

                        products:
                            Array.isArray(
                                data.products
                            )
                                ? data.products
                                : [],

                        brands:
                            Array.isArray(
                                data.brands
                            )
                                ? data.brands
                                : [],

                        categories:
                            Array.isArray(
                                data.categories
                            )
                                ? data.categories
                                : []

                    });

                } catch (error) {

                    if (
                        requestId !==
                        requestIdRef.current
                    ) {

                        return;

                    }


                    console.error(
                        "Search suggestions error:",
                        error
                    );


                    setSuggestions({
                        products: [],
                        brands: [],
                        categories: []
                    });

                } finally {

                    if (
                        requestId ===
                        requestIdRef.current
                    ) {

                        setSuggestionsLoading(false);

                    }

                }

            },
            250
        );


        return () => {

            clearTimeout(timer);

        };

    }, [search]);


    /* =========================================
       CLOSE SUGGESTIONS ON OUTSIDE CLICK
    ========================================= */

    useEffect(() => {

        const handleOutsideClick = event => {

            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(
                    event.target
                )
            ) {

                setShowSuggestions(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    /* =========================================
       ESCAPE KEY
    ========================================= */

    useEffect(() => {

        const handleEscape = event => {

            if (event.key === "Escape") {

                setShowSuggestions(false);

            }

        };


        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    /* =========================================
       CART
    ========================================= */

    useEffect(() => {

        if (isAuthenticated) {

            fetchCart();

        }

    }, [
        isAuthenticated,
        fetchCart
    ]);


    /* =========================================
       LOGOUT
    ========================================= */

    const handleLogout = async () => {

        try {

            await authService.logout();

        } catch (error) {

            console.error(error);

        } finally {

            logoutStore();

            navigate(
                "/",
                {
                    replace: true
                }
            );

        }

    };


    /* =========================================
       SEARCH
    ========================================= */

    const handleSearch = event => {

        event.preventDefault();

        const keyword =
            search.trim();


        setShowSuggestions(false);


        const params =
            new URLSearchParams();


        if (keyword) {

            params.set(
                "search",
                keyword
            );

        }


        navigate(
            `/products?${params.toString()}`
        );

    };


    /* =========================================
       CLEAR SEARCH
    ========================================= */

    const clearSearch = () => {

        requestIdRef.current += 1;

        setSearch("");

        setSuggestions({
            products: [],
            brands: [],
            categories: []
        });

        setSuggestionsLoading(false);

        setShowSuggestions(false);

        navigate("/products");

    };


    /* =========================================
       SELECT PRODUCT
    ========================================= */

    const handleProductSelect = product => {

        if (!product?.slug) {

            return;

        }


        setSearch("");

        setShowSuggestions(false);


        navigate(
            `/products/${product.slug}`
        );

    };


    /* =========================================
       SELECT BRAND
    ========================================= */

    const handleBrandSelect = brand => {

        if (!brand?.slug) {

            return;

        }


        setSearch("");

        setShowSuggestions(false);


        navigate(
            `/products?brand=${encodeURIComponent(
                brand.slug
            )}`
        );

    };


    /* =========================================
       SELECT CATEGORY
    ========================================= */

    const handleCategorySelect = category => {

        if (!category?.slug) {

            return;

        }


        setSearch("");

        setShowSuggestions(false);


        navigate(
            `/products?category=${encodeURIComponent(
                category.slug
            )}`
        );

    };


    /* =========================================
       SUGGESTION STATE
    ========================================= */

    const hasSuggestions =
        suggestions.products.length > 0 ||
        suggestions.brands.length > 0 ||
        suggestions.categories.length > 0;


    /* =========================================
       CAPITALIZE
    ========================================= */

    const capitalizeFirstLetter = str => {

        if (!str) {

            return "";

        }


        return (
            str.charAt(0).toUpperCase() +
            str.slice(1)
        );

    };


    /* =========================================
       RENDER
    ========================================= */

    return (

        <header className="navbar">

            <div className="container navbar-container">


                {/* =====================================
                    LOGO
                ====================================== */}

                <Link
                    to="/"
                    className="logo"
                >

                    <span className="logo-icon">

                        <FaPaw />

                    </span>


                    <span className="logo-text">

                        PawPoint

                    </span>

                </Link>


                {/* =====================================
                    NAVIGATION
                ====================================== */}

                <nav className="navbar-nav">

                    {/* <Link to="/">
                        Home
                    </Link> */}


                    <Link to="/products?pet=Dog">
                        Dogs
                    </Link>


                    <Link to="/products?pet=Cat">
                        Cats
                    </Link>


                    <Link to="/products">
                        Home
                    </Link>


                    <Link to="/wishlist">
                        Wishlist
                    </Link>

                </nav>


                {/* =====================================
                    SEARCH
                ====================================== */}

                <div
                    className="navbar-search-wrapper"
                    ref={searchContainerRef}
                >

                    <form
                        className="navbar-search"
                        onSubmit={handleSearch}
                    >

                        <FiSearch
                            className="search-icon"
                        />


                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={event => {

                                const value =
                                    event.target.value;

                                setSearch(value);


                                if (
                                    value.trim().length >= 2
                                ) {

                                    setShowSuggestions(
                                        true
                                    );

                                } else {

                                    setShowSuggestions(
                                        false
                                    );

                                }

                            }}
                            onFocus={() => {

                                if (
                                    search.trim().length >= 2
                                ) {

                                    setShowSuggestions(
                                        true
                                    );

                                }

                            }}
                            autoComplete="off"
                        />


                        {suggestionsLoading && (

                            <FiLoader
                                className="search-loading-icon"
                            />

                        )}


                        {search &&
                            !suggestionsLoading && (

                            <button
                                type="button"
                                className="search-clear"
                                onClick={clearSearch}
                                aria-label="Clear search"
                            >

                                <FiX />

                            </button>

                        )}


                        <button
                            type="submit"
                            className="search-submit"
                        >

                            Search

                        </button>

                    </form>


                    {/* =================================
                        SUGGESTIONS DROPDOWN
                    ================================== */}

                    {showSuggestions &&
                        search.trim().length >= 2 && (

                        <div className="search-suggestions">


                            {/* =================================
                                LOADING
                            ================================== */}

                            {suggestionsLoading && (

                                <div className="suggestions-loading">

                                    <FiLoader
                                        className="suggestions-spinner"
                                    />

                                    <span>
                                        Searching...
                                    </span>

                                </div>

                            )}


                            {/* =================================
                                RESULTS
                            ================================== */}

                            {!suggestionsLoading &&
                                hasSuggestions && (

                                <>


                                    {/* =================================
                                        PRODUCTS
                                    ================================== */}

                                    {suggestions.products.length > 0 && (

                                        <div className="suggestion-section">

                                            <div className="suggestion-section-title">
                                                Products
                                            </div>


                                            {suggestions.products.map(
                                                product => {

                                                    return (

                                                        <button
                                                            key={
                                                                product._id ||
                                                                product.slug
                                                            }
                                                            type="button"
                                                            className="suggestion-product"
                                                            onClick={() =>
                                                                handleProductSelect(
                                                                    product
                                                                )
                                                            }
                                                        >

                                                            <div className="suggestion-product-image">

                                                                <img
                                                                    src={
                                                                        product.thumbnail
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                />

                                                            </div>


                                                            <div className="suggestion-product-info">

                                                                <div className="suggestion-product-name">

                                                                    {
                                                                        product.name
                                                                    }

                                                                </div>


                                                                {product.discountPrice !==
                                                                    undefined && (

                                                                    <div className="suggestion-product-price">

                                                                        ₹
                                                                        {Number(
                                                                            product.discountPrice
                                                                        ).toLocaleString(
                                                                            "en-IN"
                                                                        )}

                                                                    </div>

                                                                )}

                                                            </div>

                                                        </button>

                                                    );

                                                }
                                            )}

                                        </div>

                                    )}


                                    {/* =================================
                                        BRANDS
                                    ================================== */}

                                    {suggestions.brands.length > 0 && (

                                        <div className="suggestion-section">

                                            <div className="suggestion-section-title">
                                                Brands
                                            </div>


                                            {suggestions.brands.map(
                                                brand => {

                                                    return (

                                                        <button
                                                            key={
                                                                brand._id ||
                                                                brand.slug
                                                            }
                                                            type="button"
                                                            className="suggestion-simple-item"
                                                            onClick={() =>
                                                                handleBrandSelect(
                                                                    brand
                                                                )
                                                            }
                                                        >

                                                            {brand.logo && (

                                                                <img
                                                                    src={
                                                                        brand.logo
                                                                    }
                                                                    alt=""
                                                                    className="suggestion-brand-logo"
                                                                />

                                                            )}


                                                            <span>

                                                                {
                                                                    brand.name
                                                                }

                                                            </span>

                                                        </button>

                                                    );

                                                }
                                            )}

                                        </div>

                                    )}


                                    {/* =================================
                                        CATEGORIES
                                    ================================== */}

                                    {suggestions.categories.length > 0 && (

                                        <div className="suggestion-section">

                                            <div className="suggestion-section-title">
                                                Categories
                                            </div>


                                            {suggestions.categories.map(
                                                category => {

                                                    return (

                                                        <button
                                                            key={
                                                                category._id ||
                                                                category.slug
                                                            }
                                                            type="button"
                                                            className="suggestion-simple-item"
                                                            onClick={() =>
                                                                handleCategorySelect(
                                                                    category
                                                                )
                                                            }
                                                        >

                                                            <span>

                                                                {
                                                                    category.name
                                                                }

                                                            </span>


                                                            {category.pet && (

                                                                <span className="suggestion-category-pet">

                                                                    {
                                                                        category.pet
                                                                    }

                                                                </span>

                                                            )}

                                                        </button>

                                                    );

                                                }
                                            )}

                                        </div>

                                    )}

                                </>

                            )}


                            {/* =================================
                                NO RESULTS
                            ================================== */}

                            {!suggestionsLoading &&
                                !hasSuggestions && (

                                <div className="suggestions-empty">

                                    <FiSearch />

                                    <span>
                                        No products found
                                    </span>

                                </div>

                            )}


                            {/* =================================
                                SEARCH ALL
                            ================================== */}

                            {!suggestionsLoading && (

                                <button
                                    type="button"
                                    className="suggestions-search-all"
                                    onClick={handleSearch}
                                >

                                    <FiSearch />

                                    <span>

                                        Search for "{search.trim()}"

                                    </span>

                                </button>

                            )}

                        </div>

                    )}

                </div>


                {/* =====================================
                    ACTIONS
                ====================================== */}

                <div className="navbar-actions">


                    {/* =================================
                        CART
                    ================================== */}

                    <button
                        type="button"
                        className="cart-button"
                        onClick={() =>
                            navigate("/cart")
                        }
                        aria-label="Shopping cart"
                    >

                        <BsCart3 />


                        {count > 0 && (

                            <span className="cart-count">

                                {count}

                            </span>

                        )}

                    </button>


                    {/* =================================
                        USER
                    ================================== */}

                    {isAuthenticated ? (

                        <div className="user-section">

                            <button
                                type="button"
                                className="user-button"
                                onClick={() =>
                                    navigate(
                                        "/profile"
                                    )
                                }
                            >

                                <span className="user-avatar">

                                    {user?.avatar ? (

                                        <img
                                            src={
                                                user.avatar
                                            }
                                            alt={
                                                user.firstName
                                            }
                                        />

                                    ) : (

                                        <FaUser />

                                    )}

                                </span>


                                <span className="user-name">

                                    {capitalizeFirstLetter(
                                        user?.firstName
                                    )}

                                </span>

                            </button>


                            <button
                                type="button"
                                className="nav-logout-btn"
                                onClick={
                                    handleLogout
                                }
                            >

                                Logout

                            </button>

                        </div>

                    ) : (

                        <div className="auth-actions">

                            <button
                                type="button"
                                className="login-button"
                                onClick={() =>
                                    navigate(
                                        "/login"
                                    )
                                }
                            >

                                Login

                            </button>


                            <button
                                type="button"
                                className="register-button"
                                onClick={() =>
                                    navigate(
                                        "/register"
                                    )
                                }
                            >

                                Register

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>

    );

}


export default Navbar;