const { PrismaClient } = require("@prisma/client");
const faker = require("faker");
const prisma = new PrismaClient();

async function main() {
  // Define departments
  const departments = ["ADMINISTRATION", "FINANCE"];

  // Create workers
  const workers = await Promise.all(
    departments.map((department) =>
      Promise.all(
        Array.from({ length: 3 }, () =>
          prisma.worker.create({
            data: {
              person: {
                create: {
                  firstName: faker.name.firstName(),
                  lastName: faker.name.lastName(),
                  email: faker.internet.email(),
                  password: faker.internet.password(),
                  role: "WORKER",
                },
              },
              department: department,
            },
          })
        )
      )
    )
  ).then((result) => result.flat());

  console.log("Workers created:", workers);

  // Generate 10 students with unique full names and emails
  const students = await Promise.all(
    Array.from({ length: 10 }, () =>
      prisma.student.create({
        data: {
          person: {
            create: {
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              email: faker.internet.email(),
              password: faker.internet.password(),
              role: "STUDENT",
            },
          },
        },
      })
    )
  );

  console.log("Students created:", students);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
