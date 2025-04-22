import React, { useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Modal({ open, onOpenChange, children, className = '', style }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" style={style}>
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-lg relative ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-b">{children}</div>;
}

export function ModalTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold">{children}</h2>;
}

export function ModalContent({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) {
  return <div className="p-4" style={style}>{children}</div>;
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-t flex justify-end gap-2">{children}</div>;
}