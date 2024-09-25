import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageLoader from "../layout/Loaders/PageLoader";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useSelector((state) => state.user);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login", {
                state: { toastMessage: "Login required" },
            });
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return <PageLoader />;
    }

    return children;
};

export default ProtectedRoute;
