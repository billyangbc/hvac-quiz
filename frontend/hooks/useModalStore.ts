import { create } from "zustand";

export type modalType = "showResults" | "quitQuiz" | "deleteConfirmation" | "editQuestion";

interface AdditionalData {
  results?: {
    score?: number;
    limit?: number;
  },
  delete?: {
    documentId: string;
    target: "category" | "question";
  },
  question?: {
    documentId: string;
  }
}

interface modalStore {
  type: modalType | null;
  isOpen: boolean;
  additionalData: AdditionalData;
  onOpen: (type: modalType, data?: AdditionalData) => void;
  onClose: () => void;
}

const useModalStore = create<modalStore>((set) => ({
  type: null,
  isOpen: false,
  additionalData: {},
  onOpen: (type, data) => {
    set({ isOpen: true, type, additionalData: { ...data } });
  },
  onClose: () => set({ type: null, isOpen: false, additionalData: {} }),
}));

export default useModalStore;
