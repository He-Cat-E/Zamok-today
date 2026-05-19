import mongoose from "mongoose";
import { User } from "../models/User.js";

const LEGACY_UNIQUE = new Set(["email_1", "phone_1"]);

/**
 * Replace legacy sparse unique indexes that treat `null` as a value (blocks multiple phone-only users).
 */
export async function ensureUserAuthIndexes() {
  const coll = mongoose.connection.collection("users");
  let indexes;
  try {
    indexes = await coll.indexes();
  } catch {
    return;
  }

  for (const idx of indexes) {
    const name = idx.name;
    if (!name || !LEGACY_UNIQUE.has(name)) continue;
    if (idx.partialFilterExpression) continue;
    try {
      await coll.dropIndex(name);
      // eslint-disable-next-line no-console
      console.log(`[db] Dropped legacy users index: ${name}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[db] Could not drop index ${name}:`, err?.message || err);
    }
  }

  const unset = await User.updateMany(
    { $or: [{ email: null }, { email: "" }] },
    { $unset: { email: "" } }
  );
  if (unset.modifiedCount > 0) {
    // eslint-disable-next-line no-console
    console.log(`[db] Cleared empty email on ${unset.modifiedCount} user(s)`);
  }

  await User.syncIndexes();
}
