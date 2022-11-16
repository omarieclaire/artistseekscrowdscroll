-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "answerer" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "questionID" TEXT NOT NULL,
    CONSTRAINT "Answer_questionID_fkey" FOREIGN KEY ("questionID") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
