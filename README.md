# Cloud Asset Manager (클라우드 기반 스마트 자산 관리 대시보드)

Next.js (App Router), Server Actions, Prisma ORM, Supabase PostgreSQL 기반의 1:N 관계형 클라우드 자산 관리 대시보드입니다.

## 주요 기능
- **실시간 자산 통계 대시보드**: 총 평가 자산 합계 및 5대 카테고리별 금액·보유 건수·비중(%) 자동 계산
- **1:N 정규화 데이터 모델**: `Category` (1) : `Asset` (N) 외래키(FK) 구조 및 초기 5대 카테고리 자동 시딩
- **무새로고침 Server Actions**: 자산 등록(`createAsset`) 및 삭제(`deleteAsset`) 시 `revalidatePath('/')`를 통한 즉각적인 UI 갱신
- **반응형 레이아웃**: 모바일 1열, 데스크톱 2열 그리드 및 카테고리별 탭 필터링 지원

## 로컬 실행 방법

```bash
# 1. 패키지 설치
npm install

# 2. Supabase DB 스키마 동기화 및 기본 카테고리 시딩
npx prisma db push
npm run db:seed

# 3. 개발 서버 실행 (http://localhost:3000)
npm run dev
```

## Vercel 배포 가이드

1. 프로젝트를 GitHub 저장소에 푸시합니다.
2. [Vercel](https://vercel.com)에서 GitHub 저장소를 Import 합니다.
3. **Environment Variables** 설정에 `.env` 파일의 두 변수를 등록합니다:
   - `DATABASE_URL`
   - `DIRECT_URL`
4. **Deploy** 버튼을 클릭하면 `package.json`의 `"build": "prisma generate && next build"`가 자동 실행되며 배포가 완료됩니다.

