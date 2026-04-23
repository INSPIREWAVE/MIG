export type AuditLogEntry = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  timestamp: string;
  traceId?: string;
};

export const AuditLogPanel = ({ entries }: { entries: AuditLogEntry[] }) => (
  <section aria-label="Audit log with trace tracking">
    <ul>
      {entries.map((entry) => (
        <li key={entry.id}>
          <strong>{entry.actor}</strong> {entry.action} {entry.entity} @ {entry.timestamp}
          {entry.traceId ? <code> trace:{entry.traceId}</code> : null}
        </li>
      ))}
    </ul>
  </section>
);
