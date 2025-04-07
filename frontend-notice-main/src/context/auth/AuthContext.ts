
import { createContext } from "react";
import { AuthContextType } from "@/types/auth";

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: false,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  addUser: async () => {}
});

export default AuthContext;
