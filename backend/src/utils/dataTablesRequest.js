/**
 * Parse DataTables server-side params from query (GET) or body (POST).
 * Supports DataTables 1.x bracket notation and DataTables 2 nested objects.
 */

function pickSource(req) {
  const query = req.query && typeof req.query === "object" ? req.query : {};
  const body = req.body && typeof req.body === "object" ? req.body : {};
  return { ...query, ...body };
}

function parseIntSafe(value, fallback) {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

function readSearchValue(source) {
  if (source.search && typeof source.search === "object") {
    return String(source.search.value ?? "").trim();
  }
  return String(source["search[value]"] ?? "").trim();
}

function readOrder(source) {
  if (Array.isArray(source.order) && source.order.length > 0) {
    const first = source.order[0];
    return {
      columnIndex: parseIntSafe(first.column, 0),
      dir: String(first.dir ?? "desc").toLowerCase() === "asc" ? "asc" : "desc"
    };
  }

  return {
    columnIndex: parseIntSafe(source["order[0][column]"], 0),
    dir: String(source["order[0][dir]"] ?? "desc").toLowerCase() === "asc" ? "asc" : "desc"
  };
}

function readColumnData(source, columnIndex) {
  if (Array.isArray(source.columns)) {
    const col = source.columns[columnIndex];
    if (col && col.data != null && col.data !== "") {
      return String(col.data).trim();
    }
  }

  const bracket = source[`columns[${columnIndex}][data]`];
  if (bracket != null && bracket !== "") {
    return String(bracket).trim();
  }

  return "createdAt";
}

export function parseDataTablesRequest(req, { defaultLength = 10, maxLength = 100 } = {}) {
  const source = pickSource(req);

  const draw = Math.max(parseIntSafe(source.draw, 1), 1);
  const start = Math.max(parseIntSafe(source.start, 0), 0);
  const length = Math.min(
    Math.max(parseIntSafe(source.length, defaultLength), 1),
    maxLength
  );

  const searchValue = readSearchValue(source);
  const { columnIndex, dir: orderDir } = readOrder(source);
  const columnData = readColumnData(source, columnIndex);

  return {
    draw,
    start,
    length,
    searchValue,
    columnIndex,
    orderDir,
    columnData
  };
}
