import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthUser } from "@/lib/authApi";
import * as authApi from "@/lib/authApi";

export type AuthStatus = "idle" | "loading" | "authenticated" | "anonymous";

type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null
};

export const fetchAuthUser = createAsyncThunk("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const { user } = await authApi.authMe();
    return user;
  } catch {
    return rejectWithValue(null);
  }
});

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    body: { identifier: string; password: string; rememberMe?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const { user } = await authApi.authLogin(body);
      return user;
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    body: { fullName: string; email: string; password: string; confirmPassword: string },
    { rejectWithValue }
  ) => {
    try {
      return await authApi.authRegister(body);
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "Registration failed");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authApi.authLogout();
});

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token: string, { rejectWithValue }) => {
    try {
      const { user } = await authApi.authVerifyEmail(token);
      return user;
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "Verification failed");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    body: { fullName: string; nationalId?: string; dateOfBirth?: string },
    { rejectWithValue }
  ) => {
    try {
      const { user } = await authApi.authUpdateProfile(body);
      return user;
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "Could not update profile");
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerification",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.authResendVerification();
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "Could not resend email");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
      })
      .addCase(fetchAuthUser.rejected, (state) => {
        state.user = null;
        state.status = "anonymous";
      })
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = "authenticated";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = (action.payload as string) || "Registration failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "anonymous";
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
      })
      .addCase(resendVerificationEmail.fulfilled, () => {})
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { clearAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;
