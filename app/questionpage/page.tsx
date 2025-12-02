import { Suspense } from "react";
import QuestionPageClient from "./QuestionPageClient";

export const dynamic = "force-dynamic"; // så Next inte försöker göra statisk export

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestionPageClient />
    </Suspense>
  );
}
