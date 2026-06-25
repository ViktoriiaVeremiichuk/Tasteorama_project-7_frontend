import { Readable } from "node:stream";
import FormDataNode from "form-data";

export function logErrorResponse(errorObj: unknown): void {
  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  const reset = "\x1b[0m";

  console.log(`${green}> ${yellow}Error Response Data:${reset}`);
  console.dir(errorObj, { depth: null, colors: true });
}

const isFileField = (value: FormDataEntryValue): value is File =>
  typeof File !== "undefined" && value instanceof File;

const toTextFieldValue = async (value: FormDataEntryValue): Promise<string> => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof Blob !== "undefined" && value instanceof Blob) {
    return value.text();
  }

  return String(value);
};

const normalizeIngredientsField = (rawValue: string): string => {
  const parsed: unknown = JSON.parse(rawValue);

  if (!Array.isArray(parsed)) {
    throw new Error("Ingredients must be an array");
  }

  return JSON.stringify(parsed);
};

export async function rebuildProxyFormData(
  incomingFormData: FormData,
): Promise<FormDataNode> {
  const formData = new FormDataNode();

  for (const [key, value] of incomingFormData.entries()) {
    if (isFileField(value)) {
      const buffer = Buffer.from(await value.arrayBuffer());
      formData.append(key, buffer, {
        filename: value.name,
        contentType: value.type || "application/octet-stream",
      });
      continue;
    }

    const textValue = await toTextFieldValue(value);

    if (key === "ingredients") {
      formData.append(key, normalizeIngredientsField(textValue));
      continue;
    }

    formData.append(key, textValue);
  }

  return formData;
}

type MultipartBackendResponse = {
  status: number;
  data: unknown;
};

export async function postMultipartToBackend(
  path: string,
  incomingFormData: FormData,
  cookieHeader: string,
): Promise<MultipartBackendResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const outgoingFormData = await rebuildProxyFormData(incomingFormData);

  const response = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: {
      ...outgoingFormData.getHeaders(),
      Cookie: cookieHeader,
    },
    body: Readable.toWeb(outgoingFormData) as BodyInit,
    duplex: "half",
  } as RequestInit);

  const data = await response.json().catch(() => null);

  return { status: response.status, data };
}
