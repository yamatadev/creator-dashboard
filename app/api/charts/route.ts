import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Busca ganhos dos últimos 6 meses agrupados por mês
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const earnings = await prisma.earning.findMany({
    where: { date: { gte: sixMonthsAgo } },
    select: { amount: true, date: true },
    orderBy: { date: "asc" },
  });

  // Agrupar por mês
  const monthlyData: Record<string, number> = {};
  earnings.forEach((e) => {
    const key = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, "0")}`;
    monthlyData[key] = (monthlyData[key] || 0) + e.amount;
  });

  const revenueByMonth = Object.entries(monthlyData)
    .map(([month, total]) => ({
      month,
      total: Math.round(total),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Top criadores por ganhos totais
  const topCreators = await prisma.creator.findMany({
    where: { status: "ACTIVE" },
    include: {
      earnings: {
        where: { date: { gte: sixMonthsAgo } },
        select: { amount: true },
      },
    },
  });

  const topByEarnings = topCreators
    .map((c) => ({
      name: c.name,
      platform: c.platform,
      total: Math.round(c.earnings.reduce((sum, e) => sum + e.amount, 0)),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return NextResponse.json({
    revenueByMonth,
    topCreators: topByEarnings,
  });
}