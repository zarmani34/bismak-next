import { isAxiosError } from "axios";

type ApiErrorResponse = {
  detail?: string;
  non_field_errors?: string[];
};

export function extractApiError(err: unknown): string {
  console.log(err);
  const data = isAxiosError<ApiErrorResponse>(err) ? err.response?.data : null;

  if (!data) return err instanceof Error ? err.message : "Something went wrong";

  // "detail" — general Django error e.g authentication
  if (data.detail) return data.detail;

  // // "non_field_errors" — form-level errors
  if (data.non_field_errors?.[0]) return data.non_field_errors[0];

  return "Something went wrong";
}
