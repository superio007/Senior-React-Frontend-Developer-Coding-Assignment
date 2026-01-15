import React, { useEffect, useRef, useCallback } from "react";
import type { User } from "../../types";
import { X } from "lucide-react";

export interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal component displaying detailed user information.
 * Implements focus trap, overlay click to close, and ARIA attributes for accessibility.
 * Focus restoration when modal closes is handled by the parent component.
 */
export const UserModal: React.FC<UserModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the close button when modal opens for better accessibility
  useEffect(() => {
    if (isOpen) {
      // Using setTimeout to ensure the modal is rendered before focusing
      const timeoutId = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Focus trap implementation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Tab" && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }, []);

  // Handle overlay click to close
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen || !user) {
    return null;
  }

  const fullAddress = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-1000"
      onClick={handleOverlayClick}
      aria-hidden="true"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto max-sm:m-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <header className="flex items-center justify-between p-4 px-6 border-b border-slate-200">
          <h2 id="modal-title" className="m-0 text-xl font-semibold">
            {user.name}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="bg-transparent border-none text-2xl text-slate-500 cursor-pointer p-1 leading-none rounded hover:text-slate-800 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 focus-visible:bg-slate-200"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X />
          </button>
        </header>

        <div id="modal-description" className="p-6">
          <section className="mb-6 last:mb-0">
            <h3 className="m-0 mb-2 text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Contact Information
            </h3>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              <dt className="font-medium text-slate-500">Email</dt>
              <dd className="m-0 text-slate-800">{user.email}</dd>

              <dt className="font-medium text-slate-500">Phone</dt>
              <dd className="m-0 text-slate-800">{user.phone}</dd>

              <dt className="font-medium text-slate-500">Website</dt>
              <dd className="m-0 text-slate-800">
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 no-underline hover:underline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 focus-visible:rounded"
                >
                  {user.website}
                </a>
              </dd>
            </dl>
          </section>

          <section className="mb-6 last:mb-0">
            <h3 className="m-0 mb-2 text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Address
            </h3>
            <address className="not-italic text-slate-800">
              {fullAddress}
            </address>
          </section>

          <section className="mb-6 last:mb-0">
            <h3 className="m-0 mb-2 text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Company
            </h3>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              <dt className="font-medium text-slate-500">Name</dt>
              <dd className="m-0 text-slate-800">{user.company.name}</dd>

              <dt className="font-medium text-slate-500">Catch Phrase</dt>
              <dd className="m-0 text-slate-800">{user.company.catchPhrase}</dd>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
};
