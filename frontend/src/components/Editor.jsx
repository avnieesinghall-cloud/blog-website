import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

const commands = [
  {
    label: "Heading 1",
    command: "h1",
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: "Heading 2",
    command: "h2",
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: "Bullet List",
    command: "list",
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Quote",
    command: "quote",
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    label: "Code Block",
    command: "code",
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
];

export default function Editor({ content, setContent }) {
  const [slashMenu, setSlashMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [range, setRange] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing... Try /h1, /h2, /list, /quote, /code",
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());

      const { from } = editor.state.selection;
      const textBefore = editor.state.doc.textBetween(
        Math.max(0, from - 30),
        from,
        "\n"
      );

      const match = textBefore.match(/\/([a-zA-Z0-9]*)$/);

      if (match) {
        setSlashMenu(true);
        setQuery(match[1]);
        setRange({
          from: from - match[0].length,
          to: from,
        });
      } else {
        setSlashMenu(false);
      }
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) return null;

  const filteredCommands = commands.filter((item) =>
    item.command.toLowerCase().includes(query.toLowerCase())
  );

  const runCommand = (item) => {
    if (range) {
      editor.chain().focus().deleteRange(range).run();
    }

    item.action(editor);
    setSlashMenu(false);
    setQuery("");
  };

  return (
    <div className="medium-editor glass">
      <div className="editor-toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          List
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Quote
        </button>
      </div>

      <div className="editor-area">
        <EditorContent editor={editor} />

        {slashMenu && filteredCommands.length > 0 && (
          <div className="slash-menu">
            {filteredCommands.map((item) => (
              <button key={item.command} type="button" onClick={() => runCommand(item)}>
                <span>{item.label}</span>
                <small>/{item.command}</small>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}