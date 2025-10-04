import { createContext, useState } from "react";
import Modal from "./Modal";

export const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // open modal anywhere
  const openModal = ({ title, message, onConfirm }) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: onConfirm || null,
    });
  };

  // close modal
  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {/* Global Modal - always mounted */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={
          modalConfig.onConfirm
            ? () => {
                modalConfig.onConfirm();
                closeModal();
              }
            : null
        }
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </ModalContext.Provider>
  );
};

export default ModalProvider;
