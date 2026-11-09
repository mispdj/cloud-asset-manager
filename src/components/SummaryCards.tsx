import {
  Wallet,
  TrendingUp,
  Building2,
  Banknote,
  Coins,
  PieChart,
  Layers,
} from "lucide-react";
import clsx from "clsx";
import {
  formatKRW,
  formatPercentage,
  type CategorySummary,
} from "@/lib/formatters";
import CategoryBadge, { getCategoryColorStyle } from "./CategoryBadge";

type SummaryCardsProps = {
  totalAmount: number;
  totalCount: number;
  categorySummaries: CategorySummary[];
};

function CategoryIcon({ color }: { color: string }) {
  const iconClass = "h-4 w-4";
  switch (color) {
    case "emerald":
      return <Wallet className={iconClass} />;
    case "indigo":
      return <TrendingUp className={iconClass} />;
    case "amber":
      return <Building2 className={iconClass} />;
    case "cyan":
      return <Banknote className={iconClass} />;
    case "violet":
      return <Coins className={iconClass} />;
    default:
      return <PieChart className={iconClass} />;
  }
}

export default function SummaryCards({
  totalAmount,
  totalCount,
  categorySummaries,
}: SummaryCardsProps) {
  return (
    <section aria-label="자산 현황 요약" className="space-y-4">
      {/* 상단 메인 총 자산 요약 및 포트폴리오 비중 바 */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
              <Layers className="h-4 w-4 text-indigo-400" />
              <span>총 평가 자산 합계</span>
            </div>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
              {formatKRW(totalAmount)}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <span className="text-slate-300 block text-xs">등록된 자산 항목</span>
              <span className="text-lg font-bold text-white">{totalCount}건</span>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <span className="text-slate-300 block text-xs">활성 카테고리</span>
              <span className="text-lg font-bold text-white">
                {categorySummaries.filter((c) => c.count > 0).length} /{" "}
                {categorySummaries.length}개
              </span>
            </div>
          </div>
        </div>

        {/* 전체 카테고리 비중 멀티 프로그레스 바 */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>카테고리별 포트폴리오 비중</span>
            <span>{totalAmount > 0 ? "100.0%" : "등록된 자산 없음"}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700/70 flex">
            {totalAmount > 0 ? (
              categorySummaries
                .filter((item) => item.total > 0)
                .map((item) => {
                  const style = getCategoryColorStyle(item.color);
                  return (
                    <div
                      key={item.categoryId}
                      style={{ width: `${Math.max(item.percentage, 2)}%` }}
                      title={`${item.categoryName}: ${formatKRW(item.total)} (${formatPercentage(item.percentage)})`}
                      className={clsx(
                        "h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full",
                        style.bar
                      )}
                    />
                  );
                })
            ) : (
              <div className="h-full w-full bg-slate-700/50" />
            )}
          </div>
        </div>
      </div>

      {/* 카테고리별 세부 요약 카드 그리드 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {categorySummaries.map((item) => {
          const style = getCategoryColorStyle(item.color);
          return (
            <div
              key={item.categoryId}
              className={clsx(
                "rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all",
                style.cardBorder
              )}
            >
              <div className="flex items-center justify-between">
                <CategoryBadge name={item.categoryName} color={item.color} />
                <div
                  className={clsx(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    style.iconBg
                  )}
                >
                  <CategoryIcon color={item.color} />
                </div>
              </div>

              <div className="mt-3">
                <p className="text-lg font-bold text-slate-900 truncate">
                  {formatKRW(item.total)}
                </p>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                  <span>보유 {item.count}건</span>
                  <span className="font-semibold text-slate-700">
                    {formatPercentage(item.percentage)}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={clsx("h-full rounded-full transition-all duration-500", style.bar)}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

