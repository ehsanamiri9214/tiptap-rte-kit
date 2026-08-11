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
// @tiptap/react directly for just these two types. `TEditorContent`
// (Tiptap's `Content`) is the broad type `Editor`'s `initialData` (and
// `ReadOnlyHtml`'s `content`) accept — HTML string, JSON, or null.
// `TEditorJSON` (Tiptap's `JSONContent`) is narrower and matches exactly
// what `Editor`'s `onChange` actually hands you (`editor.getJSON()`,
// which is never null) — type your own state with this one, not
// `TEditorContent`, or you'll end up fighting an impossible `null` case
// that can't actually happen.
export type { Content as TEditorContent, JSONContent as TEditorJSON } from "@tiptap/react";
