"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children, pendingLabel }: { children: React.ReactNode; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button className="button primary" type="submit" disabled={pending} aria-disabled={pending}>
      {pending && <LoaderCircle className="loading-icon" aria-hidden="true" size={18} />}
      {pending ? pendingLabel : children}
    </button>
  );
}
