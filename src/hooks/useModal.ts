import { useState, useEffect, useCallback } from "react";

export interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

/**
 * A hook for managing modal state with keyboard support.
 * Handles open/close state and ESC key listener for closing.
 *
 * @param onClose - Optional callback to run when modal closes
 * @returns Object containing isOpen state and open/close functions
 */
export function useModal(onClose?: () => void): UseModalReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  return { isOpen, open, close };
}
