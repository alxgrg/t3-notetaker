import { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { type RouterOutputs } from "~/utils/api";

export type Note = RouterOutputs["note"]["getAll"][0];

export const NoteCard = ({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: (id: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body m-0 p-3">
        <div
          className={`expandable ${isExpanded ? "collapse-open" : ""} collapse`}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <div className="collapse-title text-xl font-bold">{note.title}</div>
          <div className="collapse-content">
            <article className="prose lg:prose-xl">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </article>
          </div>
        </div>
        <div className="card-actions mx-2 flex justify-end">
          <button
            className="btn-warning btn-xs btn px-5"
            onClick={() => onDelete(note.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
