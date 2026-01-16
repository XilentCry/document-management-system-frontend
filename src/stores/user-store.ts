import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";
import { persist } from "zustand/middleware";

export interface UserStore {
  userId: number | null;
  setUserId: (id: number | null) => void;
}

const userStore = create<UserStore>()(
  persist(
    immer((set) => ({
      userId: null,
      setUserId: (id: number | null) => set({ userId: id }),
    })),
    {
      name: "user-storage",
    }
  )
);

export const useUserStore = createSelectors(userStore);
