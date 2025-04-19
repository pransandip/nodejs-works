import { prisma } from "./prisma/prisma.client.js";
async function main() {
    const user = await prisma.user.create({
        data: { name: "Sally kai" },
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
//# sourceMappingURL=index.js.map