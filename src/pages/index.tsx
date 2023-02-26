import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

import { Header } from "~/components/Header";
import { NoteCard } from "~/components/NoteCard";
import { NoteEditor } from "~/components/NoteEditor";
import { Loading } from "~/components/ui/Loading";
import { api, type RouterOutputs } from "~/utils/api";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useError } from "~/hooks/useError";

const Home: NextPage = () => {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>T3 Notetaker</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />

        {!session?.user ? "Please log in..." : <Content />}
      </main>
    </>
  );
};

export default Home;

export type Topic = RouterOutputs["topic"]["getAll"][0];

export const Content: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const { error, setError } = useError();

  const utils = api.useContext();

  const { data: session } = useSession();

  const { data: topics } = api.topic.getAll.useQuery(undefined, {
    enabled: session?.user !== undefined,
    onSuccess: (data) => setSelectedTopic(selectedTopic ?? data[0] ?? null),
  });

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void utils.topic.getAll.invalidate();
    },
  });

  const deleteTopic = api.topic.delete.useMutation({
    onSuccess: () => {
      void utils.topic.getAll.invalidate();
      void utils.note.getAll.invalidate();
      setSelectedTopic(topics && topics[0] ? topics[0] : null);
    },
  });

  const {
    data: notes,
    status,
    fetchStatus,
  } = api.note.getAll.useQuery(
    { topicId: selectedTopic?.id ?? "" },
    { enabled: session?.user !== undefined && selectedTopic !== null }
  );

  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void utils.note.getAll.invalidate();
    },
    onError: (error) => {
      console.log(error.message);
      setError({
        name: "test",
        type: "500",
        message: "test",
      });
    },
  });

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void utils.note.getAll.invalidate();
    },
  });

  const handleCreateNote = ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => {
    if (!selectedTopic?.id) {
      setError({
        name: "test",
        type: "500",
        message: "test",
      });
      return;
    }
    createNote.mutate({
      title,
      content: content,
      topicId: selectedTopic.id,
    });
  };

  const handleDeleteNote = (id: string) => {
    deleteNote.mutate({
      id,
    });
  };

  return (
    <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
      <div className="px-2">
        <ul className="menu rounded-box w-56 bg-base-100 p-2">
          {topics?.map((topic) => (
            <li key={topic.id}>
              {" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTopic(topic);
                }}
                className={`${selectedTopic?.id === topic.id ? "active" : ""}`}
              >
                <div className="flex w-full items-center justify-between">
                  <div>{topic.title}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTopic.mutate({
                        id: topic.id,
                      });
                    }}
                  >
                    <XCircleIcon className="h-5 w-5 hover:fill-red-400" />
                  </button>
                </div>
              </a>
            </li>
          ))}
        </ul>
        <div className="divider" />
        <input
          type="text"
          placeholder="New Topic"
          className="input-bordered input input-sm w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createTopic.mutate({
                title: e.currentTarget.value,
              });
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
      <div className="col-span-3">
        {status === "loading" && fetchStatus !== "idle" ? (
          <Loading />
        ) : notes ? (
          notes.map((note) => (
            <div key={note.id}>
              <NoteCard onDelete={handleDeleteNote} note={note} />
            </div>
          ))
        ) : null}

        <NoteEditor onSave={handleCreateNote} />
      </div>
    </div>
  );
};
