type ApiErrorBody = {
  message?: string;
};

export async function parseApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorBody;
    return data.message ?? `Error ${response.status}`;
  } catch {
    return `Error ${response.status}`;
  }
}
