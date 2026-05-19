"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UsersTableLoadingOverlay } from "@/components/users/UsersTableLoadingOverlay";
import { UserWalletModal } from "@/components/users/UserWalletModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import type { Config } from "datatables.net";
import { env } from "@/lib/env";
import { fetchDataTablesJson, type DataTablesServerParams } from "@/lib/dataTablesAjax";
import { setAdminUserAccountStatus, type AccountStatus } from "@/lib/adminApi";
import { useI18n, useT } from "@/i18n/I18nProvider";
import "datatables.net-dt/css/dataTables.dataTables.css";

DataTable.use(DT);

export type AdminUserRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  authMethod: "email" | "phone";
  emailVerified: boolean;
  phoneVerified: boolean;
  verificationStatus: "verified" | "unverified";
  accountStatus: AccountStatus;
  createdAt: string;
  createdAtDisplay: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

export function UsersDataTable() {
  const { lang } = useI18n();
  const t = useT();
  const [loading, setLoading] = useState(true);
  const [tableVersion, setTableVersion] = useState(0);
  const [walletTarget, setWalletTarget] = useState<{ id: string; name: string } | null>(null);
  const [statusBusy, setStatusBusy] = useState(false);
  const [suspendConfirm, setSuspendConfirm] = useState<{ userId: string; userName: string } | null>(
    null
  );
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const labels = useMemo(
    () => ({
      name: t("table.name"),
      email: t("table.email"),
      phone: t("table.phone"),
      authMethod: t("table.authMethod"),
      account: t("users.accountStatus.label"),
      verification: t("users.verification.label"),
      registered: t("table.registered"),
      actions: t("table.actions"),
      authPhone: t("users.authMethod.phone"),
      authEmail: t("users.authMethod.email"),
      verified: t("users.status.verified"),
      unverified: t("users.status.unverified"),
      active: t("users.accountStatus.active"),
      suspended: t("users.accountStatus.suspended"),
      viewWallet: t("users.actions.viewWallet"),
      suspend: t("users.actions.suspend"),
      unsuspend: t("users.actions.unsuspend"),
      suspendTitle: t("users.actions.suspendTitle"),
      suspendConfirm: t("users.actions.suspendConfirm"),
      cancel: t("common.cancel"),
      pleaseWait: t("login.wait"),
      close: t("users.wallet.close"),
      statusUpdated: t("users.actions.statusUpdated"),
      statusError: t("users.actions.statusError"),
      empty: t("users.table.empty"),
      noResults: t("users.table.noResults"),
      info: t("users.table.info"),
      infoEmpty: t("users.table.infoEmpty"),
      infoFiltered: t("users.table.infoFiltered"),
      search: t("users.table.search"),
      lengthMenu: t("users.table.lengthMenu"),
      processing: t("users.table.processing"),
      dash: "—"
    }),
    [t]
  );

  const applyAccountStatus = useCallback(
    async (userId: string, next: AccountStatus) => {
      setStatusBusy(true);
      setConfirmError(null);
      try {
        await setAdminUserAccountStatus(userId, next);
        setTableVersion((v) => v + 1);
        setSuspendConfirm(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : labels.statusError;
        if (suspendConfirm) {
          setConfirmError(message);
        } else {
          window.alert(message);
        }
      } finally {
        setStatusBusy(false);
      }
    },
    [labels.statusError, suspendConfirm]
  );

  const closeSuspendConfirm = useCallback(() => {
    if (statusBusy) return;
    setSuspendConfirm(null);
    setConfirmError(null);
  }, [statusBusy]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || statusBusy) return;

    function onClick(e: MouseEvent) {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-dt-action]");
      if (!btn || btn.disabled) return;
      e.preventDefault();

      const action = btn.dataset.dtAction;
      const userId = btn.dataset.userId || "";
      const userName = btn.dataset.userName || "";
      const accountStatus = (btn.dataset.accountStatus || "active") as AccountStatus;

      if (!userId) return;

      if (action === "wallet") {
        setWalletTarget({ id: userId, name: userName });
        return;
      }

      if (action === "toggle-status") {
        if (accountStatus === "suspended") {
          void applyAccountStatus(userId, "active");
          return;
        }
        setConfirmError(null);
        setSuspendConfirm({ userId, userName });
      }
    }

    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [applyAccountStatus, statusBusy]);

  const columns = useMemo(
    () => [
      {
        data: "fullName",
        orderable: true,
        className: "font-medium"
      },
      {
        data: "email",
        orderable: true,
        defaultContent: labels.dash,
        render: (data: string) => {
          const v = String(data || "").trim();
          return v ? escapeHtml(v) : labels.dash;
        }
      },
      {
        data: "phone",
        orderable: true,
        defaultContent: labels.dash,
        render: (_phone: string, type: string, row: AdminUserRow) => {
          if (type !== "display") return row.phone || "";
          const v = row.phoneDisplay?.trim();
          return v ? escapeHtml(v) : labels.dash;
        }
      },
      {
        data: "authMethod",
        orderable: true,
        render: (data: string, type: string) => {
          const label = data === "phone" ? labels.authPhone : labels.authEmail;
          if (type !== "display") return label;
          return `<span class="zt-dt-pill">${escapeHtml(label)}</span>`;
        }
      },
      {
        data: "accountStatus",
        orderable: true,
        render: (data: string, type: string) => {
          const suspended = data === "suspended";
          const label = suspended ? labels.suspended : labels.active;
          if (type !== "display") return label;
          return `<span class="zt-dt-badge ${suspended ? "zt-dt-badge--danger" : "zt-dt-badge--ok"}">${escapeHtml(label)}</span>`;
        }
      },
      {
        data: "verificationStatus",
        orderable: false,
        render: (data: string, type: string) => {
          const verified = data === "verified";
          const label = verified ? labels.verified : labels.unverified;
          if (type !== "display") return label;
          return `<span class="zt-dt-badge ${verified ? "zt-dt-badge--ok" : "zt-dt-badge--warn"}">${escapeHtml(label)}</span>`;
        }
      },
      {
        data: "createdAt",
        orderable: true,
        render: (_iso: string, type: string, row: AdminUserRow) => {
          if (type !== "display") return row.createdAt;
          return row.createdAtDisplay ? escapeHtml(row.createdAtDisplay) : labels.dash;
        }
      },
      {
        data: null,
        orderable: false,
        searchable: false,
        className: "zt-dt-actions-col",
        defaultContent: "",
        render: (_data: unknown, type: string, row: AdminUserRow) => {
          if (type !== "display") return "";
          const suspended = row.accountStatus === "suspended";
          const statusLabel = suspended ? labels.unsuspend : labels.suspend;
          const nameAttr = escapeAttr(row.fullName || labels.dash);
          return `<div class="zt-dt-actions">
            <button type="button" class="zt-dt-action-btn" data-dt-action="wallet" data-user-id="${escapeAttr(row.id)}" data-user-name="${nameAttr}">${escapeHtml(labels.viewWallet)}</button>
            <button type="button" class="zt-dt-action-btn zt-dt-action-btn--${suspended ? "ok" : "danger"}" data-dt-action="toggle-status" data-user-id="${escapeAttr(row.id)}" data-user-name="${nameAttr}" data-account-status="${escapeAttr(row.accountStatus || "active")}">${escapeHtml(statusLabel)}</button>
          </div>`;
        }
      }
    ],
    [labels]
  );

  const options = useMemo(
    () =>
      ({
        serverSide: true,
        processing: false,
        responsive: false,
        autoWidth: false,
        searching: true,
        ordering: true,
        orderMulti: false,
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        searchDelay: 350,
        order: [[6, "desc"]],
        layout: {
          topStart: "pageLength",
          topEnd: "search",
          bottomStart: "info",
          bottomEnd: "paging"
        },
        language: {
          emptyTable: labels.empty,
          zeroRecords: labels.noResults,
          info: labels.info,
          infoEmpty: labels.infoEmpty,
          infoFiltered: labels.infoFiltered,
          search: "",
          searchPlaceholder: labels.search,
          lengthMenu: labels.lengthMenu,
          paginate: {
            first: "«",
            last: "»",
            next: "›",
            previous: "‹"
          }
        },
        ajax: (data: DataTablesServerParams, callback) => {
          const usersUrl = `${env.apiBaseUrl}/api/admin/users`;
          fetchDataTablesJson<{
            draw: number;
            recordsTotal: number;
            recordsFiltered: number;
            data: AdminUserRow[];
          }>(usersUrl, data)
            .then((json) => callback(json))
            .catch(() => {
              callback({
                draw: data.draw ?? 1,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
              });
            });
        },
        columns
      }) as Config,
    [columns, labels]
  );

  return (
    <>
      <div
        ref={wrapRef}
        className="zt-datatables-wrap overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-white/5"
      >
        <div className={loading ? "zt-dt-table-host zt-dt-table-host--loading" : "zt-dt-table-host"}>
          {loading ? <UsersTableLoadingOverlay message={labels.processing} /> : null}
          <DataTable
            key={`users-dt-${lang}-${tableVersion}`}
            options={options}
            className="display w-full text-sm"
            onProcessing={(_e: unknown, _settings: unknown, show: boolean) => setLoading(Boolean(show))}
            onPreXhr={() => setLoading(true)}
          >
            <thead>
              <tr>
                <th>{labels.name}</th>
                <th>{labels.email}</th>
                <th>{labels.phone}</th>
                <th>{labels.authMethod}</th>
                <th>{labels.account}</th>
                <th>{labels.verification}</th>
                <th>{labels.registered}</th>
                <th>{labels.actions}</th>
              </tr>
            </thead>
          </DataTable>
        </div>
      </div>

      {walletTarget ? (
        <UserWalletModal
          userId={walletTarget.id}
          userName={walletTarget.name}
          onClose={() => setWalletTarget(null)}
        />
      ) : null}

      <ConfirmModal
        open={suspendConfirm !== null}
        title={labels.suspendTitle}
        message={labels.suspendConfirm.replace("{name}", suspendConfirm?.userName ?? "")}
        confirmLabel={labels.suspend}
        cancelLabel={labels.cancel}
        closeLabel={labels.close}
        loadingLabel={labels.pleaseWait}
        variant="danger"
        loading={statusBusy}
        error={confirmError}
        onConfirm={() => {
          if (!suspendConfirm) return;
          void applyAccountStatus(suspendConfirm.userId, "suspended");
        }}
        onCancel={closeSuspendConfirm}
      />
    </>
  );
}
