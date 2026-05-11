import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const GynoCareBackground = ({ children }: Props) => {
  return (
    <div className="relative min-h-screen overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fff7fb] via-[#fffafd] to-[#f4ecff] p-6">
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 left-20 h-72 w-72 rounded-full bg-pink-300/25 blur-3xl" />

      <div className="pointer-events-none absolute top-16 right-24 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-200/25 blur-3xl" />

      <div className="pointer-events-none absolute bottom-10 left-0 h-80 w-80 rounded-full bg-violet-200/20 blur-3xl" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
