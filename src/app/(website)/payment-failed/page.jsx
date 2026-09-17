import { Suspense } from "react";
import PaymentFailedContent from "./PaymentFailedContent";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-4 border-[#002D62] border-t-transparent rounded-full mx-auto"></div>

            <p className="mt-4 text-gray-600">
              Loading payment information...
            </p>
          </div>
        </main>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}