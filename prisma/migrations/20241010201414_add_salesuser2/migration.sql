/*
  Warnings:

  - You are about to drop the `SalesUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SalesUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "salesuser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
