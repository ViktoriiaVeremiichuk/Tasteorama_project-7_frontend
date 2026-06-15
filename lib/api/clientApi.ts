export async function createRecipe(
  formData: FormData
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/recipes`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create recipe");
  }

  return response.json();
}