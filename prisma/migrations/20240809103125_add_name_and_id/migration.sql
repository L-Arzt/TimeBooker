-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user'
);

-- CreateTable
CREATE TABLE "timetable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numberLesson" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "weekDay" INTEGER NOT NULL,
    "studentName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "typeLearning" TEXT NOT NULL,
    "booked" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
