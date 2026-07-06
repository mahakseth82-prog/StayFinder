import { createContext, useContext } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const AuthContext = createContext(null);

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorageState("StayFinder:users", []);
  const [currentUser, setCurrentUser] = useLocalStorageState("StayFinder:currentUser", null);

  function signup({ name, email, password }) {
    const normalized = normalizeEmail(email);
    if (users.some((u) => u.email === normalized)) {
      throw new Error("An account with that email already exists.");
    }
    const user = { name: name.trim(), email: normalized, password };
    setUsers((current) => [...current, user]);
    setCurrentUser({ name: user.name, email: user.email });
  }

  function login({ email, password }) {
    const normalized = normalizeEmail(email);
    const match = users.find((u) => u.email === normalized && u.password === password);
    if (!match) {
      throw new Error("Email or password is incorrect.");
    }
    setCurrentUser({ name: match.name, email: match.email });
  }

  function loginAsGuest() {
    setCurrentUser({ name: "Guest", email: "guest", isGuest: true });
  }

  function logout() {
    setCurrentUser(null);
  }

  const value = { currentUser, signup, login, loginAsGuest, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
