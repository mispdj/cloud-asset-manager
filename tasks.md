# 작업공정계획표 (Tasks)

## Phase 1: 기반 환경 셋업 및 Supabase DB 연동
- [x] **Task 1.1**: Next.js 프로젝트 기반 패키지 구성 확인 (`@prisma/client`, `prisma`, `lucide-react`, `clsx`, `tailwind-merge` 설치)
- [x] **Task 1.2**: `.env` 파일에 Supabase `DATABASE_URL` 및 `DIRECT_URL` 환경변수 세팅
- [x] **Task 1.3**: `prisma/schema.prisma`에 `Category` 및 `Asset` 1:N 관계 스키마 작성
- [x] **Task 1.4**: `npx prisma db push` 실행하여 원격 Supabase DB에 테이블 생성
- [x] **Task 1.5**: 기본 카테고리 5종 자동 시드 스크립트 작성 및 실행 (`prisma/seed.ts` 또는 초기화 유틸)
- [x] **Task 1.6**: Vercel/서버리스 환경에 안전한 Prisma 싱글톤 클라이언트(`src/lib/prisma.ts`) 구성

---

## Phase 2: 백엔드 로직 및 Server Actions 구현
- [x] **Task 2.1**: 통화 포맷팅(`Intl.NumberFormat`) 및 타입 정의 유틸리티 작성 (`src/lib/formatters.ts`)
- [x] **Task 2.2**: 대시보드 종합 데이터 조회 함수 `getDashboardData()` 구현
- [x] **Task 2.3**: 입력값 검증 로직이 포함된 자산 생성 액션 `createAsset()` 구현
- [x] **Task 2.4**: 자산 삭제 액션 `deleteAsset()` 구현 및 `revalidatePath('/')` 연동
- [x] **Task 2.5**: 카테고리 목록 조회 보조 로직 검증

---

## Phase 3: 프론트엔드 UI 컴포넌트 제작 및 통합
- [x] **Task 3.1**: 상단 자산 현황 요약 카드 컴포넌트(`SummaryCards.tsx`) 구현 (총액 및 비중 바)
- [x] **Task 3.2**: 카테고리 배지 렌더러(`CategoryBadge.tsx`) 구현
- [x] **Task 3.3**: 자산 등록 폼 컴포넌트(`AssetForm.tsx`) 구현 (클라이언트 폼 검증 및 등록 대기 상태 표시)
- [x] **Task 3.4**: 자산 목록 테이블 및 카테고리 필터 컴포넌트(`AssetTable.tsx`) 구현 (삭제 트리거 포함)
- [x] **Task 3.5**: 메인 페이지(`src/app/page.tsx`)에 컴포넌트 통합 배치 및 반응형 레이아웃 적용

---

## Phase 4: E2E 검증, 빌드 및 배포 준비
- [x] **Task 4.1**: 로컬 개발 서버 구동 및 Antigravity 브라우저 검증 (초기 카테고리 로딩 확인)
- [x] **Task 4.2**: 브라우저 E2E 테스트 수행 (새 자산 등록 $\rightarrow$ Supabase 실제 저장 $\rightarrow$ 통계 자동 재계산 검증)
- [x] **Task 4.3**: 카테고리별 필터링 동작 및 자산 항목 삭제 동작 검증
- [x] **Task 4.4**: `package.json`에 Vercel 빌드 스크립트(`prisma generate && next build`) 동기화
- [x] **Task 4.5**: 프로덕션 빌드(`npm run build`) 테스트 수행 및 무결성 최종 점검

---

## PWA 전환 작업 (P1, P2, P3)
- [x] **P1.** manifest.json과 아이콘(192·512px) 추가 (display: standalone)
- [x] **P2.** 설치 조건만 맞추는 최소 서비스 워커 등록 (오프라인 캐시 없음)
- [ ] **P3.** 배포 후 폰에서 홈 화면 설치 확인 (사람이 확인)