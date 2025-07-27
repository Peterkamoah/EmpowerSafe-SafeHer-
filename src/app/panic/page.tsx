import { PanicView } from "@/components/panic-view";

export default function PanicPage() {
  return (
    <div className="fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-gray-900 text-white">
      <PanicView />
    </div>
  );
}
