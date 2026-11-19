import { NextRequest, NextResponse } from "next/server";
import { deleteAsset } from "@/actions/asset-actions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await deleteAsset(Number(id));

    if (!result.success) {
      return NextResponse.json(result, { status: 400, headers: corsHeaders });
    }

    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("DELETE /api/assets/[id] 오류:", error);
    return NextResponse.json(
      { success: false, error: "자산 삭제 처리 중 오류가 발생했습니다." },
      { status: 500, headers: corsHeaders }
    );
  }
}

