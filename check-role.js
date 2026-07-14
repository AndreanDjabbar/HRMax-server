import { PrismaClient } from "./prisma/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'jdarel21@gmail.com' },
    include: { role: true }
  });
  console.log('User Role:', user.role_id, user.role);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
