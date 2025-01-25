/*
  Warnings:

  - You are about to drop the column `owner_id` on the `workout_plans` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `workout_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `workout_plans` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "workout_plans" DROP CONSTRAINT "workout_plans_owner_id_fkey";

-- AlterTable
ALTER TABLE "workout_plans" DROP COLUMN "owner_id",
ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "student_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "workout_plans" ADD CONSTRAINT "workout_plans_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_plans" ADD CONSTRAINT "workout_plans_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
