const { PrismaClient } = require("@prisma/client");
const faker = require("faker");
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
      studentId: faker.datatype.number({ min: 1, max: 1000 }), // Random student ID
      documentType: faker.random.word(), // Random document type
      fileName: faker.system.fileName(), // Random file name
      fileDescription: faker.lorem.sentence(), // Random file description
      fileSize: `${faker.datatype.number({ min: 1, max: 10 })}MB`, // Random file size
      fileFormat: "PDF", // Assuming all files are PDFs
      submissionDate: faker.date.past(), // Random past date
      [randomDepartment]: randomStatus, // Random status for department
      comments: faker.random.boolean() ? faker.lorem.sentence() : null, // Random comments or null
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
