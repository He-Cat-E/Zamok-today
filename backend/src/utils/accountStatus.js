export const ACCOUNT_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended"
};

export function isUserSuspended(user) {
  return user?.accountStatus === ACCOUNT_STATUS.SUSPENDED;
}

export function assertUserCanAuthenticate(user) {
  if (isUserSuspended(user)) {
    const err = new Error("This account has been suspended. Contact support for assistance.");
    err.status = 403;
    err.code = "ACCOUNT_SUSPENDED";
    throw err;
  }
}

export function accountSuspendedPayload() {
  return {
    error: "This account has been suspended. Contact support for assistance.",
    code: "ACCOUNT_SUSPENDED"
  };
}
