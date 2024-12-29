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
type fileType = {
  ADMINISTRATION: "PENDING";
  EDUCATION: "PENDING";
  FINANCE: "PENDING";
  comments: string | null;
  documentType: "passport" | string;
  fileDescription: string;
  fileFormat: string;
  fileName: string;
  fileSize: string;
  id: number;
  personId: number;
  studentId: number;
  submissionDate: string;
};

interface AuthState {
  user: User | null;
  setUser: (userData: User) => void;
  clearUser: () => void;
}

interface studentFileState {
  studentsFiles: fileType[];
  setStudentsFiles: (studentsFilesData: fileType[]) => void;
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

const useStudentStore = create<studentFileState>()(
  persist(
    (set) => ({
      studentsFiles: [],
      setStudentsFiles: (studentsFilesData: fileType[]) =>
        set(() => ({ studentsFiles: studentsFilesData })),
    }),
    { name: "studentsFilesStorage" }
  )
);
export { useAuthStore, useStudentStore };
