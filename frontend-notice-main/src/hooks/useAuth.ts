
import { useContext } from "react";
import AuthContext from "@/context/auth/AuthContext";
import { api } from "@/context/auth/AuthProvider";

export const useAuth = () => useContext(AuthContext);
export { api };
