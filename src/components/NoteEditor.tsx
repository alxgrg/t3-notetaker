import { useState } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

export const NoteEditor = ({
  onSave,
  isDisabled,
}: {
  onSave: (note: { title: string; content: string }) => void;
  isDisabled: boolean;
}) => {
  const [code, setCode] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <input
            placeholder="Note Title"
            className="input-primary input input-lg w-full font-bold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          />
        </h2>

        <CodeMirror
          value={code}
          width="100%"
          height="30vh"
          minWidth="100%"
          minHeight="30vh"
          readOnly={isDisabled}
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          onChange={(value) => setCode(value)}
          className="border border-gray-300"
        />
        <div className="card-actions justify-end">
          <button
            onClick={() => {
              onSave({ title: title, content: code });
              setTitle("");
              setCode("");
            }}
            className="btn-primary btn"
            disabled={title.trim().length === 0 || code.trim().length === 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
