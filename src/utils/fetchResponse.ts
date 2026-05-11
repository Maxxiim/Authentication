type Path = "login" | "registration";

export async function fetchResponse<T, B>(
  url: string,
  path: Path,
  method: "POST" | "GET" | "PATCH",
  data: B,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${url}/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    ...options,
  });

  const responseData = await response.json();

  if (!response.ok) {
    return responseData;
  }

  return responseData;
}
