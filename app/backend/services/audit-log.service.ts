export type AuditLogPayload = {
  actorId: string;
  action: string;
  entityId: string;
  traceId: string;
  metadata?: Record<string, unknown>;
};

export const trackAuditLog = (payload: AuditLogPayload) => ({
  ...payload,
  createdAt: new Date().toISOString()
});
