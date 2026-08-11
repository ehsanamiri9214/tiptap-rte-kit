import type { Extensions } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import { Dropcursor } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";

export interface IGetEditorExtensionsOptions {
  /** Passed straight through to `@tiptap/extension-youtube`'s `.configure()`. Set `false` to drop video embedding entirely. */
  youtube?: false | Record<string, unknown>;
  /** Passed straight through to `@tiptap/extension-link`'s `.configure()`. */
  link?: Record<string, unknown>;
}

/**
 * The one extension set shared by every renderer in this package
 * (`Editor` for editing, `ReadOnlyHtml` for display) — kept in one place
 * on purpose. A node type present in one but missing from the other
 * silently loses its saved attributes/behavior wherever it's missing:
 * that's exactly what caused an early version of this editor's image
 * alignment to disappear in read-only view — the two renderers had
 * independently hand-copied, drifted-apart extension lists, and one was
 * missing the node that carries alignment/resize state entirely.
 *
 * If you need a different extension mix per call site, don't fork this
 * list — pass different `options`, or splice extra extensions onto the
 * returned array (they're plain Tiptap `Extension`/`Node` instances).
 */
export const getEditorExtensions = (options: IGetEditorExtensionsOptions = {}): Extensions => {
  const extensions: Extensions = [
    StarterKit.configure({
      bulletList: {
        HTMLAttributes: {
          class: "list-disc ml-6",
        },
      },
      orderedList: {
        HTMLAttributes: {
          class: "list-decimal ml-6",
        },
      },
      link: {
        HTMLAttributes: {
          class: "text-blue-600 hover:underline",
        },
      },
      horizontalRule: {
        HTMLAttributes: {
          class: "my-4 border-t-1 border-gray-300 dark:border-gray-700",
        },
      },
    }),
    Highlight,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Superscript,
    Subscript,
    Link.configure({
      HTMLAttributes: {
        class: "text-blue-600 hover:underline",
      },
      // Both Editor and ReadOnlyHtml intercept clicks manually instead
      // (internal routing vs. external new-tab) — see their `onClick`.
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      validate: () => true,
      protocols: ["http", "https"],
      ...options.link,
    }),
    Image,
    ImageResize,
    Dropcursor.configure({
      color: "text-blue-500",
      width: 2,
    }),
  ];

  if (options.youtube !== false) {
    extensions.push(
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: "w-full aspect-video rounded-lg my-4",
        },
        ...(options.youtube || {}),
      }),
    );
  }

  return extensions;
};
