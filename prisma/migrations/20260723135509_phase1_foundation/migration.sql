-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPPORTER', 'MODERATOR', 'ADMIN', 'CLUB_REP');

-- CreateEnum
CREATE TYPE "LoyaltyTier" AS ENUM ('NEW_FAN', 'SUPPORTER', 'CORE_SUPPORTER', 'ULTRAS');

-- CreateEnum
CREATE TYPE "FixtureStatus" AS ENUM ('SCHEDULED', 'LIVE', 'COMPLETED', 'POSTPONED', 'CANCELLED');

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "display_name" VARCHAR(80),
    "avatar_url" TEXT,
    "role" "Role" NOT NULL DEFAULT 'SUPPORTER',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "favourite_club_id" UUID,
    "tier" "LoyaltyTier" NOT NULL DEFAULT 'NEW_FAN',
    "loyalty_points" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "support_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clubs" (
    "id" UUID NOT NULL,
    "external_id" INTEGER,
    "slug" VARCHAR(120) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "short_name" VARCHAR(80),
    "tla" VARCHAR(10),
    "crest_url" TEXT,
    "country" VARCHAR(80),
    "competition" VARCHAR(120),
    "stadium" VARCHAR(160),
    "stadium_capacity" INTEGER,
    "founded" INTEGER,
    "manager" VARCHAR(120),
    "website_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixtures" (
    "id" UUID NOT NULL,
    "external_id" INTEGER,
    "competition" VARCHAR(120) NOT NULL,
    "competition_code" VARCHAR(20),
    "matchday" INTEGER,
    "home_club_id" UUID NOT NULL,
    "away_club_id" UUID NOT NULL,
    "start_time" TIMESTAMPTZ(6) NOT NULL,
    "venue" VARCHAR(160),
    "status" "FixtureStatus" NOT NULL DEFAULT 'SCHEDULED',
    "home_score" INTEGER,
    "away_score" INTEGER,
    "referee" VARCHAR(120),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "fixtures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_username_key" ON "user_profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "support_profiles_user_id_key" ON "support_profiles"("user_id");

-- CreateIndex
CREATE INDEX "support_profiles_favourite_club_id_idx" ON "support_profiles"("favourite_club_id");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_external_id_key" ON "clubs"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_slug_key" ON "clubs"("slug");

-- CreateIndex
CREATE INDEX "clubs_competition_idx" ON "clubs"("competition");

-- CreateIndex
CREATE UNIQUE INDEX "fixtures_external_id_key" ON "fixtures"("external_id");

-- CreateIndex
CREATE INDEX "fixtures_start_time_idx" ON "fixtures"("start_time");

-- CreateIndex
CREATE INDEX "fixtures_status_start_time_idx" ON "fixtures"("status", "start_time");

-- CreateIndex
CREATE INDEX "fixtures_home_club_id_idx" ON "fixtures"("home_club_id");

-- CreateIndex
CREATE INDEX "fixtures_away_club_id_idx" ON "fixtures"("away_club_id");

-- AddForeignKey
ALTER TABLE "support_profiles" ADD CONSTRAINT "support_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_profiles" ADD CONSTRAINT "support_profiles_favourite_club_id_fkey" FOREIGN KEY ("favourite_club_id") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixtures" ADD CONSTRAINT "fixtures_home_club_id_fkey" FOREIGN KEY ("home_club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixtures" ADD CONSTRAINT "fixtures_away_club_id_fkey" FOREIGN KEY ("away_club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
