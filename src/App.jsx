import { useEffect } from "react";

import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import AppRoutes from "./routes/AppRoutes";

import useAuthStore from "./store/authStore";

function App() {
    const loading = useAuthStore(
        state => state.loading
    );

    useEffect(() => {
        useAuthStore
            .getState()
            .initializeAuth();
    }, []);

    // Don't render the application until
    // authentication has been checked.
    if (loading) {
        return (
            <div className="app-loading">
                Loading...
            </div>
        );
    }

    return (
        <div className="app">
            <Navbar />

            <main className="app-main">
                <AppRoutes />
            </main>

            <Footer />
        </div>
    );
}

export default App;