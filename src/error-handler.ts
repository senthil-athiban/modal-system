import { ModalRegistration } from ".";

export class ModalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ModalError';
    }
}

export function validatModalRegistration (registration: ModalRegistration) {
    if (!registration.name) {
        throw new ModalError('Modal name is required');
    }
    if (!registration.component) {
        throw new ModalError('Modal component is required');
    }
    if (typeof registration.component !== 'function') {
        throw new ModalError('Modal component must be a function');
    }
}