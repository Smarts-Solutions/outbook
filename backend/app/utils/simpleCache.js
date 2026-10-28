// Tiny in-memory TTL cache (no external dependency).
// Used to avoid re-running expensive, repeat-heavy MySQL queries (MIS dashboard
// aggregation, role/line-manager lookups) on every near-identical request within
// a short window — these are read-mostly, reporting-style values where a few
// seconds of staleness is an acceptable trade for cutting DB load.
const store = new Map();

function getCached(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

function setCached(key, value, ttlMs) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

function makeKey(prefix, data) {
  return `${prefix}:${JSON.stringify(data)}`;
}

module.exports = { getCached, setCached, makeKey };
