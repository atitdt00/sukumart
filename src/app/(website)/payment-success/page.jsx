import { Suspense } from "react";
import PaymentSuccessContent from "./PaymentSuccessContent";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-4 border-[#002D62] border-t-transparent rounded-full mx-auto"></div>

            <p className="mt-4 text-gray-600">
              Processing payment...
            </p>
          </div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}