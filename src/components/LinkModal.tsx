import { Input, Label, TextField } from "@heroui/react";
import { useState } from "react";
import { FiLink } from "react-icons/fi";
import Modal from "./Modal";

export interface ILinkModalProps {
  url?: string;
  isOpen: boolean;
  onClose?: (url?: string) => void;
}

/**
 * Shared URL-entry modal for MenuBar's "Set Link" / "Insert Image" /
 * "Insert Video" actions — which of those it's being used for is tracked
 * by the caller (see `EditorUrlType`), not by this component.
 */
const LinkModal = ({ url, isOpen, onClose }: ILinkModalProps) => {
  const [link, setLink] = useState(url || "");

  const isValidUrl = () => {
    try {
      new URL(link);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose || (() => {})}
      icon={<FiLink />}
      title="Link Modal"
      okText="Insert Link"
      onOk={() => onClose?.(link)}
      okButtonProps={{
        isDisabled: !isValidUrl(),
        variant: "primary",
      }}
    >
      <TextField isRequired className="w-full" name="link" onChange={(value) => setLink(value)}>
        <Label>Link</Label>
        <Input placeholder="https://example.com" value={link} variant="secondary" />
      </TextField>
    </Modal>
  );
};

export default LinkModal;
