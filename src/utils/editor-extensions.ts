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
    // No Tailwind utility classes on any of these HTMLAttributes —
    // Tailwind only generates CSS for class *names it can find by
    // scanning a project's own source files*, never a dependency's
    // compiled JS. A class string baked in here would silently render
    // with no matching CSS in any consuming app, unless that app's own
    // source happens to already use the exact same class somewhere else
    // (which is exactly what made this bug take a while to notice —
    // most of these classes are common enough to be reused
    // coincidentally, `text-blue-600` for links wasn't). All of this
    // styling lives in ./styles/editor.css instead, as real CSS scoped
    // under `.tiptap` — see that file for each corresponding rule.
    StarterKit,
    Highlight,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Superscript,
    Subscript,
    Link.configure({
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
      // A real CSS color, not a Tailwind class — this is assigned
      // directly to a DOM element's `style.backgroundColor` by
      // prosemirror-dropcursor itself, so (unlike the HTMLAttributes
      // above) a Tailwind class name here wouldn't just be unstyled,
      // it'd be flat-out invalid CSS and silently do nothing at all.
      color: "#3b82f6", // Tailwind blue-500
      width: 2,
    }),
  ];

  if (options.youtube !== false) {
    extensions.push(
      Youtube.configure({
        controls: true,
        nocookie: true,
        ...(options.youtube || {}),
      }),
    );
  }

  return extensions;
};
