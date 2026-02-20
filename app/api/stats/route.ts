import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const [
    totalCreators,
    activeCreators,
    totalEarnings,
    monthlyEarnings,
    byPlatform,
  ] = await Promise.all([
    // Total de criadores
    prisma.creator.count(),

    // Criadores ativos
    prisma.creator.count({ where: { status: "ACTIVE" } }),

    // Ganhos totais (soma de tudo)
    prisma.earning.aggregate({ _sum: { amount: true } }),

    // Ganhos dos últimos 30 dias
    prisma.earning.aggregate({
      _sum: { amount: true },
      where: {
        date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),

    // Criadores por plataforma
    prisma.creator.groupBy({
      by: ["platform"],
      _count: { id: true },
    }),
  ]);

  return NextResponse.json({
    totalCreators,
    activeCreators,
    totalEarnings: totalEarnings._sum.amount || 0,
    monthlyEarnings: monthlyEarnings._sum.amount || 0,
    byPlatform: byPlatform.map((p) => ({
      platform: p.platform,
      count: p._count.id,
    })),
  });
}