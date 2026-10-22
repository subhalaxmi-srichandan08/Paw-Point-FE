import "./ShopByPet.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import categoryService from "../../services/categoryService";

import dogImage from "../../assets/categories/dog-shopping.jpeg";
import catImage from "../../assets/categories/cat-shopping-3.jpg";

function ShopByPet() {
    const navigate = useNavigate();

    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getCategories();

                const categories = res.data.data || [];

                const uniquePets = [...new Set(categories.map(c => c.pet))];

                const petData = uniquePets.map(pet => ({
                    title: pet,
                    query: pet,
                    image: pet === "Dog" ? dogImage : catImage,
                    description:
                        pet === "Dog"
                            ? "Food, toys, grooming, beds and accessories."
                            : "Food, litter, toys, beds and accessories.",
                }));

                setPets(petData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleClick = (pet) => {
        navigate(`/products?pet=${pet}`);
    };

    if (loading) {
        return (
            <section className="shop-by-pet container">
                Loading...
            </section>
        );
    }

    return (
        <section className="shop-by-pet container">

            <div className="section-header">

                <h2>Shop By Pet</h2>

                <p>
                    Find everything your furry friend needs.
                </p>

            </div>

            <div className="pet-grid">

                {pets.map(pet => (

                    <div
                        key={pet.query}
                        className="pet-card"
                        onClick={() => handleClick(pet.query)}
                    >

                        <img
                            src={pet.image}
                            alt={pet.title}
                            style={{
                                borderRadius: "20px",
                                width: "100%",
                                height: "220px",
                                objectFit: "cover"
                            }}
                        />
                        <h3>{pet.title}</h3>

                        <p>{pet.description}</p>

                        <button>
                            Shop Now
                        </button>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default ShopByPet;