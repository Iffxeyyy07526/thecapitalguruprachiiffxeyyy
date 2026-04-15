import { redirect } from "next/navigation";
import { BillingHistoryClient } from "@/components/dashboard/BillingHistoryClient";
import { getBillingPayments } from "@/lib/dashboard/queries";

export default async function BillingPage() {
  const payments = await getBillingPayments();
  if (payments === null) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">
        Billing history
      </h1>
      <BillingHistoryClient payments={payments} />
    </div>
  );
}
