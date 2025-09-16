import { useStackApp } from "@stackframe/react";
import { Navigate } from "react-router-dom";

const popFromLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const value = localStorage.getItem(key);
    localStorage.removeItem(key);
    return value;
  }

  return null;
};


export const LoginRedirect = () => {
  const app = useStackApp()

  const queryParams = new URLSearchParams(window.location.search);

  const next = queryParams.get('next') || popFromLocalStorage('dtbn-login-next')

  if (next) {
    return <Navigate to={next} replace={true} />
  }

  return <Navigate to="/" replace={true} />
};