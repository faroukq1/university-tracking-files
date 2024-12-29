const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const DEPARTMENTS = ["ADMINISTRATION", "EDUCATION", "FINANCE"];
const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

async function seed() {
  const seedData = [];

  for (let i = 0; i < 20; i++) {
    const randomDepartment =
      DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const randomStatus =
      VALID_STATUSES[Math.floor(Math.random() * VALID_STATUSES.length)];

    seedData.push({
      studentId: 9,
      documentType: "DocumentType" + i,
      fileName: "FileName" + i + ".pdf",
      fileDescription: "Description of file " + i,
      fileSize: `${Math.floor(Math.random() * 10)}MB`,
      fileFormat: "PDF",
      submissionDate: new Date(),
      [randomDepartment]: randomStatus,
      comments: i % 2 === 0 ? "Sample comment" : null, // Random comments
      personId: 10,
    });
  }

  try {
    const result = await prisma.fileSubmission.createMany({
      data: seedData,
    });
    console.log(`${result.count} records seeded.`);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
