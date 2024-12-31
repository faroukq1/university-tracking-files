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

type FileType = {
  id: number;
  name: string;
  description?: string | null;
  studentId: number;
  personId: number;
  adminPictureUrl?: string | null;
  financePictureUrl?: string | null;
  adminStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  financeStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
};

interface FileState {
  files: FileType[];
  addFiles: (files: FileType[]) => void;
  updateFile: (id: number, updatedFile: Partial<FileType>) => void;
  removeFile: (id: number) => void;
}

const useFileStore = create<FileState>()(
  persist(
    (set) => ({
      files: [],
      addFiles: (files) =>
        set((state) => ({
          files: files,
        })),
      updateFile: (id, updatedFile) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === id ? { ...file, ...updatedFile } : file
          ),
        })),
      removeFile: (id) =>
        set((state) => ({
          files: state.files.filter((file) => file.id !== id),
        })),
    }),
    { name: "file-storage" }
  )
);

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

interface FileIdState {
  fileId: number;
  setFileId: (id: number) => void;
}

const useFileIdStore = create<FileIdState>((set) => ({
  fileId: 0, // initial state
  setFileId: (id) => set({ fileId: id }), // function to set file ID
}));
export { useAuthStore, useFileStore, useFileIdStore };
