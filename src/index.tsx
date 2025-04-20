import { create } from "zustand";

type ModalInstanceState = "NEW" | "CLOSED" | "MOUNTED";

interface ModalRegistration {
    name: string;
    component: React.ComponentType<any>;
}

interface ModalRegistry {
    modals: Record<string, ModalRegistration>;
}

interface ModalInstance {
    modalName: string;
    onClose: () => void;
    container?: HTMLElement;
    props: Record<string, any>;
    component: React.ComponentType<any>;
    state: ModalInstanceState;
}

interface ModalState {
    modalContainer: HTMLElement | null;
    modalStack: Array<ModalInstance>;
}

const modalStateStore = create<ModalState>(() => ({
    modalContainer: null,
    modalStack: [],
}));

const modalRegistryStore = create<ModalRegistry>(() => ({
    modals: {},
}));

const getModalState = () => modalStateStore.getState();
const getModalRegistry = () => modalRegistryStore.getState();

const useModal = () => {
    const modalState = getModalState();
    
    const modalRegistry = getModalRegistry();

    const closeTopModal = () => {
        const topModal = modalState.modalStack[modalState.modalStack.length - 1];
        if(topModal) {
            closeInstance(topModal);
        }
    }

    const closeInstance = (instance: ModalInstance) => {
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
            console.error(`Modal ${name} not found in registry`);
            return;
        }

        const closeInstance = () => {
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
                close: closeInstance,
            },
            component: modal.component,
        })
    }


    return {
        closeTopModal,
        closeInstance,
        openInstance,
        showModal,
        setupModals
    }
}

export { modalStateStore, modalRegistryStore, useModal };