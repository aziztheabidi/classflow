import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthUser } from "../types/auth";

type AuthStore = {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  setAuth: (payload: { token: string; user: AuthUser }) => void;
  clearAuth: () => void;
  setHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setAuth: ({ token, user }) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      setHydrated: (value) => set({ hydrated: value })
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
