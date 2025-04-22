import { create } from "zustand";
import { ModalRegistry, ModalState } from "../types/modal";

export const modalStateStore = create<ModalState>(() => ({
    modalContainer: null,
    modalStack: [],
}));

export const modalRegistryStore = create<ModalRegistry>(() => ({
    modals: {},
}));

export const getModalState = () => modalStateStore.getState();
export const getModalRegistry = () => modalRegistryStore.getState();
