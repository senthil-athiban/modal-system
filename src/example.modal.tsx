import React, { useEffect } from 'react';
import { useGetRegisteredModal, useModal, useModalManager, useRegisterModal } from '.';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from './components/modal.component';

interface ModalProps {
  close: () => void;
  title: string;
  content: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '0.375rem',
  fontWeight: 500,
  cursor: 'pointer'
};

const primaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none'
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#e5e7eb',
  color: '#374151',
  border: 'none'
};

const formGroupStyle: React.CSSProperties = {
  marginBottom: '1rem'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#374151'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: '0.375rem',
  border: '1px solid #d1d5db'
};

function ExampleModal({ close, title, content }: ModalProps) {
  const { showModal } = useModalManager();

  const handleOpenNestedModal = () => {
    showModal('nested-modal', {
      title: 'Nested Modal',
      content: 'This is a nested modal opened from ExampleModal.',
    });
  };

  const handleOpenLargeModal = () => {
    showModal('large-modal', {
      title: 'Large Modal',
      content: 'This is a large modal with a lot of content.',
    });
  };

  return (
    <Modal open onOpenChange={close}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <ModalContent>
        {content}
        <div className="flex gap-4 mt-4">
          <button onClick={handleOpenNestedModal} className="btn btn-secondary" style={secondaryButtonStyle}>
            Open Nested Modal
          </button>
          <button onClick={handleOpenLargeModal} className="btn btn-secondary" style={secondaryButtonStyle}>
            Open Large Modal
          </button>
        </div>
      </ModalContent>
      <ModalFooter>
        <button onClick={close} className="btn btn-primary" style={primaryButtonStyle}>Close</button>
      </ModalFooter>
    </Modal>
  );
}

function NestedModal({ close, title, content }: ModalProps) {
  const { showModal } = useModalManager();

  const handleOpenFormModal = () => {
    showModal('form-modal', {
      title: 'Form Modal',
      content: 'This modal contains a form.',
    });
  };

  return (
    <Modal open onOpenChange={close}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <ModalContent>
        {content}
        <div className="flex gap-4 mt-4">
          <button onClick={handleOpenFormModal} className="btn btn-secondary">
            Open Form Modal
          </button>
        </div>
      </ModalContent>
      <ModalFooter>
        <button onClick={close} className="btn btn-primary">Close</button>
      </ModalFooter>
    </Modal>
  );
}

function LargeModal({ close, title, content, closeParentInstance }: ModalProps & { closeParentInstance?: any }) {
  return (
    <Modal open onOpenChange={close} style={{ width: '800px', maxHeight: '90vh' }}>
    <ModalHeader>
      <ModalTitle>{title}</ModalTitle>
    </ModalHeader>
    <ModalContent style={{ overflowY: 'auto', maxHeight: '60vh' }}>
      {content}
      <div style={{ height: '400px', backgroundColor: '#f0f0f0', marginBottom: '1rem' }}></div>
      <div style={{ height: '400px', backgroundColor: '#f0f0f0', marginBottom: '1rem' }}></div>
      <div style={{ height: '400px', backgroundColor: '#f0f0f0' }}></div>
    </ModalContent>
    <ModalFooter>
      <button onClick={() => closeParentInstance('example-modal')} style={primaryButtonStyle}>
        Close Parent
      </button>
      <button onClick={close} style={primaryButtonStyle}>Close</button>
    </ModalFooter>
  </Modal>
  );
}

function FormModal({ close, title }: ModalProps) {

  const { closeAll } = useModal()
  return (
    <Modal open onOpenChange={close}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <ModalContent>
        <form className="space-y-4">
        <button onClick={closeAll} className="btn btn-primary">
        close Modal
      </button>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </form>
      </ModalContent>
      <ModalFooter>
        <button type="submit" className="btn btn-primary">Submit</button>
        <button onClick={close} className="btn btn-secondary">Close</button>
      </ModalFooter>
    </Modal>
  );
}

export { ExampleModal, NestedModal, LargeModal, FormModal };
export default ExampleModal;

export function ExampleComponent() {
  const registerModal = useRegisterModal();
  const { showModal } = useModalManager();

  useEffect(() => {
    // Register all modals
    console.log('registering modals');
    registerModal({ name: 'example-modal', component: ExampleModal });
    registerModal({ name: 'nested-modal', component: NestedModal });
    registerModal({ name: 'large-modal', component: LargeModal });
    registerModal({ name: 'form-modal', component: FormModal });
  }, []);

  const handleOpenModal = () => {
    showModal('example-modal', {
      title: 'Example Modal',
      content: 'This is an example modal content',
    });
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
    }}>
      <button onClick={handleOpenModal} className="btn btn-primary">
        Open Modal
      </button>
      <div>

      </div>
    </div>
  );
}