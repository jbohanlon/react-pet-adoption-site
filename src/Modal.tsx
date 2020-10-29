import React, { FunctionComponent, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal: FunctionComponent = ({ children }) => {
  const elRef = useRef(document.createElement("div"));

  const modalRoot = document.getElementById("modal");

  // You only want useEffect to run once, so pass an empty array as the second argument
  useEffect(() => {
    if (!modalRoot) {
      return;
    }
    
    modalRoot.appendChild(elRef.current);

    // Clean-up function
    return () => {
      modalRoot.removeChild(elRef.current)
    };
  }, []);

  return createPortal(<div>{children}</div>, elRef.current);
};

export default Modal;
