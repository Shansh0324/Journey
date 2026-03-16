import { createContext, useContext, useState, useEffect } from "react";
import { login, register, getMe } from "./services/auth.api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* LOGIN */
  const handleLogin = async (email, password) => {
    setLoading(true);

    try {
      const res = await login(email, password);
      setUser(res.user);
      return res;
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* REGISTER */
  const handleRegister = async (username, email, password) => {
    setLoading(true);

    try {
      const res = await register(username, email, password);
      setUser(res.user);
      return res;
    } catch (err) {
      console.error("Register failed", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* AUTO LOGIN (check cookie session) */
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getMe();
        setUser(res.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, handleLogin, handleRegister }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* CUSTOM HOOK */
export function useAuth() {
  return useContext(AuthContext);
}