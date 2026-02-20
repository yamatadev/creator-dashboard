import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Status, Platform } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");
  const status = searchParams.get("status") as Status | null;
  const platform = searchParams.get("platform") as Platform | null;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const where: Record<string, unknown> = {};

  if (status) where.status = status;
  if (platform) where.platform = platform;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [creators, total] = await Promise.all([
    prisma.creator.findMany({
      where,
      orderBy: { joinedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { earnings: true, metrics: true } },
      },
    }),
    prisma.creator.count({ where }),
  ]);

  return NextResponse.json({
    creators,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const creator = await prisma.creator.create({
    data: {
      name: body.name,
      email: body.email,
      platform: body.platform,
      status: body.status || "ACTIVE",
      bio: body.bio,
    },
  });

  return NextResponse.json(creator, { status: 201 });
}