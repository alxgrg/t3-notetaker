import { useSession } from "next-auth/react";
import React, { useState, type Dispatch, type SetStateAction } from "react";
import { z } from "zod";
import { useAlert } from "~/hooks/useAlert";
import { type Topic } from "~/pages";
import { api } from "~/utils/api";

export const topicSchema = z.object({
  title: z
    .string({ required_error: "Topic is required" })
    .min(1, { message: "Topic must be 1 or more characters long" })
    .max(100),
});

type Props = {
  selectedTopic: Topic | null;
  setSelectedTopic: Dispatch<SetStateAction<Topic | null>>;
};

export const TopicsMenu: React.FC<Props> = ({
  selectedTopic,
  setSelectedTopic,
}: Props) => {
  const [topicInput, setTopicInput] = useState<string>("");
  const [error, setError] = useState<string>("");

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
      console.log("error info: ", error);

      setAlert({
        type: "ERROR",
        message: error.message,
      });
    },
  });

  const handleCreateTopic = () => {
    try {
      topicSchema.parse({ title: topicInput });
      createTopic.mutate({
        title: topicInput,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log("handleCreateTopic", err.issues);
        if (err.issues[0]) setError(err.issues[0].message);
      }
    }
  };

  return (
    <div className="menu w-80 bg-base-100 p-4 text-base-content md:rounded-box md:w-full">
      <input
        onFocus={() => setError("")}
        type="text"
        placeholder="New Topic"
        className={`input-bordered input input-sm w-full ${
          error.length > 0 ? "border-red-600" : ""
        }`}
        onChange={(e) => {
          setError("");
          setTopicInput(e.target.value);
        }}
        value={topicInput}
        required
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCreateTopic();
          }
        }}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        className="btn-primary btn-outline btn-block btn-sm btn mt-3"
        onClick={handleCreateTopic}
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
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
