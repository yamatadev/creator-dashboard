import { PrismaClient, Platform, Status } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// ============================================
// DADOS DOS CRIADORES (todos fictícios)
// ============================================
const creators = [
  {
    name: "Luna Martinez",
    email: "luna@example.com",
    platform: Platform.INSTAGRAM,
    bio: "Lifestyle & fashion content creator with a focus on sustainable brands",
  },
  {
    name: "Jake Wilson",
    email: "jake@example.com",
    platform: Platform.YOUTUBE,
    bio: "Tech reviewer and gadget enthusiast. 500K+ subscribers",
  },
  {
    name: "Aria Chen",
    email: "aria@example.com",
    platform: Platform.TIKTOK,
    bio: "Dance and comedy creator. Viral content specialist",
  },
  {
    name: "Marcus Silva",
    email: "marcus@example.com",
    platform: Platform.ONLYFANS,
    bio: "Fitness coach and exclusive workout content",
  },
  {
    name: "Sophie Laurent",
    email: "sophie@example.com",
    platform: Platform.PRIVACY,
    bio: "Premium lifestyle and travel content creator",
  },
  {
    name: "Tyler Brooks",
    email: "tyler@example.com",
    platform: Platform.INSTAGRAM,
    bio: "Photography and urban exploration. Brand partnerships",
  },
  {
    name: "Mia Tanaka",
    email: "mia@example.com",
    platform: Platform.YOUTUBE,
    bio: "Cooking channel with Japanese fusion recipes",
  },
  {
    name: "Rafael Costa",
    email: "rafael@example.com",
    platform: Platform.TIKTOK,
    bio: "Brazilian humor and cultural content for global audiences",
  },
];

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// Gera datas dos últimos 6 meses, com intervalos de 1-3 dias
function generateDates(): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  for (let i = 180; i >= 0; i -= rand(1, 3)) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  return dates;
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

async function main() {
  console.log("🗑️  Limpando banco de dados...");
  await prisma.earning.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.creator.deleteMany();
  await prisma.user.deleteMany();

  // ---- CRIAR USUÁRIO ADMIN ----
  console.log("👤 Criando usuário admin...");
  const hashedPassword = await hash("admin123", 12);
  await prisma.user.create({
    data: {
      email: "admin@creatordash.com",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("   Email: admin@creatordash.com");
  console.log("   Senha: admin123\n");

  // ---- CRIAR CRIADORES COM DADOS ----
  for (const data of creators) {
    // Status aleatório (75% ativo, 25% inativo)
    const statusOptions: Status[] = [
      Status.ACTIVE,
      Status.ACTIVE,
      Status.ACTIVE,
      Status.INACTIVE,
    ];
    const status = statusOptions[rand(0, statusOptions.length - 1)];

    const creator = await prisma.creator.create({
      data: {
        name: data.name,
        email: data.email,
        platform: data.platform,
        status,
        bio: data.bio,
        avatarUrl: null,
        joinedAt: new Date(2024, rand(0, 11), rand(1, 28)),
      },
    });

    console.log(`✅ ${creator.name} (${creator.platform}) — ${status}`);

    const dates = generateDates();

    // ---- GERAR GANHOS ----
    // Cada criador começa com uma base diferente e cresce ao longo do tempo
    let baseEarning = rand(500, 5000);

    for (const date of dates) {
      // Crescimento gradual com variação realista
      baseEarning = Math.max(100, baseEarning + rand(-800, 1200));

      await prisma.earning.create({
        data: {
          amount: baseEarning,
          date,
          source: data.platform,
          creatorId: creator.id,
        },
      });
    }

    // ---- GERAR MÉTRICAS ----
    let baseFollowers = rand(1000, 80000);
    let baseViews = rand(5000, 200000);
    let baseLikes = rand(500, 20000);

    for (const date of dates) {
      // Seguidores sempre crescem (nunca diminuem)
      baseFollowers += rand(20, 800);
      // Views e likes variam mais (podem cair em alguns dias)
      baseViews = Math.max(1000, baseViews + rand(-5000, 10000));
      baseLikes = Math.max(100, baseLikes + rand(-1000, 3000));
      // Engajamento é uma porcentagem entre 1% e 15%
      const engagement = randFloat(1.0, 15.0);

      await prisma.metric.create({
        data: {
          followers: baseFollowers,
          views: baseViews,
          likes: baseLikes,
          engagement,
          date,
          creatorId: creator.id,
        },
      });
    }

    console.log(`   📊 ${dates.length} registros de dados gerados`);
  }

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log(`   ${creators.length} criadores`);
  console.log("   ~6 meses de dados por criador");
  console.log("   Login: admin@creatordash.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });