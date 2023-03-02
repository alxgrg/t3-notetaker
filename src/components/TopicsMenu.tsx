import { XCircleIcon } from "@heroicons/react/24/outline";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import React, { useState, type Dispatch, type SetStateAction } from "react";
import { useAlert } from "~/hooks/useAlert";
import { type Topic } from "~/pages";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";

export function isTRPCClientError(
  cause: unknown
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

type Props = {
  selectedTopic: Topic | null;
  setSelectedTopic: Dispatch<SetStateAction<Topic | null>>;
};

export const TopicsMenu: React.FC<Props> = ({
  selectedTopic,
  setSelectedTopic,
}: Props) => {
  const [topicInput, setTopicInput] = useState<string>("");

  const { setAlert } = useAlert();
  const { data: session } = useSession();

  const utils = api.useContext();

  const { data: topics } = api.topic.getAll.useQuery(undefined, {
    enabled: session?.user !== undefined,
    onSuccess: (data) => setSelectedTopic(selectedTopic ?? data[0] ?? null),
  });

  const createTopic = api.topic.create.useMutation({
    onSuccess: (data) => {
      void utils.topic.getAll.invalidate();
      setSelectedTopic(data);
      setTopicInput("");
    },
    onError: (error) => {
      if (isTRPCClientError(error)) {
        console.log("error info: ", error);
      }

      setAlert({
        type: "ERROR",
        message: error.message,
      });
    },
  });

  const deleteTopic = api.topic.delete.useMutation({
    onSuccess: () => {
      void utils.topic.getAll.invalidate();
      void utils.note.getAll.invalidate();
      setSelectedTopic(null);
    },
  });
  return (
    <div className="menu w-80 bg-base-100 p-4 text-base-content md:rounded-box md:w-full">
      <input
        type="text"
        placeholder="New Topic"
        className="input-bordered input input-sm mb-2 w-full"
        onChange={(e) => setTopicInput(e.target.value)}
        value={topicInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            createTopic.mutate({
              title: topicInput,
            });
          }
        }}
      />
      <button
        className="btn-primary btn-outline btn-block btn-sm btn"
        onClick={() =>
          createTopic.mutate({
            title: topicInput,
          })
        }
      >
        Add Topic
      </button>
      <div className="divider" />
      <ul className="flex flex-col gap-2">
        {topics?.map((topic) => (
          <li key={topic.id}>
            {" "}
            <button
              onClick={(e) => {
                e.preventDefault();
                setSelectedTopic(topic);
              }}
              className={`${selectedTopic?.id === topic.id ? "active" : ""}`}
            >
              <div className="flex w-full items-center justify-between">
                <div>{topic.title}</div>
                {selectedTopic?.id === topic.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTopic.mutate({
                        id: topic.id,
                      });
                    }}
                  >
                    <XCircleIcon className="h-6 w-6 hover:stroke-white" />
                  </button>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
