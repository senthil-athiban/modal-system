# React Modal System

A flexible modal management system for React applications.

## Installation

```bash
npm install react-modal-system
# or
yarn add react-modal-system
```

## Basic Usage

```tsx
import { 
  ModalProvider, 
  useModalManager, 
  useRegisterModal
} from 'react-modal-system';

function ExampleModal({ close, title, content }) {
  const { showModal } = useModalManager();

  const handleOpenNestedModal = () => {
    showModal('nested-modal', {
      title: 'Nested Modal',
      content: 'This is a nested modal opened from ExampleModal.',
    });
  };

  return (
    <Modal onOpenChange={close}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <ModalContent>
        {content}
        <button onClick={handleOpenNestedModal}>
          Open Nested Modal
        </button>
      </ModalContent>
      <ModalFooter>
        <button onClick={close}>Close</button>
      </ModalFooter>
    </Modal>
  );
}

function App() {
  const registerModal = useRegisterModal();
  const { showModal } = useModalManager();

  useEffect(() => {
    registerModal({ name: 'example-modal', component: ExampleModal });
  }, []);

  const handleOpenModal = () => {
    showModal('example-modal', {
      title: 'Example Modal',
      content: 'This is an example modal content',
    });
  };

  return (
    <ModalProvider>
      <button onClick={handleOpenModal}>
        Open Modal
      </button>
    </ModalProvider>
  );
}
```

## Advanced Examples

### Example Modal

```tsx
function ExampleModal({ close, title, content }) {
  const { showModal } = useModalManager();

  const handleOpenNestedModal = () => {
    showModal('nested-modal', {
      title: 'Nested Modal',
      content: 'This is a nested modal opened from ExampleModal.',
    });
  };

  return (
    <Modal onOpenChange={close}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <ModalContent>
        {content}
        <button onClick={handleOpenNestedModal}>
          Open Nested Modal
        </button>
      </ModalContent>
      <ModalFooter>
        <button onClick={close}>Close</button>
      </ModalFooter>
    </Modal>
  );
}
```

### Nested Modals

```tsx
function NestedModal({ close, title, content }) {
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
        <button onClick={handleOpenFormModal}>
          Open Form Modal
        </button>
      </ModalContent>
      <ModalFooter>
        <button onClick={close}>Close</button>
      </ModalFooter>
    </Modal>
  );
}
```

### Large Modal with Custom Styling

```tsx
function LargeModal({ close, title, content }) {
  return (
    <Modal 
      open 
      onOpenChange={close} 
      style={{ width: '800px', maxHeight: '90vh' }}
    >
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <ModalContent style={{ overflowY: 'auto', maxHeight: '60vh' }}>
        {content}
      </ModalContent>
      <ModalFooter>
        <button onClick={close}>Close</button>
      </ModalFooter>
    </Modal>
  );
}
```

### Form Modal with Multiple Actions

```tsx
function FormModal({ close, title }) {
  const { closeAll, getActiveModals } = useModal();
  
  return (
    <Modal open onOpenChange={close}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <ModalContent>
        <form>
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" />
          </div>
          <button onClick={closeAll}>Close All Modals</button>
        </form>
      </ModalContent>
      <ModalFooter>
        <button type="submit">Submit</button>
        <button onClick={close}>Close</button>
      </ModalFooter>
    </Modal>
  );
}
```

```tsx
export function App() {
  const registerModal = useRegisterModal();
  const { showModal } = useModalManager();

  useEffect(() => {
    registerModal({ name: 'example-modal', component: ExampleModal });
    registerModal({ name: 'nested-modal', component: NestedModal });
    registerModal({ name: 'large-modal', component: LargeModal });
    registerModal({ name: 'form-modal', component: FormModal });
  }, []);

  const handleOpenModal = () => {
    showModal('example-modal', {
      title: 'Example Modal',
      content: 'This is an example modal content',
    }, "ALERT");
  };

  return (
    <div>
      <button onClick={handleOpenModal} className="btn btn-primary">
        Open Modal
      </button>
    </div>
  );
}
```

## Best practices

💡 Best Practices
✅ Use registerModal() during initial app load
To ensure all your modals are known and safely accessible via showModal, register them once when your app initializes:
```tsx
useEffect(() => {
  registerModal({
    name: 'example-modal',
    component: lazy(() => import('./modals/ExampleModal')),
  });
}, []);

```

This enables:

- 📦 Lazy loading (modal code is only fetched when needed)
- 🧠 Centralized modal registration (better maintainability)
- 🧪 Type safety and auto-complete (if typed keys are used)
- 🚫 Avoids runtime errors (no "modal not found" surprises)

## Features

- 🚀 Easy modal registration and management
- 📦 Nested modals support
- 🎨 Customizable styling
- 🔄 Modal stacking
- 🎯 TypeScript support
- ⌨️ Keyboard navigation (Esc to close)
- 🔍 Modal state tracking
- 📱 Responsive design

## API Reference

### Modal Actions
The system supports different modal actions:
- CREATE
- READ
- UPDATE
- DELETE
- CONFIRM
- ALERT
- FORM

```tsx
showModal('modal-name', props, 'ALERT');
```

For complete API documentation and more examples, visit our [GitHub repository](https://github.com/senthil-athiban/modal-system).