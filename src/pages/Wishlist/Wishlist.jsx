import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useWishlistStore from "../../store/wishlistStore";
import cartService from "../../services/cartService";
import useCartStore from "../../store/cartStore";

import "./Wishlist.css";

function Wishlist() {

    const navigate = useNavigate();

    const wishlist = useWishlistStore(
        state => state.wishlist
    );

    const fetchWishlist = useWishlistStore(
        state => state.fetchWishlist
    );

    const removeFromWishlist = useWishlistStore(
        state => state.removeFromWishlist
    );

    const fetchCart = useCartStore(
        state => state.fetchCart
    );

    useEffect(() => {

        fetchWishlist();

    }, []);

    const handleAddToCart = async productId => {

        try {

            await cartService.addToCart(
                productId,
                1
            );

            await fetchCart();

            toast.success(
                "Added to cart"
            );

        } catch (error) {

            toast.error(
                "Failed to add to cart"
            );

        }

    };
    if (!wishlist.length) {

        return (

            <div className="wishlist-empty">

                <h2>

                    Your wishlist is empty ❤️

                </h2>

            </div>

        );

    }

    return (

        <div className="wishlist-page container">

            <h1>My Wishlist</h1>

            <div className="wishlist-grid">

                {

                    wishlist.filter((i)=>i?.product).map(item => {

                        const product =
                            item.product;

                        return (

                            <div
                                key={item._id}
                                className="wishlist-card"
                            >

                                <img
                                    src={product.thumbnail}
                                    alt={product.name}
                                    onClick={() =>
                                        navigate(
                                            `/products/${product.slug}`
                                        )
                                    }
                                />

                                <h3>

                                    {product.name}

                                </h3>

                                <p>

                                    {product.brand?.name}

                                </p>

                                <h4>

                                    ₹{product.discountPrice}

                                </h4>

                                <div className="wishlist-actions">

                                    <button
                                        onClick={() =>
                                            handleAddToCart(
                                                product._id
                                            )
                                        }
                                    >

                                        Add To Cart

                                    </button>

                                    <button
                                        className="remove-btn"
                                        onClick={() =>
                                            removeFromWishlist(
                                                product._id
                                            )
                                        }
                                    >

                                        Remove

                                    </button>

                                </div>

                            </div>

                        );

                    })

                }

            </div>

        </div>

    );

}

export default Wishlist;