import { env } from "@/lib/env";

export type DetectedPersonalData = {
  nationalId: string;
  dateOfBirth: string;
  nationalIdValid: boolean;
  confidence: "low" | "medium" | "high";
};

export async function scanProfileIdDocument(file: File): Promise<DetectedPersonalData> {
  const form = new FormData();
  form.append("document", file);

  const res = await fetch(`${env.apiBaseUrl}/api/profile/scan-id`, {
    method: "POST",
    credentials: "include",
    body: form
  });

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    data?: DetectedPersonalData;
  };

  if (!res.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Could not scan document");
  }

  if (!data.data) {
    throw new Error("No data returned from scan");
  }

  return data.data;
}
