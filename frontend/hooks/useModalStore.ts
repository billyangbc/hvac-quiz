import { create } from "zustand";

export type modalType = "showResults" | "quitQuiz" | "deleteConfirmation" | "editQuestion" | "editCategory";

interface AdditionalData {
  results?: {
    score?: number;
    limit?: number;
  },
  delete?: {
    documentId: string;
    target: "category" | "question" | "enrollment";
  },
  question?: {
    documentId: string;
  },
  category?: {
    documentId: string;
    categoryName: string;
    description: string;
  }
}

interface modalStore {
  type: modalType | null;
  isOpen: boolean;
  additionalData: AdditionalData;
  onOpen: (type: modalType, data?: AdditionalData, callbackUrl?: string) => void;
  onClose: () => void;
  callbackUrl?: string;
}

const useModalStore = create<modalStore>((set) => ({
  type: null,
  isOpen: false,
  additionalData: {},
  onOpen: (type, data, callbackUrl) => {
    set({ isOpen: true, type, additionalData: { ...data }, callbackUrl: callbackUrl });
  },
  onClose: () => set({ type: null, isOpen: false, additionalData: {} }),
}));

export default useModalStore;
