import { useCallback } from "react";
import { modalStateStore } from "../store/modal.store";
import { ModalInstance } from "types/modal";

const useModal = () => {
    const modalState = modalStateStore((state) => state);
    
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

    return {
        closeAll,
        closeAllExcept,
        isModalOpen,
        getActiveModals,
        modalStack: modalState.modalStack
    } as const;
}

export default useModal;