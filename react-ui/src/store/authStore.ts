import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RoleDetails {
  department: string;
  role: string;
  studentId: number | null;
  workerId: number;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roleDetails: RoleDetails;
}

interface AuthState {
  user: User | null;
  setUser: (userData: User) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userData: User) =>
        set((state) => {
          if (state.user) return { user: state.user };
          return { user: userData };
        }),
      clearUser: () => set(() => ({ user: null })),
    }),

    { name: "auth-storage" }
  )
);

export default useAuthStore;
