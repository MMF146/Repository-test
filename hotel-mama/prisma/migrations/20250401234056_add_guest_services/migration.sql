-- CreateTable
CREATE TABLE "GuestFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestName" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CheckInOut" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestName" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "specialRequests" TEXT,
    "luggage" INTEGER NOT NULL DEFAULT 0,
    "roomCondition" TEXT,
    "minibarUsage" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LocalPreferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestName" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'es',
    "dietaryNeeds" TEXT,
    "temperature" INTEGER NOT NULL DEFAULT 22,
    "wakeUpCall" TEXT,
    "newspaper" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
