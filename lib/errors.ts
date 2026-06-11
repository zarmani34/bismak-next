import { isAxiosError } from "axios";

type ApiErrorResponse = {
  detail?: string;
  non_field_errors?: string[];
  [field: string]: string | string[] | undefined; // field-level errors
};


export function extractApiError(err: unknown): string {
  const data = isAxiosError<ApiErrorResponse>(err) ? err.response?.data : null;

  if (!data) return err instanceof Error ? err.message : "Something went wrong";

  // "detail" — general Django error e.g. authentication, permission
  if (data.detail) return data.detail;

  // "non_field_errors" — form-level validation errors
  if (data.non_field_errors?.[0]) return data.non_field_errors[0];

  // field-level errors e.g. { email: ["already registered"] }
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (Array.isArray(val) && val.length > 0) {
      return `${val[0]}`;
    }
    if (typeof val === "string") {
      return `${val}`;
    }
  }

  return "Something went wrong";
}