import { useCallback } from "react";
import { ModalError } from "../error-handler";
import { modalRegistryStore, modalStateStore } from "../store/modal.store";
import type { ModalAction, ModalInstance } from "../types/modal";

const useModal = () => {
    const modalState = modalStateStore((state) => state);
    const modalRegistry = modalRegistryStore((state) => state);

    const closeInstance = useCallback((instance: ModalInstance) => {
        if (!instance) {
            throw new ModalError('Cannot close undefined modal instance');
        }
        modalStateStore.setState((state) => ({
            ...state,
            modalStack: state.modalStack.map((i) => i === instance ? { ...i, state: 'CLOSED' } : i),
        }))
    },[modalStateStore]);

    const closeTopModal = useCallback(() => {
        const topModal = modalState.modalStack[modalState.modalStack.length - 1];
        if (topModal) {
            closeInstance(topModal);
        }
    },[modalState, closeInstance]);

    const handleEscapeKey = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            closeTopModal();
        }
    },[closeTopModal]);

    const openInstance = useCallback((instance: ModalInstance) => {
        modalStateStore.setState((state) => ({
            ...state,
            modalStack: [...state.modalStack, instance],
        }))
    },[modalStateStore]);

    const setupModals = useCallback((modalContainer: HTMLElement | null) => {
        modalStateStore.setState((state) => ({
            ...state,
            modalContainer
        }))
    },[modalStateStore]);

    const closeAll = useCallback(() => {
        modalState.modalStack.forEach(instance => {
            instance.onClose();
        });
    }, [modalState.modalStack]);

    const closeAllExcept = useCallback((modalName: string) => {
        modalState.modalStack.forEach(instance => {
            if (instance.name !== modalName) {
                instance.onClose();
            }
        });
    }, [modalState.modalStack]);

    const isModalOpen = useCallback((modalName: string): boolean => {
        return modalState.modalStack.some(m => m.name === modalName);
    }, [modalState.modalStack]);

    const getActiveModals = useCallback((): ModalInstance[] => {
        return modalState.modalStack;
    }, [modalState.modalStack]);

    const showModal = useCallback((name: string, props: Record<string, any> = {}, action?: ModalAction, onClose: () => void = () => { }) => {
        const modal = modalRegistry.modals[name];
        if (!modal) {
            throw new ModalError(`Modal "${name}" not found in registry`);
        }

        const close = () => {
            const modal = modalState.modalStack.find((i) => i.name === name);
            if (modal) {
                modalStateStore.setState((state) => ({
                    ...state,
                    modalStack: state.modalStack.map((i) => i === modal ? { ...i, state: 'CLOSED' } : i),
                }))
            }
        }


        openInstance({
            state: 'NEW',
            name: name,
            onClose,
            props: {
                ...props,
                close: close,
            },
            component: modal.component,
            ...(action !== undefined ? { action } : {}),
        });

        return close;
    },[modalRegistry, modalStateStore, openInstance]);


    return {
        closeTopModal,
        closeInstance,
        openInstance,
        showModal,
        setupModals,
        handleEscapeKey,
        isModalOpen,
        closeAll,
        closeAllExcept,
        getActiveModals
    }
}

export default useModal;