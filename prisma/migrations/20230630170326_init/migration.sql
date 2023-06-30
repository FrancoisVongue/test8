-- CreateTable
CREATE TABLE "ExchangeOffice" (
    "id" SERIAL NOT NULL,
    "udpatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExchangeOffice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exchange" (
    "id" SERIAL NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "ask" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "officeId" INTEGER NOT NULL,
    "udpatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rate" (
    "id" SERIAL NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "in" DECIMAL(65,30) NOT NULL,
    "out" DECIMAL(65,30) NOT NULL,
    "reserve" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "officeId" INTEGER NOT NULL,
    "udpatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "udpatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "ExchangeOffice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "ExchangeOffice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
