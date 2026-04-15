"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { BillingPaymentRow } from "@/lib/dashboard/types";

const PAGE_SIZE = 10;

function statusBadgeVariant(
  status: string
): "success" | "danger" | "warning" {
  const s = status.toLowerCase();
  if (s === "success") return "success";
  if (s === "pending") return "warning";
  return "danger";
}

function statusLabel(status: string) {
  const s = status.toLowerCase();
  if (s === "success") return "Success";
  if (s === "pending") return "Pending";
  if (s === "failed") return "Failed";
  return status;
}

function invoiceHref(paymentId: string | null) {
  if (!paymentId) return "#";
  return `https://razorpay.com/payments/${paymentId}`;
}

export function BillingHistoryClient({
  payments,
}: {
  payments: BillingPaymentRow[];
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(payments.length / PAGE_SIZE));

  const slice = useMemo(() => {
    const start = page * PAGE_SIZE;
    return payments.slice(start, start + PAGE_SIZE);
  }, [payments, page]);

  if (payments.length === 0) {
    return (
      <Card padding="lg" className="border-white/10">
        <p className="py-8 text-center text-sm text-secondary">
          No payment history yet.
        </p>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-outline-variant/40">
              <th className="py-3 pr-3 text-left font-label text-xs uppercase tracking-wider text-secondary">
                Date
              </th>
              <th className="py-3 pr-3 text-left font-label text-xs uppercase tracking-wider text-secondary">
                Plan name
              </th>
              <th className="py-3 pr-3 text-left font-label text-xs uppercase tracking-wider text-secondary">
                Amount
              </th>
              <th className="py-3 pr-3 text-left font-label text-xs uppercase tracking-wider text-secondary">
                Payment ID
              </th>
              <th className="py-3 pr-3 text-left font-label text-xs uppercase tracking-wider text-secondary">
                Status
              </th>
              <th className="py-3 text-left font-label text-xs uppercase tracking-wider text-secondary">
                Invoice
              </th>
            </tr>
          </thead>
          <tbody>
            {slice.map((p) => (
              <tr
                key={p.id}
                className="border-b border-white/[0.06] last:border-0"
              >
                <td className="py-4 pr-3 text-secondary">
                  {new Date(p.created_at).toLocaleDateString("en-IN", {
                    dateStyle: "medium",
                  })}
                </td>
                <td className="py-4 pr-3 font-medium text-white">
                  {p.plan_name}
                </td>
                <td className="py-4 pr-3 font-semibold text-white">
                  ₹{(p.amount / 100).toLocaleString("en-IN")}
                </td>
                <td className="py-4 pr-3 font-mono text-xs text-outline-variant">
                  {p.razorpay_payment_id || "—"}
                </td>
                <td className="py-4 pr-3">
                  <Badge variant={statusBadgeVariant(p.status)}>
                    {statusLabel(p.status)}
                  </Badge>
                </td>
                <td className="py-4">
                  {p.razorpay_payment_id ? (
                    <a
                      href={invoiceHref(p.razorpay_payment_id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-label text-xs font-semibold text-primary hover:underline"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-outline-variant">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length > PAGE_SIZE ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
          <p className="text-xs text-secondary">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() =>
                setPage((p) => Math.min(totalPages - 1, p + 1))
              }
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
