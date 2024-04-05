import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

interface UtteranceSet {
  id: string;
  text: string;
}

interface UtteranceSetStore {
  utteranceSets: UtteranceSet[];
  addUtterance: (text: string, id?: string) => void;
  updateUtterance: (newText: string, id: string) => void;
  deleteUtterance: (id: string) => void;
  resetUtteranceSet: (utteranceArray: string[]) => void;
}

const useUtteranceSetStore = create<UtteranceSetStore>((set) => ({
  utteranceSets: [],

  // Create (Add) utterance
  addUtterance: (text: string, id?: string) => {
    set((state) => {
      const newUtteranceSet = { id: uuidv4(), text };

      // Add at last index
      if (id === undefined) {
        return {
          utteranceSets: [...state.utteranceSets, newUtteranceSet],
        };
      }

      // Add after an index
      const index = state.utteranceSets.findIndex((u) => u.id === id);

      if (index === -1) {
        return {
          utteranceSets: [...state.utteranceSets, newUtteranceSet],
        };
      }

      return {
        utteranceSets: [
          ...state.utteranceSets.slice(0, index + 1),
          newUtteranceSet,
          ...state.utteranceSets.slice(index + 1),
        ],
      };
    });
  },

  // Update utterance
  updateUtterance: (newText: string, id: string) => {
    set((state) => ({
      utteranceSets: state.utteranceSets.map((utterance) =>
        utterance.id === id ? { ...utterance, text: newText } : utterance
      ),
    }));
  },

  // Delete utterance
  deleteUtterance: (id: string) => {
    set((state) => ({
      utteranceSets: state.utteranceSets.filter(
        (utterance) => utterance.id !== id
      ),
    }));
  },

  resetUtteranceSet: (utteranceArray: string[]) => {
    set((state) => ({
      utteranceSets: utteranceArray.map((utt) => {
        return { id: uuidv4(), text: utt };
      }),
    }));
  },
}));

export default useUtteranceSetStore;
