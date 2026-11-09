"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type {
  ActionResult,
  AssetItem,
  CategoryItem,
  CategorySummary,
  CreateAssetInput,
  DashboardData,
} from "@/lib/formatters";

const DEFAULT_CATEGORIES: Array<{ name: string; color: string }> = [
  { name: "예적금", color: "emerald" },
  { name: "주식/투자", color: "indigo" },
  { name: "부동산", color: "amber" },
  { name: "현금", color: "cyan" },
  { name: "기타/암호화폐", color: "violet" },
];

function safeRevalidateHome() {
  try {
    revalidatePath("/");
  } catch {
    // Next.js 요청 컨텍스트 외부(독립 검증 스크립트 등)에서 호출된 경우 무시
  }
}

/**
 * 카테고리 목록 조회 및 초기 5대 기본 카테고리 자동 시딩 보장 (Task 2.5)
 */
export async function getCategories(): Promise<CategoryItem[]> {
  let categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
    select: { id: true, name: true, color: true },
  });

  if (categories.length === 0) {
    for (const cat of DEFAULT_CATEGORIES) {
      await prisma.category.upsert({
        where: { name: cat.name },
        update: { color: cat.color },
        create: { name: cat.name, color: cat.color },
      });
    }
    categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true, color: true },
    });
  }

  return categories;
}

/**
 * 대시보드 렌더링에 필요한 종합 데이터를 단일 트랜잭션으로 조회 (Task 2.2)
 */
export async function getDashboardData(): Promise<DashboardData> {
  const [rawCategories, rawAssets] = await prisma.$transaction([
    prisma.category.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true, color: true },
    }),
    prisma.asset.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    }),
  ]);

  const categories =
    rawCategories.length > 0 ? rawCategories : await getCategories();

  const assets: AssetItem[] = rawAssets.map((item) => ({
    id: item.id,
    title: item.title,
    amount: Number(item.amount),
    memo: item.memo,
    category: {
      id: item.category.id,
      name: item.category.name,
      color: item.category.color,
    },
    createdAt: item.createdAt.toISOString(),
  }));

  const totalAmount = assets.reduce((sum, asset) => sum + asset.amount, 0);

  const categorySummaries: CategorySummary[] = categories.map((cat) => {
    const categoryAssets = assets.filter(
      (asset) => asset.category.id === cat.id
    );
    const total = categoryAssets.reduce((sum, asset) => sum + asset.amount, 0);
    const percentage =
      totalAmount > 0 ? Number(((total / totalAmount) * 100).toFixed(1)) : 0;

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      color: cat.color,
      total,
      percentage,
      count: categoryAssets.length,
    };
  });

  return {
    totalAmount,
    categories,
    categorySummaries,
    assets,
  };
}

/**
 * 신규 자산 등록 Server Action (Task 2.3)
 */
export async function createAsset(
  formData: CreateAssetInput
): Promise<ActionResult<AssetItem>> {
  try {
    const trimmedTitle = (formData.title ?? "").trim();
    if (trimmedTitle.length < 1 || trimmedTitle.length > 50) {
      return {
        success: false,
        error: "자산명은 1자 이상 50자 이하로 입력해주세요.",
      };
    }

    const numericAmount = Number(formData.amount);
    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      !Number.isInteger(numericAmount)
    ) {
      return {
        success: false,
        error: "금액은 0보다 큰 양의 정수(원 단위)로 입력해주세요.",
      };
    }

    const categoryId = Number(formData.categoryId);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return {
        success: false,
        error: "유효한 카테고리를 선택해주세요.",
      };
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, name: true, color: true },
    });

    if (!existingCategory) {
      return {
        success: false,
        error: "선택한 카테고리가 존재하지 않습니다.",
      };
    }

    const trimmedMemo = formData.memo?.trim() ? formData.memo.trim() : null;

    const created = await prisma.asset.create({
      data: {
        title: trimmedTitle,
        amount: BigInt(numericAmount),
        memo: trimmedMemo,
        categoryId: existingCategory.id,
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    safeRevalidateHome();

    return {
      success: true,
      data: {
        id: created.id,
        title: created.title,
        amount: Number(created.amount),
        memo: created.memo,
        category: created.category,
        createdAt: created.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("createAsset 오류:", error);
    return {
      success: false,
      error: "자산 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}

/**
 * 자산 삭제 Server Action (Task 2.4)
 */
export async function deleteAsset(assetId: number): Promise<ActionResult> {
  try {
    const id = Number(assetId);
    if (!Number.isInteger(id) || id <= 0) {
      return {
        success: false,
        error: "유효하지 않은 자산 ID입니다.",
      };
    }

    await prisma.asset.delete({
      where: { id },
    });

    safeRevalidateHome();

    return { success: true };
  } catch (error) {
    console.error("deleteAsset 오류:", error);
    return {
      success: false,
      error: "자산 삭제 중 오류가 발생했습니다. 이미 삭제되었거나 존재하지 않는 항목입니다.",
    };
  }
}

