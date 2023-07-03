import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose, IoMdArrowBack } from "react-icons/io";
import type { ReactNode, FC } from "react";
import { cn } from "utils";

const modalSize = {
  lg: "w-[720px]",
  md: "w-[400px]",
};

interface ModalProps {
  onBack?: () => void; // if truthy, BackIcon rendered
  closeModal: () => void;
  children: ReactNode;
  title?: string;
  closable?: boolean;
  size?: keyof typeof modalSize;
}

const Modal: FC<ModalProps> = ({
  title,
  children,
  closable = true,
  onBack,
  closeModal,
  size = "lg",
}) => {
  const portalRef = useRef<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    portalRef.current = document.getElementById("modal");
    setIsMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "scroll";
    };
  }, []);

  if (!isMounted) return null;
  return createPortal(
    <div className="z-[100] fixed inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral-900/40 overflow-y-hidden"
        onClick={closable ? closeModal : undefined}
      />

      <div
        className={cn(
          "z-50 overflow-hidden rounded-xl bg-white pt-6",
          modalSize[size]
        )}
      >
        <header className="mx-4 flex items-center justify-between">
          {onBack && (
            <div onClick={onBack} className="cursor-pointer">
              <IoMdArrowBack size={18} />
            </div>
          )}
          <p className="text-neutral-900 text-lg font-semibold">{title}</p>
          {closable && (
            <div onClick={closeModal} className="cursor-pointer">
              <IoMdClose size={18} />
            </div>
          )}
        </header>
        {children}
      </div>
    </div>,
    portalRef.current!
  );
};

export default Modal;
