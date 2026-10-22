import api from "../api/axios";

const getProducts = params =>
    api.get("/products", { params });

const getProductById = (id) =>
    api.get(`/products/${id}`);

const getSuggestions = q =>
    api.get("/products/suggestions", {
        params: { q }
    });

const getSearchSuggestions = async (query) => {

    const response = await api.get(
        "/products/suggestions",
        {
            params: {
                q: query
            }
        }
    );

    return response.data;
};

export default {
    getProducts,
    getProductById,
    getSuggestions,
    getSearchSuggestions
};