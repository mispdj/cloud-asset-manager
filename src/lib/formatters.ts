export type CategoryItem = {
  id: number;
  name: string;
  color: string;
};

export type CategorySummary = {
  categoryId: number;
  categoryName: string;
  color: string;
  total: number;
  percentage: number;
  count: number;
};

export type AssetItem = {
  id: number;
  title: string;
  amount: number;
  memo: string | null;
  category: CategoryItem;
  createdAt: string;
};

export type DashboardData = {
  totalAmount: number;
  categories: CategoryItem[];
  categorySummaries: CategorySummary[];
  assets: AssetItem[];
};

export type CreateAssetInput = {
  title: string;
  amount: number;
  memo?: string | null;
  categoryId: number;
};

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

const krwFormatter = new Intl.NumberFormat("ko-KR");

/**
 * 숫자를 원화 세 자리 콤마 포맷 문자열로 변환합니다 (예: 1,250,000원)
 */
export function formatKRW(amount: number | bigint): string {
  const numericAmount = typeof amount === "bigint" ? Number(amount) : amount;
  if (!Number.isFinite(numericAmount)) return "0원";
  return `${krwFormatter.format(Math.round(numericAmount))}원`;
}

/**
 * 숫자를 세 자리 콤마 문자열로 변환합니다 (단위 제외, 예: 1,250,000)
 */
export function formatNumber(amount: number | bigint): string {
  const numericAmount = typeof amount === "bigint" ? Number(amount) : amount;
  if (!Number.isFinite(numericAmount)) return "0";
  return krwFormatter.format(Math.round(numericAmount));
}

/**
 * ISO 날짜 문자열 또는 Date 객체를 한국어 날짜 포맷으로 변환합니다 (예: 2026. 11. 09.)
 */
export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * 백분율 포맷팅 (소수점 첫째 자리까지 표시, 예: 35.5%)
 */
export function formatPercentage(percentage: number): string {
  if (!Number.isFinite(percentage) || percentage <= 0) return "0.0%";
  return `${percentage.toFixed(1)}%`;
}

