import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "../../../utils/cn";

/* ===================================================
   Root
=================================================== */

const Modal = Dialog.Root;

const ModalTrigger = Dialog.Trigger;

const ModalClose = Dialog.Close;

/* ===================================================
   Portal
=================================================== */

const ModalPortal = ({ children }) => (
  <Dialog.Portal>
    {children}
  </Dialog.Portal>
);

/* ===================================================
   Overlay
=================================================== */

const ModalOverlay = forwardRef(
  ({ className, ...props }, ref) => (
    <Dialog.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50",
        "bg-black/50",
        "backdrop-blur-sm",
        "data-[state=open]:animate-fade-in",
        className
      )}
      {...props}
    />
  )
);

ModalOverlay.displayName = "ModalOverlay";

/* ===================================================
   Content
=================================================== */

const ModalContent = forwardRef(
  (
    {
      children,
      className,
      showCloseButton = true,
      ...props
    },
    ref
  ) => (
    <ModalPortal>

      <ModalOverlay />

      <Dialog.Content
        ref={ref}
        className={cn(
          "fixed",

          "left-1/2",

          "top-1/2",

          "z-50",

          "w-[95%]",

          "max-w-lg",

          "-translate-x-1/2",

          "-translate-y-1/2",

          "rounded-[var(--radius-card)]",

          "border",

          "border-[var(--border)]",

          "bg-[var(--card)]",

          "shadow-[var(--shadow-card)]",

          "p-6",

          "outline-none",

          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <Dialog.Close
            className="
            absolute
            right-4
            top-4

            rounded-md

            p-2

            hover:bg-[var(--muted)]

            transition
            "
          >
            <X size={18} />
          </Dialog.Close>
        )}
      </Dialog.Content>

    </ModalPortal>
  )
);

ModalContent.displayName = "ModalContent";

/* ===================================================
   Header
=================================================== */

const ModalHeader = ({
  children,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col gap-1",

      "mb-6",

      className
    )}
  >
    {children}
  </div>
);

/* ===================================================
   Title
=================================================== */

const ModalTitle = forwardRef(
  ({ className, ...props }, ref) => (
    <Dialog.Title
      ref={ref}
      className={cn(
        "text-xl font-semibold",

        className
      )}
      {...props}
    />
  )
);

ModalTitle.displayName = "ModalTitle";

/* ===================================================
   Description
=================================================== */

const ModalDescription = forwardRef(
  ({ className, ...props }, ref) => (
    <Dialog.Description
      ref={ref}
      className={cn(
        "text-sm",

        "text-[var(--muted-foreground)]",

        className
      )}
      {...props}
    />
  )
);

ModalDescription.displayName = "ModalDescription";

/* ===================================================
   Body
=================================================== */

const ModalBody = ({
  children,
  className,
}) => (
  <div
    className={cn(
      className
    )}
  >
    {children}
  </div>
);

/* ===================================================
   Footer
=================================================== */

const ModalFooter = ({
  children,
  className,
}) => (
  <div
    className={cn(
      "mt-6",

      "flex",

      "justify-end",

      "gap-3",

      className
    )}
  >
    {children}
  </div>
);

/* ===================================================
   Compound Component
=================================================== */

Modal.Trigger = ModalTrigger;
Modal.Close = ModalClose;

Modal.Content = ModalContent;

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;

Modal.Body = ModalBody;

Modal.Footer = ModalFooter;

export default Modal;