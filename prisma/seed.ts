import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const INITIAL_CATEGORIES = [
  { name: "예적금", color: "emerald" },
  { name: "주식/투자", color: "indigo" },
  { name: "부동산", color: "amber" },
  { name: "현금", color: "cyan" },
  { name: "기타/암호화폐", color: "violet" },
] as const;

async function main() {
  console.log("기본 카테고리 5종 시딩 시작...");

  for (const cat of INITIAL_CATEGORIES) {
    const upserted = await prisma.category.upsert({
      where: { name: cat.name },
      update: { color: cat.color },
      create: {
        name: cat.name,
        color: cat.color,
      },
    });
    console.log(`- [${upserted.id}] ${upserted.name} (color: ${upserted.color})`);
  }

  console.log("기본 카테고리 시딩이 완료되었습니다.");
}

main()
  .catch((e) => {
    console.error("시딩 중 오류 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

