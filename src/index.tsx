import { useCallback } from "react";
import { create } from "zustand";
import { ModalError, validatModalRegistration } from "./error-handler";

type ModalInstanceState = "NEW" | "CLOSED" | "MOUNTED";
type ModalSize = 'xs' | 'sm' | 'md' | 'lg';

interface ModalProps {
    size?: ModalSize;
    close?: () => void;
    [key: string]: unknown;
  }

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
    props: ModalProps;
    component: React.ComponentType<any>;
    state: ModalInstanceState;
}

interface ModalState {
    modalContainer: HTMLElement | null;
    modalStack: Array<ModalInstance>;
}

interface ModalProviderProps {
    children: React.ReactNode;
    /**
     * Optional z-index starting point for modals
     * @default 1000
     */
    baseZIndex?: number;
    className?: string;
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

function useRegisterModal() {
    const setModalRegistry = modalRegistryStore.setState;
    
    return (modalRegistration: ModalRegistration) => {
        try {
            validatModalRegistration(modalRegistration);
            setModalRegistry((state) => ({
                modals: {
                    ...state.modals,
                    [modalRegistration.name]: modalRegistration
                }
            }))
        } catch (error) {
            console.log('error:', error);
            if(error instanceof ModalError) {
                console.error(error.message);
            }
            throw error;
        }
        
    }
}

function useGetRegisteredModal() {
    const modalRegistry = modalRegistryStore((state) => state);

    return (modalName: string) => {
        const modal = modalRegistry.modals[modalName];
        if(!modal) {
            throw new ModalError(`Modal "${modalName}" not found in registry`);
        }

        return modal;
    };
}

function useModal() {
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

export { modalStateStore, modalRegistryStore, useModal, useModalManager, getModalRegistry, getModalState, useRegisterModal, useGetRegisteredModal };
export type {
    ModalInstanceState,
    ModalSize,
    ModalProps,
    ModalRegistration,
    ModalRegistry,
    ModalInstance,
    ModalState,
    ModalProviderProps
};