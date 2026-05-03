import { useEffect } from "react";
import { onAuthChange } from "@jorh/firebase/auth";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import type { User } from "@jorh/types";

export function useAuthInit() {
  const { setFirebaseUser, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Pass displayName so verify can use it on first-time registration
          // before Firebase propagates the profile update to the Admin SDK.
          const res = await api.post<User>("/auth/verify", {
            displayName: firebaseUser.displayName ?? undefined,
          });
          if (res.data && !res.error) {
            setUser(res.data);
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [setFirebaseUser, setUser, setLoading]);
}
