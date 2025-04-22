import { ModalError } from "../error-handler";
import { modalRegistryStore, modalStateStore } from "../store/modal.store";
import type { ModalInstance } from "../types/modal";

const useModalManager = () => {
    const modalState = modalStateStore((state) => state);
    const modalRegistry = modalRegistryStore((state) => state);


    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            closeTopModal();
        }
    }

    const closeTopModal = () => {
        const topModal = modalState.modalStack[modalState.modalStack.length - 1];
        if(topModal) {
            closeInstance(topModal);
        }
    }

    const closeInstance = (instance: ModalInstance) => {
        if (!instance) {
            throw new ModalError('Cannot close undefined modal instance');
        }
        modalStateStore.setState((state) => ({
            ...state,
            modalStack: state.modalStack.map((i) => i === instance ? {...i, state: 'CLOSED'} : i),
        }))
    }

    const openInstance = (instance: ModalInstance) => {
        modalStateStore.setState((state) => ({
            ...state,
            modalStack: [...state.modalStack, instance],
        }))
    }

    const setupModals = (modalContainer: HTMLElement | null) => {
        modalStateStore.setState((state) => ({
            ...state,
            modalContainer
        }))
    }

    const showModal = (name: string, props: Record<string, any> = {}, onClose: () => void = () => {}) => {
        const modal = modalRegistry.modals[name];
        if(!modal) {
            throw new ModalError(`Modal "${name}" not found in registry`);
        }

        const close = () => {
            const modal = modalState.modalStack.find((i) => i.modalName === name);
            if(modal) {
                modalStateStore.setState((state) => ({
                    ...state,
                    modalStack: state.modalStack.map((i) => i === modal ? {...i, state: 'CLOSED'} : i),
                }))
            }
        }


        openInstance({
            state: 'NEW',
            modalName: name,
            onClose,
            props: {
                ...props,
                close: close,
            },
            component: modal.component,
        });

        return close;
    }


    return {
        closeTopModal,
        closeInstance,
        openInstance,
        showModal,
        setupModals,
        handleEscapeKey
    }
}

export default useModalManager;