import { Button, Modal as HeroModal } from "@heroui/react";
import { ComponentProps, ReactNode } from "react";
import { FiInfo } from "react-icons/fi";

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon?: ReactNode;
  showTitle?: boolean;
  title?: string;
  children?: ReactNode;
  okText?: string;
  cancelText?: string;
  okButtonIcon?: ReactNode;
  cancelButtonIcon?: ReactNode;
  showOkButton?: boolean;
  showCancelButton?: boolean;
  showCloseTrigger?: boolean;
  okButtonProps?: ComponentProps<typeof Button>;
  cancelButtonProps?: ComponentProps<typeof Button>;
  onOk?: () => void;
  onCancel?: () => void;
  className?: string;
  isDismissable?: boolean;
  isKeyboardDismissable?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "cover" | "full";
  scroll?: "inside" | "outside";
}

/**
 * A thin, generic wrapper around @heroui/react's Modal — used internally
 * by LinkModal, but exported in case a consuming app wants the same
 * look for its own modals without pulling in heroui's more verbose
 * compound-component API directly.
 */
const Modal = ({
  isOpen,
  onClose,
  icon,
  showTitle = true,
  title,
  children,
  okText = "Ok",
  cancelText = "Cancel",
  okButtonIcon,
  cancelButtonIcon,
  showOkButton = true,
  showCancelButton = true,
  showCloseTrigger = true,
  okButtonProps,
  cancelButtonProps,
  onOk,
  onCancel,
  className = "",
  isDismissable = true,
  isKeyboardDismissable = true,
  size = "md",
  scroll = "inside",
}: IModalProps) => {
  return (
    <HeroModal isOpen={isOpen} onOpenChange={onClose}>
      <HeroModal.Backdrop
        variant="blur"
        isDismissable={isDismissable}
        isKeyboardDismissDisabled={!isKeyboardDismissable}
      >
        <HeroModal.Container size={size} scroll={scroll}>
          <HeroModal.Dialog className={className}>
            {showCloseTrigger && <HeroModal.CloseTrigger />}
            <HeroModal.Header>
              <div className="flex items-center gap-2">
                <HeroModal.Icon className="bg-default text-foreground">
                  {icon || <FiInfo />}
                </HeroModal.Icon>
                {showTitle && (
                  <HeroModal.Heading className="font-bold">
                    {title || "Modal Title"}
                  </HeroModal.Heading>
                )}
              </div>
            </HeroModal.Header>
            <HeroModal.Body className="p-1">{children}</HeroModal.Body>
            <HeroModal.Footer>
              {showCancelButton && (
                <Button onPress={onCancel || onClose} variant="outline" {...cancelButtonProps}>
                  {cancelButtonIcon}
                  {cancelText}
                </Button>
              )}
              {showOkButton && (
                <Button onPress={onOk || onClose} variant="tertiary" {...okButtonProps}>
                  {okButtonIcon}
                  {okText}
                </Button>
              )}
            </HeroModal.Footer>
          </HeroModal.Dialog>
        </HeroModal.Container>
      </HeroModal.Backdrop>
    </HeroModal>
  );
};

export default Modal;
