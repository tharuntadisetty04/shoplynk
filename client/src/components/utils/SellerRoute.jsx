import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageLoader from "../layout/Loaders/PageLoader";

const SellerRoute = ({ children }) => {
    const navigate = useNavigate();
    const { isAuthenticated, user, loading } = useSelector((state) => state.user);

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated || user?.role !== "seller") {
                navigate("/");
            }
        }
    }, [isAuthenticated, user, loading, navigate]);

    if (loading) {
        return <PageLoader />;
    }

    return children;
};

export default SellerRoute;
