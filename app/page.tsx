import { StatsCards } from "@/components/stats-cards";
import { RevenueChart } from "@/components/revenue-chart";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Overview of your creator network</p>
      </div>

      <StatsCards />

      <div className="mt-8">
        <RevenueChart />
      </div>
    </div>
  );
}