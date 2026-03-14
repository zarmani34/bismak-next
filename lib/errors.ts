export function extractApiError(err: any): string {
  const data = err.response?.data;

  if (!data) return err.message ?? "Something went wrong";

  // "detail" — general Django error e.g authentication
  if (data.detail) return data.detail;

  // // "non_field_errors" — form-level errors
  if (data.non_field_errors?.[0]) return data.non_field_errors[0];

  return "Something went wrong";
}