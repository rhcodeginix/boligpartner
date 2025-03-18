import React, { useEffect, useRef } from "react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  isOpen?: boolean;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, isOpen }) => {
  const popup = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body?.classList.add("h-screen");
      document.body.style.overflow = "hidden";
    } else {
      document.body?.classList.remove("h-screen");
      document.body.style.overflow = "";
    }

    return () => {
      document.body?.classList.remove("h-screen");
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popup.current && !popup.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white rounded-[12px] relative mx-[16px]" ref={popup}>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
