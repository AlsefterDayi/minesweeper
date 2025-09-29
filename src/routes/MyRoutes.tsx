import { Route, Routes, Navigate } from "react-router-dom";
import pagesList from "../constants/pagesList";
import ProtectedRoute from "./ProtectedRoutes";
import { useAuth } from "../auth/AuthContext";

function MyRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {pagesList
        .filter((item) => item.is_visible)
        .map((item) => (
          <Route
            key={item.id}
            path={item.path}
            element={
              item.is_protected ? (
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  {item.element}
                </ProtectedRoute>
              ) : (
                item.element
              )
            }
          />
        ))}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default MyRoutes;
