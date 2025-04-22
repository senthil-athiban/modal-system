import React, { useEffect } from 'react'
import { useModalManager } from '.'

const ModalRoot = () => {

    const {setupModals} = useModalManager();
    const modalRootRef = React.useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if(modalRootRef.current) {
            setupModals(modalRootRef.current);
        }
    },[modalRootRef.current]);

  return (
    <div id="modal-system-root" ref={modalRootRef} />
  )
}

export default ModalRoot