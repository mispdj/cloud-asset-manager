"use client";

import { useState, useTransition } from "react";
import { PlusCircle, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createAsset } from "@/actions/asset-actions";
import { formatKRW, type CategoryItem } from "@/lib/formatters";

type AssetFormProps = {
  categories: CategoryItem[];
};

export default function AssetForm({ categories }: AssetFormProps) {
  const [categoryId, setCategoryId] = useState<string>(
    categories[0]?.id ? String(categories[0].id) : ""
  );
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const parsedPreviewAmount = Number(amount);
  const showPreview =
    amount.trim() !== "" &&
    Number.isFinite(parsedPreviewAmount) &&
    parsedPreviewAmount > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedTitle = title.trim();
    if (!categoryId) {
      setErrorMessage("카테고리를 선택해주세요.");
      return;
    }
    if (!trimmedTitle) {
      setErrorMessage("자산명을 입력해주세요.");
      return;
    }
    if (trimmedTitle.length > 50) {
      setErrorMessage("자산명은 50자 이하로 입력해주세요.");
      return;
    }

    const numericAmount = Number(amount);
    if (
      amount.trim() === "" ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      !Number.isInteger(numericAmount)
    ) {
      setErrorMessage("금액은 0원보다 큰 양의 정수로 입력해주세요.");
      return;
    }

    startTransition(async () => {
      const result = await createAsset({
        title: trimmedTitle,
        amount: numericAmount,
        memo: memo.trim() || null,
        categoryId: Number(categoryId),
      });

      if (!result.success) {
        setErrorMessage(result.error);
        return;
      }

      setTitle("");
      setAmount("");
      setMemo("");
      setSuccessMessage(`'${trimmedTitle}' 자산이 성공적으로 등록되었습니다.`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <PlusCircle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">신규 자산 등록</h2>
          <p className="text-xs text-slate-500">
            카테고리를 선택하고 보유 자산 정보를 입력하세요.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs font-medium text-rose-700"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs font-medium text-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 카테고리 선택 */}
        <div>
          <label
            htmlFor="asset-category"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            카테고리 <span className="text-rose-500">*</span>
          </label>
          <select
            id="asset-category"
            name="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
          >
            <option value="">카테고리를 선택하세요</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 자산명 입력 */}
        <div>
          <label
            htmlFor="asset-title"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            자산명 <span className="text-rose-500">*</span>
          </label>
          <input
            id="asset-title"
            name="title"
            type="text"
            maxLength={50}
            placeholder="예: 청년도약계좌, 삼성전자 주식, 비상금 통장"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
          />
        </div>

        {/* 금액 입력 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="asset-amount"
              className="block text-xs font-semibold text-slate-700"
            >
              평가 금액 (원) <span className="text-rose-500">*</span>
            </label>
            {showPreview && (
              <span className="text-xs font-semibold text-indigo-600">
                {formatKRW(parsedPreviewAmount)}
              </span>
            )}
          </div>
          <input
            id="asset-amount"
            name="amount"
            type="number"
            min={1}
            step={1}
            placeholder="예: 5000000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
          />
        </div>

        {/* 메모 입력 */}
        <div>
          <label
            htmlFor="asset-memo"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            비고 메모 <span className="text-slate-400 font-normal">(선택)</span>
          </label>
          <textarea
            id="asset-memo"
            name="memo"
            rows={3}
            placeholder="만기일, 계좌번호 별칭, 투자 비중 메모 등을 기록하세요."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            disabled={isPending}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-400 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>클라우드 DB 저장 중...</span>
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              <span>자산 등록하기</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

