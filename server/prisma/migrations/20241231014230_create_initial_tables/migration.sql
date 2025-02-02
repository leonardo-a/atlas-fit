-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_plans" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "workout_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_plan_exercises" (
    "id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "workout_plan_id" TEXT NOT NULL,
    "week_day" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workout_plan_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_slug_key" ON "exercises"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "workout_plans_slug_key" ON "workout_plans"("slug");

-- AddForeignKey
ALTER TABLE "workout_plans" ADD CONSTRAINT "workout_plans_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_plan_exercises" ADD CONSTRAINT "workout_plan_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_plan_exercises" ADD CONSTRAINT "workout_plan_exercises_workout_plan_id_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "workout_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
