"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type ImageOverlayItem = {
  id: string;
  src: string;
  /** x center relative to canvas (0..canvasWidth) */
  centerX: number;
  /** y center relative to canvas (0..canvasHeight) */
  centerY: number;
  width: number;
  height: number;
  rotate: number;
  opacity: number;
};

type ImageOverlayState = {
  items: ImageOverlayItem[];
  selectedId: string | null;
};

type ImageOverlayActions = {
  addItem: (src: string, canvasWidth: number, canvasHeight: number) => void;
  updateItem: (
    id: string,
    patch: Partial<Omit<ImageOverlayItem, "id">>,
  ) => void;
  removeItem: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  clearItems: () => void;
};

function generateId() {
  return `img-${Math.random().toString(36).slice(2, 10)}`;
}

export const useImageOverlayStore = create<
  ImageOverlayState & ImageOverlayActions
>()(
  immer((set) => ({
    items: [],
    selectedId: null,

    addItem: (src, canvasWidth, canvasHeight) => {
      set((state) => {
        const id = generateId();
        const defaultSize = Math.min(canvasWidth, canvasHeight) * 0.3;

        state.items.push({
          id,
          src,
          centerX: canvasWidth / 2,
          centerY: canvasHeight / 2,
          width: defaultSize,
          height: defaultSize,
          rotate: 0,
          opacity: 1,
        });
        state.selectedId = id;
      });
    },

    updateItem: (id, patch) => {
      set((state) => {
        const item = state.items.find((i) => i.id === id);

        if (item) {
          Object.assign(item, patch);
        }
      });
    },

    removeItem: (id) => {
      set((state) => {
        state.items = state.items.filter((i) => i.id !== id);

        if (state.selectedId === id) {
          state.selectedId = null;
        }
      });
    },

    setSelectedId: (id) => {
      set((state) => {
        state.selectedId = id;
      });
    },

    clearItems: () => {
      set((state) => {
        state.items = [];
        state.selectedId = null;
      });
    },
  })),
);
