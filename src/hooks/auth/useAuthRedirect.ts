import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/auth/authSlice";
import { type RootState } from "@/redux/store";

export function useAuthRedirect() {
  const dispatch = useDispatch();
  const { token, expiresAt } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token || !expiresAt) return;

    const now = Date.now();

    // if already expired — logout immediately
    if (now >= expiresAt) {
      dispatch(logout());
  
      return;
    }

    // how long until expiration?
    const timeLeft = expiresAt - now;

    // schedule auto logout
    const timer = setTimeout(() => {
      dispatch(logout());
    
    }, timeLeft);

    // cleanup when component re-renders
    return () => clearTimeout(timer);

  }, [token, expiresAt]);
}



