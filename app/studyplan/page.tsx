import { Suspense } from "react";
import StudyPlanClient from "./StudyPlanClient";

export const dynamic = "force-dynamic"; // <- gör att Next slutar försöka prerendra

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudyPlanClient />
    </Suspense>
  );
}
