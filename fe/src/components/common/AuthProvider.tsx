import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken } from "@/store/authSlice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch("/your-endpoint");
        const newAccessToken = response.headers.get("x-new-access-token");

        if (newAccessToken) {
          dispatch(setAccessToken(newAccessToken));
        }
      } catch (error) {
        console.error("Failed to fetch access token:", error);
      }
    };

    fetchAccessToken();
  }, [dispatch]);

  return <>{children}</>;
}
