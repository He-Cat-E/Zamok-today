import mongoose from "mongoose";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { User } from "../models/User.js";
import { parseDataTablesRequest } from "../utils/dataTablesRequest.js";
import { ACCOUNT_STATUS } from "../utils/accountStatus.js";
import {
  getOrCreateWalletForUser,
  listWalletTransactions
} from "../services/wallet.service.js";

const SORTABLE_FIELDS = new Set([
  "fullName",
  "email",
  "phone",
  "authMethod",
  "accountStatus",
  "createdAt",
  "updatedAt",
  "verificationStatus"
]);

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatPhoneDisplay(digits) {
  const d = String(digits || "").replace(/\D/g, "");
  if (!d) return "";
  try {
    const parsed = parsePhoneNumberFromString(`+${d}`);
    if (parsed?.isValid()) return parsed.formatInternational();
  } catch {
    // fall through
  }
  return `+${d}`;
}

function verificationStatus(user) {
  if (user.authMethod === "phone") {
    return user.phoneVerified ? "verified" : "unverified";
  }
  return user.emailVerified !== false ? "verified" : "unverified";
}

function userToRow(doc) {
  const email = String(doc.email || "").trim();
  const phone = String(doc.phone || "").trim();
  return {
    id: String(doc._id),
    fullName: String(doc.fullName || "").trim(),
    email,
    phone,
    phoneDisplay: formatPhoneDisplay(phone),
    authMethod: doc.authMethod === "phone" ? "phone" : "email",
    emailVerified: doc.emailVerified !== false,
    phoneVerified: doc.phoneVerified === true,
    verificationStatus: verificationStatus(doc),
    accountStatus:
      doc.accountStatus === ACCOUNT_STATUS.SUSPENDED
        ? ACCOUNT_STATUS.SUSPENDED
        : ACCOUNT_STATUS.ACTIVE,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
    createdAtDisplay: doc.createdAt
      ? new Date(doc.createdAt).toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short"
        })
      : ""
  };
}

/**
 * DataTables server-side processing for customer users.
 */
export async function listUsersDataTable(req, res) {
  try {
    const { draw, start, length, searchValue, orderDir, columnData } =
      parseDataTablesRequest(req);

    const sortField = SORTABLE_FIELDS.has(columnData) ? columnData : "createdAt";
    const mongoSortDir = orderDir === "asc" ? 1 : -1;

    const filter = {};
    if (searchValue) {
      const re = new RegExp(escapeRegex(searchValue), "i");
      filter.$or = [
        { fullName: re },
        { email: re },
        { phone: re },
        { authMethod: re }
      ];
    }

    const recordsTotal = await User.countDocuments();
    const recordsFiltered = searchValue ? await User.countDocuments(filter) : recordsTotal;

    const docs = await User.find(filter)
      .sort({ [sortField]: mongoSortDir })
      .skip(start)
      .limit(length)
      .lean();

    return res.json({
      draw,
      recordsTotal,
      recordsFiltered,
      data: docs.map(userToRow)
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[admin] list users:", err?.message || err);
    return res.status(500).json({ error: "Could not load users" });
  }
}

function normalizeAccountStatus(value) {
  return value === ACCOUNT_STATUS.SUSPENDED
    ? ACCOUNT_STATUS.SUSPENDED
    : ACCOUNT_STATUS.ACTIVE;
}

export async function getUserWallet(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await User.findById(id).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const wallet = await getOrCreateWalletForUser(id);
    const transactions = await listWalletTransactions(id, 20);

    return res.json({
      user: {
        id: String(user._id),
        fullName: String(user.fullName || "").trim(),
        email: String(user.email || "").trim(),
        phone: formatPhoneDisplay(user.phone),
        accountStatus: normalizeAccountStatus(user.accountStatus)
      },
      wallet: wallet.toPublicJSON(),
      transactions: transactions.map((tx) => tx.toPublicJSON())
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[admin] get user wallet:", err?.message || err);
    return res.status(500).json({ error: "Could not load wallet" });
  }
}

export async function updateUserAccountStatus(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const status = normalizeAccountStatus(req.body?.status);
    const suspendedAt = status === ACCOUNT_STATUS.SUSPENDED ? new Date() : null;

    const user = await User.findByIdAndUpdate(
      id,
      { accountStatus: status, suspendedAt },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      user: {
        id: String(user._id),
        fullName: user.getFullName(),
        accountStatus: user.accountStatus
      }
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[admin] update account status:", err?.message || err);
    const message =
      err?.name === "ValidationError"
        ? Object.values(err.errors || {})
            .map((e) => e?.message)
            .filter(Boolean)
            .join(" ") || "Validation failed"
        : "Could not update account status";
    return res.status(500).json({ error: message });
  }
}
