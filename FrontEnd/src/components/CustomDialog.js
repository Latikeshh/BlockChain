import { useState, createContext, useContext, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "./CustomDialog.css";

const DialogContext = createContext();

export const useDialog = () => useContext(DialogContext);

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState({
    show: false,
    title: "",
    message: "",
    type: "info", // info, success, error, warning, confirm
    onConfirm: null,
    confirmText: "OK",
    cancelText: "Cancel",
    showCancel: false,
  });

  const showDialog = (options) => {
    setDialog({
      show: true,
      title: options.title || "Notice",
      message: options.message || "",
      type: options.type || "info",
      onConfirm: options.onConfirm || null,
      confirmText: options.confirmText || "OK",
      cancelText: options.cancelText || "Cancel",
      showCancel: options.showCancel || false,
    });
  };

  // Expose showDialog to window for global usage
  useEffect(() => {
    window.showDialog = showDialog;
    return () => {
      window.showDialog = null;
    };
  }, []);

  const hideDialog = () => {
    setDialog({ ...dialog, show: false });
  };

  const handleConfirm = () => {
    if (dialog.onConfirm) {
      dialog.onConfirm();
    }
    hideDialog();
  };

  const getVariant = () => {
    switch (dialog.type) {
      case "success": return "success";
      case "error": return "danger";
      case "warning": return "warning";
      default: return "primary";
    }
  };

  const getIcon = () => {
    switch (dialog.type) {
      case "success": return "✅";
      case "error": return "❌";
      case "warning": return "⚠️";
      default: return "ℹ️";
    }
  };

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      <Modal show={dialog.show} onHide={hideDialog} centered backdrop="static" className="dialog-modal">
        <Modal.Header closeButton className={`dialog-header ${getHeaderClass(dialog.type)}`}>
          <Modal.Title>
            {getIcon()} {dialog.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="dialog-body">
          <div className={`dialog-icon ${getIconClass(dialog.type)}`}>
            {getIcon()}
          </div>
          <p className="dialog-message">{dialog.message}</p>
        </Modal.Body>
        <Modal.Footer className="dialog-footer">
          {dialog.showCancel && (
            <Button variant="secondary" onClick={hideDialog}>
              {dialog.cancelText}
            </Button>
          )}
          <Button variant={getVariant()} onClick={handleConfirm}>
            {dialog.confirmText}
          </Button>
        </Modal.Footer>
      </Modal>
    </DialogContext.Provider>
  );
}

// Helper functions for different dialog types
export const dialog = {
  success: (title, message) => {
    window.showDialog?.({ title, message, type: "success" });
  },
  error: (title, message) => {
    window.showDialog?.({ title, message, type: "error" });
  },
  warning: (title, message) => {
    window.showDialog?.({ title, message, type: "warning" });
  },
  info: (title, message) => {
    window.showDialog?.({ title, message, type: "info" });
  },
  confirm: (title, message, onConfirm, confirmText = "Confirm", cancelText = "Cancel") => {
    window.showDialog?.({ 
      title, 
      message, 
      type: "warning",
      onConfirm,
      confirmText,
      cancelText,
      showCancel: true 
    });
  },
};

// CSS class name helper function
const getHeaderClass = (type) => {
  switch (type) {
    case "success":
      return "dialog-header-success";
    case "error":
      return "dialog-header-error";
    case "warning":
      return "dialog-header-warning";
    default:
      return "dialog-header-info";
  }
};

const getIconClass = (type) => {
  switch (type) {
    case "success":
      return "dialog-icon-success";
    case "error":
      return "dialog-icon-error";
    case "warning":
      return "dialog-icon-warning";
    default:
      return "dialog-icon-info";
  }
};
