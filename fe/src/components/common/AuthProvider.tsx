// components/hoc/WithAuth.tsx
import { useEffect, ComponentType } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, clearAuth } from "@/store/authSlice";
import { clearUserInfo } from "@/store/userInfoSlice";
import { RootState } from "@/store/store";

export function WithAuth<T extends object>(WrappedComponent: ComponentType<T>) {
  return function WithAuthComponent(props: T) {
    const router = useRouter();
    const dispatch = useDispatch();
    const accessToken = useSelector(
      (state: RootState) => state.auth.accessToken
    );

    useEffect(() => {
      const verifyAuth = async () => {
        if (!accessToken) {
          try {
            const response = await fetch("/api/auth/refresh", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const data = await response.json();
              dispatch(setAccessToken(data.access_token));
            } else {
              dispatch(clearAuth());
              router.push("/login");
            }
          } catch (error) {
            console.error("Auth verification failed:", error);
            clearAuth();
            clearUserInfo();
          }
        }
      };

      verifyAuth();
    }, [accessToken, dispatch, router]);

    return <WrappedComponent {...props} />;
  };
}
