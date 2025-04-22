import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ModalInstance, ModalProviderProps } from '../types/modal';
import { useModalManager } from '../hooks';
import { modalStateStore } from '../store/modal.store';

const original = window.getComputedStyle(document.body).overflow;

const ModalProvider = ({ 
    children, 
    baseZIndex = 1000,
    className = '' 
  }: ModalProviderProps) => {
    const modalRootRef = useRef<HTMLDivElement | null>(null);
    const { setupModals, handleEscapeKey } = useModalManager();
    const { modalStack } = modalStateStore((state) => state);
    const setModals = modalStateStore.setState;

    useEffect(() => {
        if (modalRootRef.current) {
            setupModals(modalRootRef.current);
        }
    }, [modalRootRef.current]);

    useEffect(() => {
        if (modalStack.length) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';

            return () => {
                document.removeEventListener('keydown', handleEscapeKey);
                document.body.style.overflow = original;
            }
        }
    }, [modalStack.length > 0, handleEscapeKey]);

    return (
        <>
        {children}
        <div id="modal-system-root" ref={modalRootRef} className={className} style={{ zIndex: baseZIndex }}>
            {modalRootRef.current && createPortal(
                <>
                    {modalStack.map((instance: ModalInstance, index: number) => {
                        
                        const { component: ModalComponent, name: modalName, props, state } = instance;

                        if (state === 'CLOSED') {
                            setTimeout(() => {
                                setModals((state) => ({
                                    ...state,
                                    modalStack: state.modalStack.filter((i) => i !== instance)
                                }))
                            }, 0);
                        }

                        if (state === 'NEW' || state === 'MOUNTED') {
                            const isTopModal = index === modalStack.length - 1;
                            instance.state = 'MOUNTED';

                            return (
                                <div
                                    key={`${modalName}-${index}`}
                                    className="modal-frame"
                                    style={{
                                        visibility: isTopModal ? 'visible' : 'hidden',
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 1000 + (modalStack.length - index),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <div className={`modal-container modal-container-${props.size || 'md'}`}>
                                        <ModalComponent {...props} />
                                    </div>
                                </div>
                            )
                        }
                    })}
                </>,
                modalRootRef.current
            )}
        </div>
        </>
    )
}

export default ModalProvider;