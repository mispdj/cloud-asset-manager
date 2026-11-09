# 시스템 상세설계서 (Design Document)

## 1. 아키텍처 다이어그램 및 데이터 흐름

```
[User Browser]
      │
      ▼ (HTTPS Request)
[Vercel Serverless Platform]
  └─► Next.js App Router (Page / Components)
        │
        ▼ (Direct Function Call via 'use server')
      Server Actions (src/actions/asset-actions.ts)
        │
        ▼ (Prisma Client with Transaction Pooling)
[Supabase Cloud Platform]
  └─► PostgreSQL DB (Port 6543 / 5432)
        ├── Table: categories (1)
        └── Table: assets (N) [FK: categoryId]
```

---

## 2. 데이터베이스 스키마 설계 (`prisma/schema.prisma`)

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Category {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  color     String   @default("blue") // UI 배지 컬러 클래스 매핑용
  assets    Asset[]
  createdAt DateTime @default(now())

  @@map("categories")
}

model Asset {
  id         Int      @id @default(autoincrement())
  title      String
  amount     BigInt   // 대규모 자산 가액 지원
  memo       String?
  categoryId Int
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([categoryId])
  @@map("assets")
}
```

### 초기 시드 데이터 (Seed Data)
앱 최초 실행 시 `prisma/seed.ts` 또는 초기화 로직을 통해 기본 카테고리를 삽입합니다:
1. `예적금` (Color: emerald)
2. `주식/투자` (Color: indigo)
3. `부동산` (Color: amber)
4. `현금` (Color: cyan)
5. `기타/암호화폐` (Color: violet)

---

## 3. 백엔드 인터페이스 및 Server Actions 명세

모든 백엔드 로직은 `src/actions/asset-actions.ts`에 정의하며, 실행 후 `revalidatePath('/')`를 호출하여 캐시를 무효화하고 UI를 최신화합니다.

### 1) `getDashboardData()`
- **목적**: 대시보드 렌더링에 필요한 모든 종합 데이터를 단일 트랜잭션으로 조회
- **반환값**:
  ```typescript
  type DashboardData = {
    totalAmount: number;
    categories: Array<{ id: number; name: string; color: string }>;
    categorySummaries: Array<{
      categoryId: number;
      categoryName: string;
      color: string;
      total: number;
      percentage: number;
      count: number;
    }>;
    assets: Array<{
      id: number;
      title: string;
      amount: number;
      memo: string | null;
      category: { id: number; name: string; color: string };
      createdAt: string;
    }>;
  };
  ```

### 2) `createAsset(formData: CreateAssetInput)`
- **입력 검증**:
  - `title`: 1자 이상 50자 이하
  - `amount`: 0보다 큰 양의 정수 (원 단위)
  - `categoryId`: DB에 존재하는 Category ID 여부 확인
- **동작**: DB 삽입 후 메인 페이지 리밸리데이션

### 3) `deleteAsset(assetId: number)`
- **동작**: 해당 ID의 자산 레코드 삭제 후 메인 페이지 리밸리데이션

---

## 4. 프론트엔드 컴포넌트 계층 구조

```
src/
├── app/
│   ├── layout.tsx         # 전역 폰트 및 Tailwind 레이아웃 설정
│   └── page.tsx           # 메인 대시보드 (Server Component, getDashboardData 직접 호출)
├── components/
│   ├── SummaryCards.tsx   # 상단 자산 총액 및 카테고리별 요약 카드 (Server/Client)
│   ├── AssetForm.tsx      # 좌측 자산 등록 폼 (Client Component, Server Action 연동)
│   ├── AssetTable.tsx     # 우측 자산 목록 테이블 및 카테고리 필터링 (Client Component)
│   └── CategoryBadge.tsx  # 카테고리 컬러 매핑 칩 컴포넌트
└── lib/
    ├── prisma.ts          # Prisma Client 싱글톤 인스턴스 (Vercel 환경 인스턴스 고갈 방지)
    └── formatters.ts      # 원화 통화 포맷(1,000,000원) 및 날짜 변환 함수
```

---

## 5. Vercel 배포 환경 변수 및 최적화 고려사항
1. **환경 변수 분리**:
   - `DATABASE_URL`: Supabase Connection Pooler URL (포트 6543, pgbouncer 모드)
   - `DIRECT_URL`: Supabase Direct DB URL (포트 5432, Prisma 마이그레이션 전용)
2. **빌드 커맨드 설정**:
   - `package.json`의 빌드 스크립트에 `prisma generate`를 선행 포함:
     `"build": "prisma generate && next build"`