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

 
    if (now >= expiresAt) {
      dispatch(logout());
  
      return;
    }


    const timeLeft = expiresAt - now;


    const timer = setTimeout(() => {
      dispatch(logout());
    
    }, timeLeft);


    return () => clearTimeout(timer);

  }, [token, expiresAt]);
}



