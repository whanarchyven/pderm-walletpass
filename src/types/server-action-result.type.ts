export interface ServerActionResult {
  status: "ok" | "error";
  errorMessage?: string;
}
