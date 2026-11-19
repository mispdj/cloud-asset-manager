import { NextRequest, NextResponse } from "next/server";
import { createAsset } from "@/actions/asset-actions";
import type { CreateAssetInput } from "@/lib/formatters";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateAssetInput;
    const result = await createAsset(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400, headers: corsHeaders });
    }

    return NextResponse.json(result, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error("POST /api/assets 오류:", error);
    return NextResponse.json(
      { success: false, error: "잘못된 요청 본문(JSON)이거나 자산 등록에 실패했습니다." },
      { status: 400, headers: corsHeaders }
    );
  }
}

