
import React, { useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import AuthContext from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Create an axios instance with base URL
const api = axios.create({
  baseURL: "https://notice-server.onrender.com/api",
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for existing login on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      // Set the token in axios default headers
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      
      // Get user data from token (for quick loading)
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "null");
        if (userData) {
          setCurrentUser(userData);
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        localStorage.removeItem("userData");
        localStorage.removeItem("authToken");
      }
    }
    setIsLoading(false);
  }, []);

  // Real login logic with API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(user));
      
      // Set token for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      setCurrentUser(user);
      
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${user.name}!`,
      });
    } catch (err) {
      const errorMessage = 
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to log in. Please check your credentials.";
          
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Real signup logic with API
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role
      });
      
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(user));
      
      // Set token for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      setCurrentUser(user);
      
      toast({
        title: "Account created",
        description: "You have successfully created an account",
      });
    } catch (err) {
      const errorMessage = 
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to create account.";
          
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin-only function to add new users
  const addUser = async (name: string, email: string, password: string, role: UserRole) => {
    setError(null);
    
    try {
      // Check if the current user is an admin
      if (!currentUser || currentUser.role !== "ADMIN") {
        throw new Error("Only admins can add new users");
      }
      
      const response = await api.post("/users", {
        name,
        email,
        password,
        role
      });
      
      toast({
        title: "User added",
        description: `${name} has been added as a ${role}`,
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = 
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to add user.";
          
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Failed to add user",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    // Remove token from axios headers
    delete api.defaults.headers.common["Authorization"];
    
    // Clear local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    
    // Clear user state
    setCurrentUser(null);
    
    toast({
      title: "Logged out",
      description: "You have been logged out",
    });
  };

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    signup,
    logout,
    addUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the api instance to be used elsewhere
export { api };
