# tiptap-rte-kit

A batteries-included [Tiptap](https://tiptap.dev/) rich text editor for React — an editable editor with a full toolbar, plus a matching read-only renderer that shares the exact same extension set (so nothing saved by the editor ever silently fails to render back). Built on [`@heroui/react`](https://heroui.com/) for the toolbar/modal UI.

Extracted from a real app so multiple projects can share and evolve it instead of hand-copying components between repos.

## Install

```bash
npm install tiptap-rte-kit
```

`react`, `react-dom`, `@heroui/react`, and `@heroui/styles` are peer dependencies — install them yourself if you haven't already (any app using this package needs `@heroui/styles` imported somewhere regardless, since this package's own stylesheet reads heroui's theme tokens).

Import the stylesheet once, anywhere near your app's root (e.g. a root layout):

```ts
import "tiptap-rte-kit/styles.css";
```

## Usage

### Editable

```tsx
"use client";

import { Editor, type TEditorContent } from "tiptap-rte-kit";
import { useState } from "react";

export function PostEditor() {
  const [content, setContent] = useState<TEditorContent>();

  return (
    <Editor
      initialData={content}
      onChange={setContent}
    />
  );
}
```

### Read-only

Feed it the exact same Tiptap JSON `Editor`'s `onChange` produced — don't convert it to HTML yourself first.

```tsx
import { ReadOnlyHtml } from "tiptap-rte-kit";

export function PostBody({ content }: { content: TEditorContent }) {
  return <ReadOnlyHtml content={content} />;
}
```

### Routing internal links (Next.js, React Router, ...)

`ReadOnlyHtml` intercepts link clicks itself (internal links vs. opening external ones in a new tab) instead of relying on the browser's default navigation. By default "internal" means a relative path or the current origin, and clicking does a full-page `window.location` navigation. To use your router instead:

```tsx
"use client";

import { ReadOnlyHtml } from "tiptap-rte-kit";
import { useRouter } from "next/navigation";

export function PostBody({ content }: { content: TEditorContent }) {
  const router = useRouter();
  return <ReadOnlyHtml content={content} onInternalLinkClick={router.push} />;
}
```

### Customizing the extension set

Both `Editor` and `ReadOnlyHtml` build their extensions from the same `getEditorExtensions()` — pass `extensionOptions` to either (**keep them in sync between the two**, or content one of them doesn't know about won't render correctly on the other side):

```tsx
<Editor extensionOptions={{ youtube: false }} onChange={setContent} />
<ReadOnlyHtml extensionOptions={{ youtube: false }} content={content} />
```

Need an extension neither of these expose a toggle for? Don't fork this package for it — call `getEditorExtensions()` yourself, splice in whatever `@tiptap/*` extension you need, and build your own `useEditor()` call; `Editor`/`ReadOnlyHtml` are both thin enough that copying the pattern is cheap. `MenuBar`, `LinkModal`, and the `image-align` helpers are all exported individually too, in case you want your own top-level editor shell around the existing toolbar.

## What's exported

| Export | What it is |
| --- | --- |
| `Editor` | The editable Tiptap instance + `MenuBar` toolbar. |
| `ReadOnlyHtml` | Renders saved Tiptap JSON — mounts a real, non-editable `EditorContent` rather than converting to an HTML string, which matters for anything (like image alignment) that only NodeViews apply. |
| `MenuBar` | The toolbar alone, if you're assembling your own editor shell. |
| `LinkModal` / `Modal` | The URL-entry modal `MenuBar` uses for links/images/videos, and the generic heroui modal wrapper it's built on. |
| `getEditorExtensions()` | The single shared extension list both `Editor` and `ReadOnlyHtml` build on. |
| `getImageAlignFromContainerStyle`, `buildImageContainerStyle` | Read/write helpers for how `tiptap-extension-resize-image` encodes image alignment — used internally by `MenuBar`'s Align dropdown so it also works on a selected image, not just text. |
| `menuBarStateSelector` | The `useEditorState` selector `MenuBar` uses — exported in case you're building a custom toolbar and want the same derived state. |
| `EditorUrlType` | Enum used by `MenuBar`/`LinkModal` to track which kind of URL is currently being entered. |

## Local development against a consuming app

Before this is published, or while iterating on a change alongside a real app:

```bash
npm run build
npm link

# in the consuming app:
npm link tiptap-rte-kit
```

`npm run dev` runs the build in watch mode.

## Publishing

```bash
npm run build
npm publish
```

You'll need to be logged in (`npm login`) with publish rights to this package name first. Bump `version` in `package.json` before every publish — `prepublishOnly` runs the build for you automatically.
