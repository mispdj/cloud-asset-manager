import { Cloud, Database, ShieldCheck } from "lucide-react";
import { getDashboardData } from "@/actions/asset-actions";
import SummaryCards from "@/components/SummaryCards";
import AssetForm from "@/components/AssetForm";
import AssetTable from "@/components/AssetTable";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const dashboardData = await getDashboardData();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 상단 내비게이션 헤더 */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                Cloud Asset Manager
              </h1>
              <p className="text-xs text-slate-500">
                클라우드 기반 스마트 자산 관리 대시보드
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <Database className="h-3.5 w-3.5 text-emerald-600" />
              <span>Supabase PostgreSQL 연동됨</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
              <span>1:N 정규화 모델</span>
            </span>
          </div>
        </div>
      </header>

      {/* 메인 대시보드 콘텐츠 */}
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* 1. 상단 통계 요약 섹션 */}
        <SummaryCards
          totalAmount={dashboardData.totalAmount}
          totalCount={dashboardData.assets.length}
          categorySummaries={dashboardData.categorySummaries}
        />

        {/* 2. 하단 반응형 2열 그리드 (모바일 1열 세로 배치 / 데스크톱 MD 이상 좌측 폼 + 우측 테이블 배치) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-start">
          <div className="md:col-span-5 lg:col-span-4">
            <AssetForm categories={dashboardData.categories} />
          </div>

          <div className="md:col-span-7 lg:col-span-8">
            <AssetTable
              assets={dashboardData.assets}
              categories={dashboardData.categories}
            />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <span>© 2026 Cloud Asset Manager · Next.js App Router & Prisma ORM</span>
          <span>Powered by Supabase PostgreSQL & Vercel</span>
        </div>
      </footer>
    </div>
  );
}
