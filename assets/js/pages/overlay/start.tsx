import Counter from "../../lib/components/counter";
import TransitionScreenLayout from "../../lib/components/transition-screen-layout";

export default function Start() {
  return (
    <TransitionScreenLayout>
      <div className="flex h-fit flex-col items-center justify-center gap-4">
        <p className="text-one text-white">Starting soon</p>
        <Counter countdownSeconds={60 * 5}>
          <p className="text-six text-white">[Ok, peut-être en retard 🥸]</p>
        </Counter>
      </div>
    </TransitionScreenLayout>
  );
}