import { buildImageContainerStyle } from "../utils/image-align";
import { menuBarStateSelector } from "../hooks/menu-bar-state";
import { EditorUrlType } from "../enums/editor-url.enum";
import { Button, Dropdown, toast, Tooltip } from "@heroui/react";
import { Editor, useEditorState } from "@tiptap/react";
import { ReactNode, useState } from "react";
import {
  FiAlignCenter,
  FiAlignJustify,
  FiAlignLeft,
  FiAlignRight,
  FiBold,
  FiChevronDown,
  FiImage,
  FiItalic,
  FiLink,
  FiList,
  FiRefreshCcw,
  FiRefreshCw,
  FiUnderline,
  FiVideo,
} from "react-icons/fi";
import { GoStrikethrough, GoUnlink } from "react-icons/go";
import { IoCodeSlashOutline } from "react-icons/io5";
import { LiaHeadingSolid } from "react-icons/lia";
import {
  MdCode,
  MdFormatClear,
  MdFormatListNumbered,
  MdFormatQuote,
  MdHorizontalRule,
  MdKeyboardReturn,
  MdLayersClear,
} from "react-icons/md";
import { PiTextSubscriptLight, PiTextSuperscriptLight } from "react-icons/pi";
import LinkModal from "./LinkModal";

export interface IMenuBarProps {
  editor: Editor | null;
  className?: string;
}

