import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    //we search for a token in localstorage
    const token  = localStorage.getItem("token");

    return token ? <Outlet /> : <Navigate to="/login" />;
    
}

export default ProtectedRoute;