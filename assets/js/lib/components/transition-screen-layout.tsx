import { ReactNode } from "react";
import LongLogo from "../icons/long-logo";
import SocialMedia from "./social-media";

interface TransitionScreenLayoutProps {
  children: ReactNode;
}

export default function TransitionScreenLayout({ children }: TransitionScreenLayoutProps) {
  return (
    <div className="border-dekstop-light flex h-full w-full flex-col items-center justify-between rounded-lg border-[0.6rem] p-3">
      <div className="mt-20 flex w-full flex-1 flex-col items-center justify-center gap-10">
        <header className="w-[60%]">
          <LongLogo className="h-auto w-full" />
        </header>

        {children}
      </div>

      <footer className="h-fit w-full">
        <div className="mx-auto w-fit">
          <SocialMedia />
        </div>
      </footer>
    </div>
  );
}