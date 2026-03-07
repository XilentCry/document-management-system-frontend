import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";
import { persist } from "zustand/middleware";

export interface UserStore {
  userId: number | null;
  userRole: string | null;
  lastLogin: string | null;
  lastFailedLogin: string | null;
  setUserId: (userId: number | null) => void;
  setUserRole: (userRole: string | null) => void;
  setLastLogin: (lastLogin: string | null) => void;
  setLastFailedLogin: (lastLogin: string | null) => void;
}

const userStore = create<UserStore>()(
  persist(
    immer((set) => ({
      userId: null,
      userRole: null,
      lastLogin: null,
      lastFailedLogin: null,
      setUserId: (userId: number | null) => set({ userId }),
      setUserRole: (userRole: string | null) => set({ userRole }),
      setLastLogin: (lastLogin: string | null) => set({ lastLogin }),
      setLastFailedLogin: (lastFailedLogin: string | null) =>
        set({ lastFailedLogin }),
    })),
    {
      name: "user-storage",
    },
  ),
);

export const useUserStore = createSelectors(userStore);
