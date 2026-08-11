export { default as Editor } from "./components/Editor";
export type { IEditorProps } from "./components/Editor";

export { default as ReadOnlyHtml } from "./components/ReadOnlyHtml";
export type { IReadOnlyHtmlProps } from "./components/ReadOnlyHtml";

export { default as MenuBar } from "./components/MenuBar";
export type { IMenuBarProps } from "./components/MenuBar";

export { default as LinkModal } from "./components/LinkModal";
export type { ILinkModalProps } from "./components/LinkModal";

export { default as Modal } from "./components/Modal";
export type { IModalProps } from "./components/Modal";

export { getEditorExtensions } from "./utils/editor-extensions";
export type { IGetEditorExtensionsOptions } from "./utils/editor-extensions";

export { buildImageContainerStyle, getImageAlignFromContainerStyle } from "./utils/image-align";
export type { TImageAlign } from "./utils/image-align";

export { menuBarStateSelector } from "./hooks/menu-bar-state";
export type { MenuBarState } from "./hooks/menu-bar-state";

export { EditorUrlType } from "./enums/editor-url.enum";

// Re-exported so consumers can type editor content without depending on
// @tiptap/react directly for just this one type.
export type { Content as TEditorContent } from "@tiptap/react";
