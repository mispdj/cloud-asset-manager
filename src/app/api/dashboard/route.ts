import { NextResponse } from "next/server";
import { getDashboardData } from "@/actions/asset-actions";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  try {
    const data = await getDashboardData();
    return NextResponse.json(data, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("GET /api/dashboard 오류:", error);
    return NextResponse.json(
      { success: false, error: "대시보드 데이터를 불러오지 못했습니다." },
      { status: 500, headers: corsHeaders }
    );
  }
}

