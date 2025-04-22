import { ExampleComponent } from "./example.modal";
import ModalProvider from "./modal.container";

function App() {
  return (
    <ModalProvider>
      <ExampleComponent />
    </ModalProvider>
  )
}

export default App
