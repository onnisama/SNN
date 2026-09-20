import { Suspense } from "react";
import { Labs } from "@/components/Labs";

export default function LabsPage() {
  return <Suspense fallback={<div className="page-shell" style={{padding:"80px 0"}}>正在载入实验室…</div>}><Labs /></Suspense>;
}
