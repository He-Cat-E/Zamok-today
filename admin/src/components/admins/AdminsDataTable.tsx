"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminFormModal } from "@/components/admins/AdminFormModal";
import { UsersTableLoadingOverlay } from "@/components/users/UsersTableLoadingOverlay";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ADMIN_PAGES } from "@/config/adminPages";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import type { Config } from "datatables.net";
import { env } from "@/lib/env";
import { fetchDataTablesJson, type DataTablesServerParams } from "@/lib/dataTablesAjax";
import {
  setAdminAccountStatus,
  type AccountStatus,
  type AdminAccountRow
} from "@/lib/adminApi";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useI18n, useT } from "@/i18n/I18nProvider";
import "datatables.net-dt/css/dataTables.dataTables.css";

DataTable.use(DT);

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

function pageLabelsForRow(row: AdminAccountRow, t: (key: string) => string) {
  if (row.isSuperAdmin) return t("admins.role.superAdmin");
  return (row.permissions || [])
    .map((key) => {
      const page = ADMIN_PAGES.find((p) => p.key === key);
      return page ? t(page.labelKey) : key;
    })
    .join(", ");
}

export function AdminsDataTable() {
  const { lang } = useI18n();
  const t = useT();
  const { admin: currentAdmin } = useAdminAuth();
  const canManage = Boolean(currentAdmin?.canManageAdmins);

  const [loading, setLoading] = useState(true);
  const [tableVersion, setTableVersion] = useState(0);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<AdminAccountRow | null>(null);
  const [statusBusy, setStatusBusy] = useState(false);
  const [suspendConfirm, setSuspendConfirm] = useState<{
    adminId: string;
    adminName: string;
  } | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<Map<string, AdminAccountRow>>(new Map());

  const labels = useMemo(
    () => ({
      name: t("table.name"),
      email: t("table.email"),
      role: t("page.dashboard.role"),
      account: t("users.accountStatus.label"),
      pages: t("admins.table.pages"),
      registered: t("table.registered"),
      actions: t("table.actions"),
      active: t("users.accountStatus.active"),
      suspended: t("users.accountStatus.suspended"),
      superAdmin: t("admins.role.superAdmin"),
      adminRole: t("admins.role.admin"),
      edit: t("admins.actions.edit"),
      suspend: t("users.actions.suspend"),
      unsuspend: t("users.actions.unsuspend"),
      create: t("admins.actions.createAdmin"),
      suspendTitle: t("admins.actions.suspendTitle"),
      suspendConfirm: t("admins.actions.suspendConfirm"),
      cancel: t("common.cancel"),
      pleaseWait: t("login.wait"),
      close: t("users.wallet.close"),
      statusError: t("users.actions.statusError"),
      empty: t("admins.table.empty"),
      noResults: t("admins.table.noResults"),
      info: t("admins.table.info"),
      infoEmpty: t("admins.table.infoEmpty"),
      infoFiltered: t("admins.table.infoFiltered"),
      search: t("admins.table.search"),
      lengthMenu: t("admins.table.lengthMenu"),
      processing: t("admins.table.processing"),
      dash: "—",
      self: t("admins.table.self")
    }),
    [t]
  );

  const applyAccountStatus = useCallback(
    async (adminId: string, next: AccountStatus) => {
      setStatusBusy(true);
      setConfirmError(null);
      try {
        await setAdminAccountStatus(adminId, next);
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
    if (!el || !canManage || statusBusy) return;

    function onClick(e: MouseEvent) {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-dt-action]");
      if (!btn || btn.disabled) return;
      e.preventDefault();

      const action = btn.dataset.dtAction;
      const adminId = btn.dataset.adminId || "";
      const row = rowsRef.current.get(adminId);
      const adminName = btn.dataset.adminName || "";
      const accountStatus = (btn.dataset.accountStatus || "active") as AccountStatus;

      if (!adminId) return;

      if (action === "edit" && row) {
        setEditTarget(row);
        setFormMode("edit");
        return;
      }

      if (action === "toggle-status") {
        if (accountStatus === "suspended") {
          void applyAccountStatus(adminId, "active");
          return;
        }
        setConfirmError(null);
        setSuspendConfirm({ adminId, adminName });
      }
    }

    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [applyAccountStatus, canManage, statusBusy]);

  const columns = useMemo(
    () => [
      {
        data: "fullName",
        orderable: true,
        className: "font-medium",
        render: (data: string, type: string, row: AdminAccountRow) => {
          if (type !== "display") return data;
          const name = escapeHtml(String(data || "").trim() || labels.dash);
          if (row.isSelf) {
            return `${name} <span class="zt-dt-pill">${escapeHtml(labels.self)}</span>`;
          }
          return name;
        }
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
        data: "role",
        orderable: true,
        render: (data: string, type: string) => {
          const label = data === "super_admin" ? labels.superAdmin : labels.adminRole;
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
        data: "permissions",
        orderable: false,
        render: (_data: string[], type: string, row: AdminAccountRow) => {
          const text = pageLabelsForRow(row, t);
          if (type !== "display") return text;
          return `<span class="text-zinc-600 dark:text-zinc-400">${escapeHtml(text)}</span>`;
        }
      },
      {
        data: "createdAt",
        orderable: true,
        render: (_iso: string, type: string, row: AdminAccountRow) => {
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
        render: (_data: unknown, type: string, row: AdminAccountRow) => {
          if (type !== "display" || !canManage) return "";
          if (row.isSelf || row.isSuperAdmin) return labels.dash;

          const suspended = row.accountStatus === "suspended";
          const statusLabel = suspended ? labels.unsuspend : labels.suspend;
          const nameAttr = escapeAttr(row.fullName || labels.dash);

          return `<div class="zt-dt-actions">
            <button type="button" class="zt-dt-action-btn" data-dt-action="edit" data-admin-id="${escapeAttr(row.id)}" data-admin-name="${nameAttr}">${escapeHtml(labels.edit)}</button>
            <button type="button" class="zt-dt-action-btn zt-dt-action-btn--${suspended ? "ok" : "danger"}" data-dt-action="toggle-status" data-admin-id="${escapeAttr(row.id)}" data-admin-name="${nameAttr}" data-account-status="${escapeAttr(row.accountStatus || "active")}">${escapeHtml(statusLabel)}</button>
          </div>`;
        }
      }
    ],
    [canManage, labels, t]
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
        order: [[5, "desc"]],
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
          const url = `${env.apiBaseUrl}/api/admin/admins`;
          fetchDataTablesJson<{
            draw: number;
            recordsTotal: number;
            recordsFiltered: number;
            data: AdminAccountRow[];
          }>(url, data)
            .then((json) => {
              rowsRef.current = new Map(json.data.map((row) => [row.id, row]));
              callback(json);
            })
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

  const actionCol = canManage;

  return (
    <>
      {canManage ? (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            onClick={() => {
              setEditTarget(null);
              setFormMode("create");
            }}
          >
            {labels.create}
          </button>
        </div>
      ) : null}

      <div
        ref={wrapRef}
        className="zt-datatables-wrap overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-white/5"
      >
        <div className={loading ? "zt-dt-table-host zt-dt-table-host--loading" : "zt-dt-table-host"}>
          {loading ? <UsersTableLoadingOverlay message={labels.processing} /> : null}
          <DataTable
            key={`admins-dt-${lang}-${tableVersion}`}
            options={options}
            className="display w-full text-sm"
            onProcessing={(_e: unknown, _settings: unknown, show: boolean) => setLoading(Boolean(show))}
            onPreXhr={() => setLoading(true)}
          >
            <thead>
              <tr>
                <th>{labels.name}</th>
                <th>{labels.email}</th>
                <th>{labels.role}</th>
                <th>{labels.account}</th>
                <th>{labels.pages}</th>
                <th>{labels.registered}</th>
                {actionCol ? <th>{labels.actions}</th> : null}
              </tr>
            </thead>
          </DataTable>
        </div>
      </div>

      {formMode ? (
        <AdminFormModal
          mode={formMode}
          admin={formMode === "edit" ? editTarget : null}
          onClose={() => {
            setFormMode(null);
            setEditTarget(null);
          }}
          onSaved={() => setTableVersion((v) => v + 1)}
        />
      ) : null}

      <ConfirmModal
        open={suspendConfirm !== null}
        title={labels.suspendTitle}
        message={labels.suspendConfirm.replace("{name}", suspendConfirm?.adminName ?? "")}
        confirmLabel={labels.suspend}
        cancelLabel={labels.cancel}
        closeLabel={labels.close}
        loadingLabel={labels.pleaseWait}
        variant="danger"
        loading={statusBusy}
        error={confirmError}
        onConfirm={() => {
          if (!suspendConfirm) return;
          void applyAccountStatus(suspendConfirm.adminId, "suspended");
        }}
        onCancel={closeSuspendConfirm}
      />
    </>
  );
}
