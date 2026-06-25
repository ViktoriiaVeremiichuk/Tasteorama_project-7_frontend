export function logErrorResponse(errorObj: unknown): void {
  const green = '\x1b[32m';
  const yellow = '\x1b[33m';
  const reset = '\x1b[0m';

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

export async function rebuildProxyFormData(
  incomingFormData: FormData,
): Promise<FormData> {
  const formData = new FormData();

  for (const [key, value] of incomingFormData.entries()) {
    if (isFileField(value)) {
      formData.append(key, value, value.name);
      continue;
    }

    formData.append(key, await toTextFieldValue(value));
  }

  return formData;
}