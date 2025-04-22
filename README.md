# React Modal System

A flexible modal management system for React applications.

## Installation

```bash
npm install react-modal-system
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

## 💡 Best practices

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

## ❌ Avoid registering modals inline on each usage

```tsx
// ❌ Avoid this
const handleOpen = () => {
  registerModal({ name: 'my-modal', component: MyModal });
  showModal('my-modal');
};
```
This can lead to:

- 🔁 Unnecessary re-registrations
- ❌ Duplicate registrations with different components
- 🤯 Hard-to-debug modal behaviors

## Features

- 🚀 Easy modal registration and management
- 📦 Nested modals support
- 🎨 Customizable styling
- 🔄 Modal stacking
- 🎯 TypeScript support
- ⌨️ Keyboard navigation (Esc to close)
- 🔍 Modal state tracking
- 📱 Responsive design

## API Documentation

### useModal Hook

The `useModal` hook provides the following methods:

| Method | Description | Parameters | Return Type | Example |
|--------|-------------|------------|-------------|---------|
| `showModal` | Opens a modal with specified props and action | <ul><li>`name: string`</li><li>`props?: Record<string, any>`</li><li>`action?: ModalAction`</li><li>`onClose?: () => void`</li></ul> | `() => void` | ```showModal('user-modal', { userId: '123' }, 'CREATE') ``` |
| `closeTopModal` | Closes the most recently opened modal | None | `void` | ```closeTopModal() ``` |
| `closeInstance` | Closes a specific modal instance | `instance: ModalInstance` | `void` | ```closeInstance(modalInstance) ``` |
| `openInstance` | Opens a new modal instance | `instance: ModalInstance` | `void` | ```openInstance({ name: 'modal', component: Modal }) ``` |
| `setupModals` | Initializes the modal container | `modalContainer: HTMLElement \| null` | `void` | ```setupModals(document.getElementById('modal-root')) ``` |
| `closeAll` | Closes all open modals | None | `void` | ```const { closeAll } = useModal(); closeAll(); ``` |
| `closeAllExcept` | Closes all modals except the specified one | `modalName: string` | `void` | ```closeAllExcept('form-modal'); ``` |
| `isModalOpen` | Checks if a specific modal is open | `modalName: string` | `boolean` | ```const isOpen = isModalOpen('user-modal'); ``` |
| `getActiveModals` | Returns array of all active modal instances | None | `ModalInstance[]` | ```const activeModals = getActiveModals(); ``` |

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
