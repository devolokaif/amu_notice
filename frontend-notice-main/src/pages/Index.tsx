
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Dashboard from "./Dashboard";

const Index = () => {
  const { currentUser, isLoading } = useAuth();
  
  // If loading, show nothing (we'll handle this with a loading state later)
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // If not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // If logged in, show the dashboard
  return <Dashboard />;
};

export default Index;
