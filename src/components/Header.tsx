import { Bars3Icon } from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { type Dispatch, type SetStateAction } from "react";

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const Header: React.FC<Props> = ({ setIsOpen }: Props) => {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1 pl-5 text-3xl font-bold">
        {session?.user?.name ? `Notes for ${session.user.name}` : ""}
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown-end dropdown hidden md:block">
          {session?.user.image ? (
            <label
              tabIndex={0}
              className="btn-ghost btn-circle avatar btn"
              onClick={() => void signOut()}
            >
              <Image
                width={25}
                height={25}
                className="rounded-full"
                alt={session?.user?.name || ""}
                src={session?.user?.image || ""}
              />
            </label>
          ) : (
            <button className="btn" onClick={() => void signIn()}>
              signin
            </button>
          )}
        </div>
        <div className="block md:hidden">
          <button onClick={() => setIsOpen(true)}>
            <Bars3Icon className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  );
};
