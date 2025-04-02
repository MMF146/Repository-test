-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guestName" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "checkInDate" DATETIME NOT NULL,
    "checkOutDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'checked-in',
    "notes" TEXT,
    "totalAmount" REAL NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "documentId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DatabaseMonitoring" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dbName" TEXT NOT NULL,
    "dbType" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "monitoringInterval" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastCheck" DATETIME,
    "status" TEXT,
    "errorMessage" TEXT
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FoodOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestName" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "specialInstructions" TEXT NOT NULL DEFAULT '',
    "totalAmount" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
