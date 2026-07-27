-- CreateTable
CREATE TABLE "support_profile_clubs" (
    "support_profile_id" UUID NOT NULL,
    "club_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_profile_clubs_pkey" PRIMARY KEY ("support_profile_id","club_id")
);

-- CreateIndex
CREATE INDEX "support_profile_clubs_club_id_idx" ON "support_profile_clubs"("club_id");

-- AddForeignKey
ALTER TABLE "support_profile_clubs" ADD CONSTRAINT "support_profile_clubs_support_profile_id_fkey" FOREIGN KEY ("support_profile_id") REFERENCES "support_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_profile_clubs" ADD CONSTRAINT "support_profile_clubs_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- PreserveData
INSERT INTO "support_profile_clubs" (
    "support_profile_id",
    "club_id",
    "created_at"
)
SELECT
    "id",
    "favourite_club_id",
    CURRENT_TIMESTAMP
FROM "support_profiles"
WHERE "favourite_club_id" IS NOT NULL
ON CONFLICT DO NOTHING;

-- DropForeignKey
ALTER TABLE "support_profiles" DROP CONSTRAINT "support_profiles_favourite_club_id_fkey";

-- DropIndex
DROP INDEX "support_profiles_favourite_club_id_idx";

-- AlterTable
ALTER TABLE "support_profiles" DROP COLUMN "favourite_club_id";
