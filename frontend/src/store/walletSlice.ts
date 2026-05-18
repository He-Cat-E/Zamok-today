import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { WalletData, WalletTransaction } from "@/lib/walletApi";
import * as walletApi from "@/lib/walletApi";
import { PRIMARY_WALLET_CURRENCY } from "@/lib/walletCurrency";

export type WalletStatus = "idle" | "loading" | "loaded" | "error";

type WalletState = {
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
  status: WalletStatus;
  addFundsStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: WalletState = {
  balance: 0,
  currency: PRIMARY_WALLET_CURRENCY,
  transactions: [],
  status: "idle",
  addFundsStatus: "idle",
  error: null
};

export const fetchWallet = createAsyncThunk(
  "wallet/fetch",
  async (_void: void | undefined, { rejectWithValue }) => {
    try {
      return await walletApi.fetchMyWallet();
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "Failed to load wallet");
    }
  }
);

export type AddFundsPayload = {
  amount: number;
  cardNumber: string;
  expiry: string;
  cvc: string;
  holderName: string;
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
};

export const addFunds = createAsyncThunk(
  "wallet/addFunds",
  async (body: AddFundsPayload, { rejectWithValue }) => {
    try {
      return await walletApi.addWalletFunds(body);
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "Payment failed");
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearWalletError(state) {
      state.error = null;
    },
    resetAddFundsStatus(state) {
      state.addFundsStatus = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.status = "loaded";
        applyWalletPayload(state, action.payload.wallet, action.payload.transactions);
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.status = "error";
        state.error = (action.payload as string) || "Failed to load wallet";
      })
      .addCase(addFunds.pending, (state) => {
        state.addFundsStatus = "loading";
        state.error = null;
      })
      .addCase(addFunds.fulfilled, (state, action) => {
        state.addFundsStatus = "succeeded";
        const newTx = action.payload.transaction;
        const rest = state.transactions.filter((t) => t.id !== newTx.id);
        applyWalletPayload(state, action.payload.wallet, [newTx, ...rest]);
      })
      .addCase(addFunds.rejected, (state, action) => {
        state.addFundsStatus = "failed";
        state.error = (action.payload as string) || "Payment failed";
      });
  }
});

function applyWalletPayload(
  state: WalletState,
  wallet: WalletData,
  transactions: WalletTransaction[]
) {
  state.balance = wallet.balance;
  state.currency = PRIMARY_WALLET_CURRENCY;
  state.transactions = transactions.map((tx) => ({
    ...tx,
    currency: PRIMARY_WALLET_CURRENCY
  }));
}

export const { clearWalletError, resetAddFundsStatus } = walletSlice.actions;
export const walletReducer = walletSlice.reducer;
