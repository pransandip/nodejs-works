import { prisma } from "./prisma/prisma.client.js";

async function main() {
  await prisma.user.deleteMany();
  const user = await prisma.user.create({
    data: {
      name: "Sandy",
      email: "pransandip@gmail.com",
      age: 28,
      userPreference: {
        create: { emailUpdates: true },
      },
    },
    select: {
      name: true,
      userPreference: { select: { id: true } },
    },
  });
  console.log(user);
}

main()
  .catch((e) => {
    console.log(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
