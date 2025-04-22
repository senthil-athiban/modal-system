export type ModalInstanceState = "NEW" | "CLOSED" | "MOUNTED";
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ModalProps {
    size?: ModalSize;
    close?: () => void;
    [key: string]: unknown;
}

export interface ModalRegistration {
    name: string;
    component: React.ComponentType<any>;
}

export type ModalAction = "CREATE" | "READ" | "UPDATE" | "DELETE" | "CONFIRM" | "ALERT" | "FORM"

export interface ModalRegistry {
    modals: Record<string, ModalRegistration>;
}

export interface ModalInstance {
    name: string;
    onClose: () => void;
    container?: HTMLElement;
    props: ModalProps;
    component: React.ComponentType<any>;
    state: ModalInstanceState;
    action?: ModalAction;
}

export interface ModalState {
    modalContainer: HTMLElement | null;
    modalStack: Array<ModalInstance>;
}

export interface ModalProviderProps {
    children: React.ReactNode;
    /**
     * Optional z-index starting point for modals
     * @default 1000
     */
    baseZIndex?: number;
    className?: string;
}