import Image from "next/image";

export const Loading = () => {
  return (
    <div className="flex w-full justify-center">
      <Image
        alt="Loading spinner"
        src="/three-dots.svg"
        width={48}
        height={48}
      />
    </div>
  );
};
