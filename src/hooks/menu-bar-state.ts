import { getImageAlignFromContainerStyle } from "../utils/image-align";
import type { Editor } from "@tiptap/core";
import type { EditorStateSnapshot } from "@tiptap/react";

/**
 * State selector for `MenuBar`. Extracts the relevant editor state for
 * rendering menu buttons — passed to `useEditorState` so the toolbar
 * only re-renders when one of these specific values actually changes,
 * not on every keystroke/selection change in the document.
 */
export function menuBarStateSelector(ctx: EditorStateSnapshot<Editor>) {
  return {
    // Text formatting
    isBold: ctx.editor.isActive("bold") ?? false,
    canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
    isItalic: ctx.editor.isActive("italic") ?? false,
    canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
    isStrike: ctx.editor.isActive("strike") ?? false,
    canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
    isUnderline: ctx.editor.isActive("underline") ?? false,
    canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,
    isHighlight: ctx.editor.isActive("highlight") ?? false,
    canHighlight: ctx.editor.can().chain().toggleMark("highlight").run() ?? false,
    isSuperscript: ctx.editor.isActive("superscript") ?? false,
    canSuperscript: ctx.editor.can().chain().toggleSuperscript().run() ?? false,
    isSubscript: ctx.editor.isActive("subscript") ?? false,
    canSubscript: ctx.editor.can().chain().toggleSubscript().run() ?? false,

    // Text alignment
    alignLeft: ctx.editor.isActive({ textAlign: "left" }) ?? false,
    alignCenter: ctx.editor.isActive({ textAlign: "center" }) ?? false,
    alignRight: ctx.editor.isActive({ textAlign: "right" }) ?? false,
    alignJustify: ctx.editor.isActive({ textAlign: "justify" }) ?? false,

    // Image alignment — the Align dropdown targets this instead of
    // textAlign whenever an image is the current selection (see
    // utils/image-align.ts).
    isImageSelected: ctx.editor.isActive("imageResize") ?? false,
    imageAlign: getImageAlignFromContainerStyle(
      (ctx.editor.getAttributes("imageResize") as { containerStyle?: string })
        ?.containerStyle,
    ),

    isCode: ctx.editor.isActive("code") ?? false,
    canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
    canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
    isLink: ctx.editor.isActive("link") ?? false,
    canLink: ctx.editor.can().chain().toggleLink().run() ?? false,

    // Block types
    isParagraph: ctx.editor.isActive("paragraph") ?? false,
    isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
    isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
    isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
    isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
    isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
    isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,

    // Lists and blocks
    isBulletList: ctx.editor.isActive("bulletList") ?? false,
    isOrderedList: ctx.editor.isActive("orderedList") ?? false,
    isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
    isBlockquote: ctx.editor.isActive("blockquote") ?? false,

    // History
    canUndo: ctx.editor.can().chain().undo().run() ?? false,
    canRedo: ctx.editor.can().chain().redo().run() ?? false,
  };
}

export type MenuBarState = ReturnType<typeof menuBarStateSelector>;
