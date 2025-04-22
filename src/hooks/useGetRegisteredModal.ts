import { ModalError } from "../error-handler";
import { modalRegistryStore } from "../store/modal.store";

const useGetRegisteredModal = () => {
    const modalRegistry = modalRegistryStore((state) => state);

    return (modalName: string) => {
        const modal = modalRegistry.modals[modalName];
        if(!modal) {
            throw new ModalError(`Modal "${modalName}" not found in registry`);
        }

        return modal;
    };
}

export default useGetRegisteredModal;