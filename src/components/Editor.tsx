import { getEditorExtensions, IGetEditorExtensionsOptions } from "../utils/editor-extensions";
import MenuBar from "./MenuBar";
import { Content, EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";

export interface IEditorProps {
  initialData?: Content;
  editable?: boolean;
  /** Called with `editor.getJSON()` on every change — never `null`, despite `initialData` (and `setContent`) accepting the broader `Content` type. Feed this straight into `ReadOnlyHtml`'s `content` prop. */
  onChange?: (data: JSONContent) => void;
  className?: string;
  editorClassName?: string;
  menuBarClassName?: string;
  /** Forwarded to `getEditorExtensions` — e.g. `{ youtube: false }` to drop video embedding. */
  extensionOptions?: IGetEditorExtensionsOptions;
  placeholder?: string;
}

const DEFAULT_PLACEHOLDER = "<p>Put your content here ...</p>";

/**
 * The editable rich text editor — a Tiptap instance + its MenuBar
 * toolbar. Emits Tiptap JSON (not HTML) via `onChange`; feed that same
 * JSON straight into `ReadOnlyHtml`'s `content` prop to render it back.
 */
const EditorComponent = ({
  initialData,
  editable = true,
  onChange,
  className,
  editorClassName,
  menuBarClassName,
  extensionOptions,
  placeholder = DEFAULT_PLACEHOLDER,
}: IEditorProps) => {
  const editor = useEditor({
    editable,
    extensions: getEditorExtensions(extensionOptions),
    content: initialData || placeholder,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-full p-4 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background bg-background dark:bg-gray-900 min-h-[200px] ${editorClassName || ""}`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(initialData || placeholder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      <MenuBar editor={editor} className={menuBarClassName} />
      <div className="max-h-100 overflow-y-scroll">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default EditorComponent;
