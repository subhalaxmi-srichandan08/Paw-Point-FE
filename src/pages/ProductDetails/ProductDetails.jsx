import "./ProductDetails.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import productService from "../../services/productService";
import ProductCard from "../../components/ProductCard/ProductCard";

import cartService from "../../services/cartService";
import { toast } from "react-toastify";

import useCartStore from "../../store/cartStore";
import ProductDetailsSkeleton from "../../components/Skeletons/ProductDetailsSkeleton";

function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productService.getProductById(id);

                const data = res.data.data;

                setProduct(data.product);
                setRelatedProducts(data.relatedProducts || []);

                if (data.product.images?.length > 0)
                    setSelectedImage(data.product.images[0]);
                else
                    setSelectedImage(data.product.thumbnail);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);
    const fetchCart = useCartStore(state => state.fetchCart);
    
    if (loading) {
    return <ProductDetailsSkeleton />;
}

    if (!product) return <h2 className="container">Product not found</h2>;

    const discount =
        Math.round(
            ((product.price - product.discountPrice) /
                product.price) *
            100
        );



    const handleAddToCart = async () => {

        try {

            await cartService.addToCart(product._id, quantity);

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



    return (
        <div className="container product-details">
        <br></br>

            <div className="details-top">

                <div className="gallery">

                    <img
                        className="main-image"
                        src={selectedImage}
                        alt={product.name}
                    />

                    <div className="thumbs">

                        {[product.thumbnail, ...(product.images || [])].map(
                            (img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt=""
                                    onClick={() =>
                                        setSelectedImage(img)
                                    }
                                />
                            )
                        )}

                    </div>

                </div>

                <div className="details">

                    <p className="brand">
                        {product.brand?.name}
                    </p>

                    <h1>{product.name}</h1>

                    <div className="rating">
                        ⭐ {product.rating} ({product.reviewCount} Reviews)
                    </div>

                    <div className="price">

                        <span className="offer-price">
                            ₹{product.discountPrice}
                        </span>

                        <span className="original-price">
                            ₹{product.price}
                        </span>

                        <span className="discount">
                            {discount}% OFF
                        </span>

                    </div>

                    <p className="description">
                        {product.description}
                    </p>

                    <div className="stock">
                        Stock : {product.stock}
                    </div>

                    <div className="qty-selector">

                        <button
                            onClick={() =>
                                setQuantity(q =>
                                    Math.max(1, q - 1)
                                )
                            }
                        >
                            -
                        </button>

                        <span>{quantity}</span>

                        <button
                            onClick={() =>
                                setQuantity(q => q + 1)
                            }
                        >
                            +
                        </button>

                    </div>

                    <button
                        className="cart-btn"
                        onClick={handleAddToCart}
                    >
                        Add To Cart
                    </button>

                </div>

            </div>

            <div className="specifications">

                <h2>Specifications</h2>

                <table>

                    <tbody>

                        <tr>
                            <td>Brand</td>
                            <td>{product.brand?.name}</td>
                        </tr>

                        <tr>
                            <td>Category</td>
                            <td>{product.category?.name}</td>
                        </tr>

                        <tr>
                            <td>Pet</td>
                            <td>{product.pet}</td>
                        </tr>

                        <tr>
                            <td>SKU</td>
                            <td>{product.sku}</td>
                        </tr>

                        {product.specifications?.map(spec => (
                            <tr key={spec.name}>
                                <td>{spec.name}</td>
                                <td>{spec.value}</td>
                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

            <div className="related-products">

                <h2>Related Products</h2>

                <div className="product-grid">

                    {relatedProducts.map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                        />
                    ))}

                </div>

            </div>

        </div>
    );
}

export default ProductDetails;