const MenuBar = ({ editor, className }: IMenuBarProps) => {
  // Note: Keep this on top.
  if (!editor) {
    return null;
  }

  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [urlType, setUrlType] = useState<EditorUrlType>(EditorUrlType.Link);
  const [linkModalOpen, setLinkModalOpen] = useState(false);

  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  });

  // Align dropdown targets whichever is actually selected — an image (via
  // its containerStyle margin) or text (via TextAlign) — instead of always
  // calling toggleTextAlign, which silently no-ops on images (TextAlign is
  // scoped to heading/paragraph only, see utils/editor-extensions.ts).
  const applyAlign = (align: "left" | "center" | "right" | "justify") => {
    if (editorState.isImageSelected && align !== "justify") {
      const currentStyle = (
        editor.getAttributes("imageResize") as { containerStyle?: string }
      )?.containerStyle;
      editor
        .chain()
        .focus()
        .updateAttributes("imageResize", {
          containerStyle: buildImageContainerStyle(currentStyle, align),
        })
        .run();
      return;
    }
    editor.chain().focus().toggleTextAlign(align).run();
  };

  const ITEMS: {
    name: string;
    icon?: ReactNode;
    action: () => void;
    isActive?: boolean;
    isDisabled?: boolean;
    isDropdown?: boolean;
    dropdownItems?: {
      name: string;
      icon?: ReactNode;
      action: () => void;
      isActive?: boolean;
      isDisabled?: boolean;
    }[];
  }[] = [
    {
      name: "Paragraph",
      icon: <span className="capitalize">p</span>,
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: editorState.isParagraph,
    },
    {
      name: "Highlight",
      icon: <span className="capitalize">h</span>,
      action: () => editor.chain().focus().toggleMark("highlight").run(),
      isActive: editorState.isHighlight,
      isDisabled: !editorState.canHighlight,
    },
    {
      name: "Heading",
      icon: (
        <span className="inline-flex items-center gap-0.5">
          <LiaHeadingSolid size={16} />
          <FiChevronDown className="w-3 h-3" />
        </span>
      ),
      action: () => {},
      isActive:
        editorState.isHeading1 ||
        editorState.isHeading2 ||
        editorState.isHeading3 ||
        editorState.isHeading4 ||
        editorState.isHeading5 ||
        editorState.isHeading6,
      isDropdown: true,
      dropdownItems: [
        {
          name: "H1",
          icon: <span className="capitalize">h1</span>,
          action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: editorState.isHeading1,
        },
        {
          name: "H2",
          icon: <span className="capitalize">h2</span>,
          action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: editorState.isHeading2,
        },
        {
          name: "H3",
          icon: <span className="capitalize">h3</span>,
          action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: editorState.isHeading3,
        },
        {
          name: "H4",
          icon: <span className="capitalize">h4</span>,
          action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
          isActive: editorState.isHeading4,
        },
        {
          name: "H5",
          icon: <span className="capitalize">h5</span>,
          action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
          isActive: editorState.isHeading5,
        },
        {
          name: "H6",
          icon: <span className="capitalize">h6</span>,
          action: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
          isActive: editorState.isHeading6,
        },
      ],
    },
    {
      name: "Bold",
      icon: <FiBold />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editorState.isBold,
      isDisabled: !editorState.canBold,
    },
    {
      name: "Italic",
      icon: <FiItalic />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editorState.isItalic,
      isDisabled: !editorState.canItalic,
    },
    {
      name: "Strikethrough",
      icon: <GoStrikethrough />,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editorState.isStrike,
      isDisabled: !editorState.canStrike,
    },
    {
      name: "Underline",
      icon: <FiUnderline />,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editorState.isUnderline,
      isDisabled: !editorState.canUnderline,
    },
    {
      name: "Superscript",
      icon: <PiTextSuperscriptLight />,
      action: () => editor.chain().focus().toggleSuperscript().run(),
      isActive: editorState.isSuperscript,
      isDisabled: !editorState.canSuperscript,
    },
    {
      name: "Subscript",
      icon: <PiTextSubscriptLight />,
      action: () => editor.chain().focus().toggleSubscript().run(),
      isActive: editorState.isSubscript,
      isDisabled: !editorState.canSubscript,
    },
    {
      name: "Set Link",
      icon: <FiLink />,
      action: () => {
        const link = editor.getAttributes("link").href;
        setCurrentUrl(link || "");
        setUrlType(EditorUrlType.Link);
        setLinkModalOpen(true);
      },
      isActive: editorState.isLink,
      isDisabled: !editorState.canLink,
    },
    {
      name: "Unset Link",
      icon: <GoUnlink />,
      action: () => editor.chain().focus().unsetLink().run(),
      isActive: editorState.isLink,
    },
    {
      name: "Insert Image",
      icon: <FiImage />,
      action: () => {
        setCurrentUrl("");
        setUrlType(EditorUrlType.Image);
        setLinkModalOpen(true);
      },
    },
    {
      name: "Insert Video",
      icon: <FiVideo />,
      action: () => {
        setCurrentUrl("");
        setUrlType(EditorUrlType.Video);
        setLinkModalOpen(true);
      },
    },
    {
      name: "Align",
      icon: (
        <span className="inline-flex items-center gap-0.5">
          <FiAlignLeft />
          <FiChevronDown className="w-3 h-3" />
        </span>
      ),
      action: () => {},
      isActive: editorState.isImageSelected
        ? !!editorState.imageAlign
        : editorState.alignLeft ||
          editorState.alignCenter ||
          editorState.alignRight ||
          editorState.alignJustify,
      isDropdown: true,
      dropdownItems: [
        {
          name: "Align left",
          icon: <FiAlignLeft />,
          action: () => applyAlign("left"),
          isActive: editorState.isImageSelected
            ? editorState.imageAlign === "left"
            : editorState.alignLeft,
        },
        {
          name: "Align center",
          icon: <FiAlignCenter />,
          action: () => applyAlign("center"),
          isActive: editorState.isImageSelected
            ? editorState.imageAlign === "center"
            : editorState.alignCenter,
        },
        {
          name: "Align right",
          icon: <FiAlignRight />,
          action: () => applyAlign("right"),
          isActive: editorState.isImageSelected
            ? editorState.imageAlign === "right"
            : editorState.alignRight,
        },
        {
          name: "Align justify",
          icon: <FiAlignJustify />,
          action: () => applyAlign("justify"),
          isActive: !editorState.isImageSelected && editorState.alignJustify,
          // Justify has no meaning for a single image.
          isDisabled: editorState.isImageSelected,
        },
      ],
    },
    {
      name: "List",
      icon: (
        <span className="inline-flex items-center gap-0.5">
          <FiList />
          <FiChevronDown className="w-3 h-3" />
        </span>
      ),
      action: () => {},
      isActive: editorState.isBulletList || editorState.isOrderedList,
      isDropdown: true,
      dropdownItems: [
        {
          name: "Bullet list",
          icon: <FiList />,
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: editorState.isBulletList,
        },
        {
          name: "Ordered list",
          icon: <MdFormatListNumbered />,
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: editorState.isOrderedList,
        },
      ],
    },
    {
      name: "Code",
      icon: <IoCodeSlashOutline />,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editorState.isCode,
      isDisabled: !editorState.canCode,
    },
    {
      name: "Undo",
      icon: <FiRefreshCcw />,
      action: () => editor.chain().focus().undo().run(),
      isDisabled: !editorState.canUndo,
    },
    {
      name: "Redo",
      icon: <FiRefreshCw />,
      action: () => editor.chain().focus().redo().run(),
      isDisabled: !editorState.canRedo,
    },
    {
      name: "Blocks",
      icon: (
        <span className="inline-flex items-center gap-1">
          <MdCode />
          <FiChevronDown className="w-3 h-3" />
        </span>
      ),
      action: () => {},
      isDropdown: true,
      isActive: editorState.isCodeBlock || editorState.isBlockquote,
      dropdownItems: [
        {
          name: "Code block",
          icon: <MdCode />,
          action: () => editor.chain().focus().toggleCodeBlock().run(),
          isActive: editorState.isCodeBlock,
        },
        {
          name: "Blockquote",
          icon: <MdFormatQuote />,
          action: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: editorState.isBlockquote,
        },
        {
          name: "Horizontal rule",
          icon: <MdHorizontalRule />,
          action: () => editor.chain().focus().setHorizontalRule().run(),
        },
        {
          name: "Hard break",
          icon: <MdKeyboardReturn />,
          action: () => editor.chain().focus().setHardBreak().run(),
        },
      ],
    },
    {
      name: "Clear",
      icon: (
        <span className="inline-flex items-center gap-1">
          <MdFormatClear />
          <FiChevronDown className="w-3 h-3" />
        </span>
      ),
      action: () => {},
      isDropdown: true,
      dropdownItems: [
        {
          name: "Clear marks",
          icon: <MdFormatClear />,
          action: () => editor.chain().focus().unsetAllMarks().run(),
          isDisabled: !editorState.canClearMarks,
        },
        {
          name: "Clear nodes",
          icon: <MdLayersClear />,
          action: () => editor.chain().focus().clearNodes().run(),
        },
      ],
    },
  ];

  const setLink = (url?: string) => {
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const setImageLink = (url?: string) => {
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const isYoutubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const setVideoLink = (url?: string) => {
    if (!url) return;

    if (!isYoutubeUrl(url)) {
      toast.danger("Invalid video URL", {
        description: "Only YouTube links are supported",
      });
      return;
    }

    editor.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 480 }).run();
  };

  return (
    <>
      <ul
        className={`flex items-center flex-wrap gap-2 bg-background dark:bg-gray-900 rounded p-2 border ${className || ""}`}
      >
        {ITEMS.map((item) =>
          item.isDropdown ? (
            <li className="relative" key={item.name}>
              <Dropdown>
                <Tooltip delay={0}>
                  <Dropdown.Trigger
                    isDisabled={item.isDisabled}
                    className={`button button--icon-only button--md button--outline
                                  ${item.isActive ? "shadow-lg ring-2 ring-blue-500" : ""}`}
                  >
                    {item.icon || item.name}
                  </Dropdown.Trigger>

                  <Tooltip.Content>
                    <p>{item.name}</p>
                  </Tooltip.Content>
                </Tooltip>

                <Dropdown.Popover className="w-14 min-w-0">
                  <Dropdown.Menu
                    aria-label={`${item.name} actions`}
                    onAction={(key) => {
                      const selectedItem = item.dropdownItems?.find(
                        (dropdownItem) => dropdownItem.name === String(key),
                      );

                      selectedItem?.action();
                    }}
                  >
                    {(item.dropdownItems || []).map((dropdownItem) => (
                      <Dropdown.Item
                        key={dropdownItem.name}
                        id={dropdownItem.name}
                        textValue={dropdownItem.name}
                        isDisabled={dropdownItem.isDisabled}
                        className={`${dropdownItem.isActive ? "text-blue-600 text-bold border-blue-600" : ""} border p-0 flex justify-center`}
                      >
                        <Tooltip>
                          <Tooltip.Trigger>
                            <p>{dropdownItem.icon || dropdownItem.name}</p>
                          </Tooltip.Trigger>
                          <Tooltip.Content>
                            <p>{dropdownItem.name}</p>
                          </Tooltip.Content>
                        </Tooltip>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </li>
          ) : (
            <li key={item.name}>
              <Tooltip delay={0}>
                <Button
                  variant="outline"
                  onPress={item.action}
                  isDisabled={item.isDisabled}
                  className={item.isActive ? "is-active shadow-lg ring-2 ring-blue-500" : ""}
                  isIconOnly={!!item.icon}
                >
                  {item.icon || item.name}
                </Button>
                <Tooltip.Content>
                  <p>{item.name}</p>
                </Tooltip.Content>
              </Tooltip>
            </li>
          ),
        )}
      </ul>
      <LinkModal
        url={currentUrl}
        isOpen={linkModalOpen}
        onClose={(url) => {
          setLinkModalOpen(false);

          if (url) {
            if (urlType === EditorUrlType.Image) {
              setImageLink(url);
              return;
            }

            if (urlType === EditorUrlType.Video) {
              setVideoLink(url);
              return;
            }

            setLink(url);
          }
        }}
      />
    </>
  );
};

export default MenuBar;
