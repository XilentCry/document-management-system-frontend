import { TClassification } from "@/types/classification";

export async function getAllClassifications(): Promise<TClassification[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/classifications`,
    {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.classifications;
}
