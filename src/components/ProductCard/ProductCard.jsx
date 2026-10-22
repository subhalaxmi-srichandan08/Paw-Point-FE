import "./ProductCard.css";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import cartService from "../../services/cartService";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";

function ProductCard({ product }) {

    const navigate = useNavigate();

    const isAuthenticated = useAuthStore(
        state => state.isAuthenticated
    );

    const fetchCart = useCartStore(
        state => state.fetchCart
    );

    const wishlist = useWishlistStore(
        state => state.wishlist
    );

    const addToWishlist = useWishlistStore(
        state => state.addToWishlist
    );

    const removeFromWishlist = useWishlistStore(
        state => state.removeFromWishlist
    );

    const {
        _id,
        slug,
        thumbnail,
        name,
        brand,
        price,
        discountPrice,
        rating,
        reviewCount,
        labels = [],
    } = product;

    const discount =
        price > 0
            ? Math.round(
                ((price - discountPrice) / price) * 100
            )
            : 0;
    const isWishlisted = wishlist.some(
        item => item.product._id === _id
    );

    const handleAddToCart = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {

            toast.info("Please login first");

            navigate("/login");

            return;

        }

        try {

            await cartService.addToCart(
                _id,
                1
            );

            await fetchCart();

            toast.success("Added to cart");

        } catch (err) {

            console.error(err);

            toast.error(
                err.response?.data?.message ||
                "Failed to add to cart"
            );

        }

    };

    const handleWishlist = async e => {

        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {

            toast.info("Please login first");
            navigate("/login");

            return;

        }

        try {

            if (isWishlisted) {

                await removeFromWishlist(_id);

                toast.success("Removed from wishlist");

            } else {

                await addToWishlist(product);

                toast.success("Added to wishlist");

            }

        } catch (error) {
            console.error(error);
            toast.error("Failed");
        }

    };

    return (

        <div className="product-card">

            <button
    className={`wishlist-btn ${
        isWishlisted ? "active" : ""
    }`}
    onClick={handleWishlist}
    aria-label="Wishlist"
>

    {
        isWishlisted
            ? <FaHeart />
            : <FaRegHeart />
    }

</button>

            <Link
                to={`/products/${_id}`}
                className="product-image"
            >

                <img
                    src={thumbnail}
                    alt={name}
                />

                {

                    labels.length > 0 && (

                        <span className="product-badge">

                            {labels[0].replaceAll("_", " ")}

                        </span>

                    )

                }

            </Link>

            <div className="product-content">

                <p className="product-brand">

                    {brand?.name}

                </p>

                <Link
                    to={`/products/${_id}`}
                    className="product-name"
                >

                    {name}

                </Link>

                <div className="product-rating">

                    ⭐ {rating} ({reviewCount})

                </div>

                <div className="product-price">

                    <span className="discount-price">

                        ₹{discountPrice}

                    </span>

                    <span className="original-price">

                        ₹{price}

                    </span>

                    <span className="discount">

                        {discount}% OFF

                    </span>

                </div>

                <button
                    className="add-cart-btn"
                    onClick={handleAddToCart}
                >

                    Add To Cart

                </button>

            </div>

        </div>

    );

}

export default ProductCard;