export type * from './types/modal';

export {
    modalStateStore,
    modalRegistryStore,
    getModalState,
    getModalRegistry
} from './store/modal.store';

export {
    useModal,
    useModalManager,
    useRegisterModal
} from './hooks/index';

export { default as ModalProvider } from './components/modal-provider.component';

export { ModalError } from './error-handler';