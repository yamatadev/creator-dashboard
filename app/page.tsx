import { StatsCards } from "@/components/stats-cards";
import { RevenueChart } from "@/components/revenue-chart";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Dashboard</h2>
        <p className="text-slate-500 mt-1 text-sm">Overview of your creator network</p>
      </div>

      <StatsCards />

      <div className="mt-6">
        <RevenueChart />
      </div>
    </div>
  );
}
