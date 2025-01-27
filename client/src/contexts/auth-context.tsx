import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { CookiesHelper } from "@/utils/cookies-helper";
import { getPayloadFromToken } from "@/utils/get-payload-from-token";

interface User {
  id: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = CookiesHelper.getCookie("authToken");

    if (token) {
      try {
        const user = getPayloadFromToken(token)
        setUser({
          id: user.sub,
          role: user.role
        })

      } catch(err) {
        console.log(err)
        CookiesHelper.deleteCookie("authToken")
      }
    }
  }, []);

  function login(token: string) {
    const { sub, role } = getPayloadFromToken(token)

    setUser({
      role,
      id: sub,
    });

    CookiesHelper.setCookie("authToken", token, 7)
  };

  function logout() {
    setUser(null);
    CookiesHelper.deleteCookie("authToken");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
