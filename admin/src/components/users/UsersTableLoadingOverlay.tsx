"use client";

type UsersTableLoadingOverlayProps = {
  message: string;
};

const SKELETON_ROWS = 6;

export function UsersTableLoadingOverlay({ message }: UsersTableLoadingOverlayProps) {
  return (
    <div
      className="zt-dt-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message}
    >
      <div className="zt-dt-loading-card">
        <span className="zt-dt-spinner" aria-hidden />
        <p className="zt-dt-loading-text">{message}</p>
      </div>
      <div className="zt-dt-skeleton" aria-hidden>
        {Array.from({ length: SKELETON_ROWS }, (_, row) => (
          <div key={row} className="zt-dt-skeleton-row">
            <span className="zt-dt-skeleton-cell zt-dt-skeleton-cell--wide" />
            <span className="zt-dt-skeleton-cell" />
            <span className="zt-dt-skeleton-cell" />
            <span className="zt-dt-skeleton-cell zt-dt-skeleton-cell--narrow" />
            <span className="zt-dt-skeleton-cell zt-dt-skeleton-cell--narrow" />
            <span className="zt-dt-skeleton-cell" />
          </div>
        ))}
      </div>
    </div>
  );
}
