/**
 * DataTables 2 server-side request → query string the backend understands.
 */
export type DataTablesServerParams = {
  draw?: number;
  start?: number;
  length?: number;
  search?: { value?: string; regex?: boolean };
  order?: Array<{ column?: number; dir?: string }>;
  columns?: Array<{ data?: string; name?: string; searchable?: boolean; orderable?: boolean }>;
};

export function buildDataTablesQuery(params: DataTablesServerParams): string {
  const qs = new URLSearchParams();

  qs.set("draw", String(params.draw ?? 1));
  qs.set("start", String(params.start ?? 0));
  qs.set("length", String(params.length ?? 10));

  const searchValue = String(params.search?.value ?? "").trim();
  if (searchValue) {
    qs.set("search[value]", searchValue);
    qs.set("search[regex]", String(params.search?.regex ?? false));
  }

  const order = params.order?.[0];
  if (order) {
    qs.set("order[0][column]", String(order.column ?? 0));
    qs.set("order[0][dir]", order.dir === "asc" ? "asc" : "desc");
  }

  params.columns?.forEach((col, index) => {
    if (col.data != null && col.data !== "") {
      qs.set(`columns[${index}][data]`, String(col.data));
    }
    qs.set(`columns[${index}][searchable]`, String(col.searchable !== false));
    qs.set(`columns[${index}][orderable]`, String(col.orderable !== false));
  });

  return qs.toString();
}

export async function fetchDataTablesJson<T>(
  url: string,
  params: DataTablesServerParams
): Promise<T> {
  const query = buildDataTablesQuery(params);
  const res = await fetch(`${url}?${query}`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" }
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}
