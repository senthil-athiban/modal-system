import { ModalError, validatModalRegistration } from "../error-handler";
import { modalRegistryStore } from "../store/modal.store";
import { ModalRegistration } from "../types/modal";

const useRegisterModal = () => {
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
            if(error instanceof ModalError) {
                console.error(error.message);
            }
            throw error;
        }
        
    }
}

export default useRegisterModal;
