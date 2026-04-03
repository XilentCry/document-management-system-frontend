import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "./selector";
import { persist } from "zustand/middleware";

export interface User {
  userId: string | null;
  email: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  userRole: string | null;
  lastLogin: string | null;
  lastFailedLogin: string | null;
}

export interface UserStore {
  user: User;
  setUser: (user: Partial<User>) => void;
  reset: () => void;
}

const initialUser: User = {
  userId: null,
  email: null,
  firstName: null,
  middleName: null,
  lastName: null,
  userRole: null,
  lastLogin: null,
  lastFailedLogin: null,
};

const userStore = create<UserStore>()(
  persist(
    immer((set) => ({
      user: { ...initialUser },

      setUser: (user) =>
        set((state) => {
          Object.assign(state.user, user);
        }),

      reset: () =>
        set((state) => {
          state.user = { ...initialUser };
        }),
    })),
    {
      name: "user-storage",
    },
  ),
);

export const useUserStore = createSelectors(userStore);
