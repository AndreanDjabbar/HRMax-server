import { PrismaClient } from "../../prisma/generated/prisma/index.js";

const prisma = new PrismaClient();

class UserRepository {
  static async generateUserRoles() {
    await prisma.user_Role.createMany({
      data: [
        { id: 0, name: 'DEVELOPER' },
        { id: 1, name: 'TENANT ADMIN' },
        { id: 2, name: 'PAYROLL ADMIN' },
        { id: 3, name: 'HR ADMIN' },
        { id: 4, name: 'REGIONAL VP' },
        { id: 5, name: 'BRANCH MANAGER' },
        { id: 6, name: 'STAFF' },
      ],
      skipDuplicates: true,
    });
  }
}

export default UserRepository;
