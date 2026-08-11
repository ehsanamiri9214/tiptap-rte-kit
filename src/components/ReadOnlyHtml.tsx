import { getEditorExtensions, IGetEditorExtensionsOptions } from "../utils/editor-extensions";
import { Content, EditorContent, useEditor } from "@tiptap/react";
import { MouseEvent, useEffect } from "react";

export interface IReadOnlyHtmlProps {
  content: Content;
  className?: string;
  /** Forwarded to `getEditorExtensions` — keep in sync with whatever `Editor` instance produced `content`, or saved node attrs (e.g. image alignment) may not render. */
  extensionOptions?: IGetEditorExtensionsOptions;
  /**
   * Called instead of a full page navigation when a link inside the
   * content is internal (see `isInternalUrl`) — e.g. pass your router's
   * `push`. Defaults to `window.location.href = href` (a plain, works-
   * anywhere fallback) if omitted.
   */
  onInternalLinkClick?: (href: string) => void;
  /**
   * Decides whether a clicked link's `href` is "internal" (routed via
   * `onInternalLinkClick`) vs. "external" (opened in a new tab). Default:
   * relative paths, or absolute URLs matching `window.location.origin`
   * or anything in `internalOrigins`.
   */
  isInternalUrl?: (href: string) => boolean;
  /** Extra origins (e.g. a marketing site sharing the same app) to treat as internal — only used by the default `isInternalUrl`, ignored if you pass your own. */
  internalOrigins?: string[];
}

const defaultIsInternalUrl = (href: string, internalOrigins: string[] = []): boolean => {
  if (typeof window === "undefined") return href.startsWith("/");
  return (
    href.startsWith("/") ||
    href.startsWith(window.location.origin) ||
    internalOrigins.some((origin) => href.startsWith(origin))
  );
};

/**
 * Renders saved Tiptap JSON (from `Editor`'s `onChange`) by mounting an
 * actual (non-editable) `EditorContent` — deliberately NOT by
 * instantiating a headless `Editor` and dumping its `.getHTML()` into
 * `dangerouslySetInnerHTML`. That approach silently drops anything a
 * node's NodeView (rather than its plain schema `renderHTML`) is
 * responsible for — e.g. tiptap-extension-resize-image's image
 * alignment/resize state, which only ever gets applied as real inline
 * styles inside its NodeView. NodeViews only run on a real, mounted
 * EditorView (which is exactly what this component sets up, just
 * `editable: false`), never on `.getHTML()`'s string serialization.
 *
 * Pass the *same* `extensionOptions` you gave the `Editor` that produced
 * `content` — this and `Editor` must resolve to the same extension set,
 * or content only one of them knows about (attrs, node types, ...) won't
 * render correctly here.
 */
const ReadOnlyHtml = ({
  content,
  className,
  extensionOptions,
  onInternalLinkClick,
  isInternalUrl,
  internalOrigins,
}: IReadOnlyHtmlProps) => {
  const editor = useEditor({
    editable: false,
    extensions: getEditorExtensions(extensionOptions),
    content: content || undefined,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `tiptap max-w-full bg-background dark:bg-gray-900 shadow rounded p-6 ${className || ""}`,
      },
    },
  });

  useEffect(() => {
    if (!editor || !content) return;
    editor.commands.setContent(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, content]);

  if (!content) {
    return null;
  }

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    const internal = isInternalUrl
      ? isInternalUrl(href)
      : defaultIsInternalUrl(href, internalOrigins);

    e.preventDefault();

    if (internal) {
      if (onInternalLinkClick) {
        onInternalLinkClick(href);
      } else {
        window.location.href = href;
      }
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return <EditorContent editor={editor} onClick={handleClick} />;
};

export default ReadOnlyHtml;
