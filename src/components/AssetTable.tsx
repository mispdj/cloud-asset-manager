"use client";

import { useState, useTransition } from "react";
import {
  Trash2,
  Loader2,
  Filter,
  FolderOpen,
  Calendar,
  FileText,
  AlertTriangle,
} from "lucide-react";
import clsx from "clsx";
import { deleteAsset } from "@/actions/asset-actions";
import {
  formatDate,
  formatKRW,
  type AssetItem,
  type CategoryItem,
} from "@/lib/formatters";
import CategoryBadge from "./CategoryBadge";

type AssetTableProps = {
  assets: AssetItem[];
  categories: CategoryItem[];
};

export default function AssetTable({ assets, categories }: AssetTableProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "ALL">(
    "ALL"
  );
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<AssetItem | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredAssets =
    selectedCategoryId === "ALL"
      ? assets
      : assets.filter((asset) => asset.category.id === selectedCategoryId);

  const filteredTotal = filteredAssets.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const handleConfirmDelete = (asset: AssetItem) => {
    setErrorMessage(null);
    setDeletingId(asset.id);

    startTransition(async () => {
      const result = await deleteAsset(asset.id);
      setDeletingId(null);
      setConfirmDeleteItem(null);

      if (!result.success) {
        setErrorMessage(result.error);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
      {/* 상단 헤더 & 필터 요약 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">보유 자산 목록</h2>
            <p className="text-xs text-slate-500">
              최신 등록순 정렬 · 선택된 항목 합계{" "}
              <span className="font-semibold text-slate-800">
                {formatKRW(filteredTotal)}
              </span>
            </p>
          </div>
        </div>
        <div className="text-xs font-medium text-slate-500">
          총 <span className="font-bold text-indigo-600">{filteredAssets.length}</span>건 표시 중
        </div>
      </div>

      {/* 카테고리 필터 탭 */}
      <div
        role="tablist"
        aria-label="카테고리 필터"
        className="mt-4 flex flex-wrap gap-2"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategoryId === "ALL"}
          onClick={() => setSelectedCategoryId("ALL")}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
            selectedCategoryId === "ALL"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          <span>전체보기</span>
          <span
            className={clsx(
              "rounded-full px-1.5 py-0.5 text-[10px]",
              selectedCategoryId === "ALL"
                ? "bg-white/20 text-white"
                : "bg-white text-slate-600"
            )}
          >
            {assets.length}
          </span>
        </button>

        {categories.map((cat) => {
          const count = assets.filter((a) => a.category.id === cat.id).length;
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                isSelected
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              <span>{cat.name}</span>
              <span
                className={clsx(
                  "rounded-full px-1.5 py-0.5 text-[10px]",
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-white text-slate-600"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700"
        >
          {errorMessage}
        </div>
      )}

      {/* 자산 목록 테이블 / 빈 상태 */}
      {filteredAssets.length === 0 ? (
        <div className="my-12 flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <FolderOpen className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">
            표시할 자산 내역이 없습니다
          </p>
          <p className="mt-1 text-xs text-slate-500">
            좌측 등록 폼에서 새로운 자산을 추가해보세요.
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-3 pl-2 pr-3">카테고리</th>
                <th className="px-3 py-3">자산명 / 메모</th>
                <th className="px-3 py-3 text-right">평가 금액</th>
                <th className="px-3 py-3 hidden sm:table-cell">등록일</th>
                <th className="py-3 pl-3 pr-2 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAssets.map((asset) => {
                const isDeletingThis = isPending && deletingId === asset.id;

                return (
                  <tr
                    key={asset.id}
                    className="group transition hover:bg-slate-50/80"
                  >
                    <td className="py-3.5 pl-2 pr-3 align-top whitespace-nowrap">
                      <CategoryBadge
                        name={asset.category.name}
                        color={asset.category.color}
                      />
                    </td>

                    <td className="px-3 py-3.5 align-top">
                      <p className="font-semibold text-slate-900">
                        {asset.title}
                      </p>
                      {asset.memo && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <FileText className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="line-clamp-1">{asset.memo}</span>
                        </p>
                      )}
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400 sm:hidden">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(asset.createdAt)}</span>
                      </p>
                    </td>

                    <td className="px-3 py-3.5 align-top text-right whitespace-nowrap">
                      <span className="font-bold text-slate-900">
                        {formatKRW(asset.amount)}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 align-top whitespace-nowrap text-xs text-slate-500 hidden sm:table-cell">
                      {formatDate(asset.createdAt)}
                    </td>

                    <td className="py-3.5 pl-3 pr-2 align-top text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteItem(asset)}
                        disabled={isDeletingThis}
                        aria-label={`${asset.title} 삭제`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:border-rose-200 hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
                      >
                        {isDeletingThis ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        <span>삭제</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {confirmDeleteItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3
                  id="delete-modal-title"
                  className="text-base font-bold text-slate-900"
                >
                  자산 항목 삭제 확인
                </h3>
                <p className="text-xs text-slate-500">
                  삭제된 자산 데이터는 복구할 수 없습니다.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3.5 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">카테고리</span>
                <CategoryBadge
                  name={confirmDeleteItem.category.name}
                  color={confirmDeleteItem.category.color}
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">자산명</span>
                <span className="font-semibold text-slate-900">
                  {confirmDeleteItem.title}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">평가 금액</span>
                <span className="font-bold text-indigo-600">
                  {formatKRW(confirmDeleteItem.amount)}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setConfirmDeleteItem(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleConfirmDelete(confirmDeleteItem)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>삭제 중...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>삭제 확인</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

