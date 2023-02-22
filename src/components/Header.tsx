import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export const Header: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1 pl-5 text-3xl font-bold">
        {session?.user?.name ? `Notes for ${session.user.name}` : ""}
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown-end dropdown">
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
      </div>
    </div>
  );
};
