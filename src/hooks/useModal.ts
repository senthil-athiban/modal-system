import { useCallback } from "react";
import { modalStateStore } from "../store/modal.store";

const useModal = () => {
    const modalState = modalStateStore((state) => state);
    
    const closeAll = useCallback(() => {
        modalState.modalStack.forEach(instance => {
            instance.onClose();
        });
    }, [modalState.modalStack]);
    
    const closeAllExcept = useCallback((modalName: string) => {
        modalState.modalStack.forEach(instance => {
            if (instance.modalName !== modalName) {
                instance.onClose();
            }
        });
    }, [modalState.modalStack]);

    const isModalOpen = useCallback((modalName: string): boolean => {
        return modalState.modalStack.some(m => m.modalName === modalName);
    }, [modalState.modalStack]);

    const getActiveModals = useCallback((): string[] => {
        return modalState.modalStack.map(m => m.modalName);
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