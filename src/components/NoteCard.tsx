import { TrashIcon } from "@heroicons/react/24/outline";
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
          className={`${
            isExpanded ? "collapse-open" : ""
          } collapse-arrow collapse`}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          <div
            className="collapse-title cursor-pointer text-xl font-bold"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {note.title}
          </div>
          <div className="collapse-content">
            <article className="prose lg:prose-xl">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </article>
          </div>
        </div>
        <div className="card-actions mx-2 flex justify-end">
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="cursor-pointer">
              <TrashIcon className="h-5 w-5 stroke-gray-500 hover:stroke-red-600" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <button onClick={() => onDelete(note.id)}>Delete</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
