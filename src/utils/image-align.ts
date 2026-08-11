/**
 * tiptap-extension-resize-image has its own alignment mechanism — small
 * floating icons that appear when you click directly on an image while
 * editing — but it stores alignment as a `margin` shorthand baked into
 * the node's `containerStyle` attr, not as a dedicated "align" field.
 * `MenuBar`'s Align dropdown uses these helpers to read/write that same
 * convention so its buttons also work on a selected image, not just on
 * text (TipTap's TextAlign extension only ever targets heading/paragraph
 * nodes — see editor-extensions.ts — so without this, clicking Align on
 * a selected image would silently do nothing).
 */
export type TImageAlign = "left" | "center" | "right";

const MARGIN_BY_ALIGN: Record<TImageAlign, string> = {
  left: "0 auto 0 0",
  center: "0 auto",
  right: "0 0 0 auto",
};

/** Reads the current alignment out of a saved `containerStyle` string, or null if unset/unrecognized. */
export const getImageAlignFromContainerStyle = (
  containerStyle?: string | null,
): TImageAlign | null => {
  if (!containerStyle) return null;
  const match = containerStyle.match(/margin:\s*([^;]+)/);
  if (!match) return null;

  const tokens = match[1].trim().split(/\s+/);
  if (tokens.length === 2) {
    return tokens[0] === "0" && tokens[1] === "auto" ? "center" : null;
  }
  if (tokens.length === 4) {
    const [, right, , left] = tokens;
    if (right === "auto" && left === "auto") return "center";
    if (right === "auto") return "left";
    if (left === "auto") return "right";
  }
  return null;
};

/** Returns a new `containerStyle` string with only its `margin` swapped to match `align` — every other declaration (width, height, cursor, ...) is preserved as-is. */
export const buildImageContainerStyle = (
  containerStyle: string | null | undefined,
  align: TImageAlign,
): string => {
  const declarations = (containerStyle || "")
    .split(";")
    .map((declaration) => declaration.trim())
    .filter((declaration) => declaration && !declaration.startsWith("margin"));
  declarations.push(`margin: ${MARGIN_BY_ALIGN[align]}`);
  return declarations.join("; ") + ";";
};
