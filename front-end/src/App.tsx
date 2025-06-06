// frontend/src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage"; // Sera /profile/me
import PodsPage from "./pages/PodsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./contexts/AuthContext";
import "./index.css";

// Composant pour les routes protégées
const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // Afficher un indicateur de chargement pendant que l'état d'authentification est vérifié
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Chargement...</p>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Composant pour les routes publiques uniquement (ex: login, register ne doivent pas être accessibles si déjà connecté)
const PublicRouteOnly: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><p>Chargement...</p></div>;
    }
    return !isAuthenticated ? <Outlet /> : <Navigate to="/profile/me" replace />;
};

const App: React.FC = () => {
    return (
        <Routes>
            {/* Routes publiques uniquement */}
            <Route element={<PublicRouteOnly />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Routes protégées nécessitant une authentification */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    {/* Mettre à jour le chemin pour le profil utilisateur */}
                    <Route path="profile/me" element={<ProfilePage />} /> 
                    <Route path="pods" element={<PodsPage />} />
                    {/* Ajoutez d'autres routes protégées ici si nécessaire */}
                </Route>
            </Route>

            {/* Redirection par défaut si aucune route ne correspond (optionnel) */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
    );
};

export default App;

