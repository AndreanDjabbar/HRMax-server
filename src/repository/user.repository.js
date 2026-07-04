import { PrismaClient } from "../../prisma/generated/prisma/index.js";

const prisma = new PrismaClient();

class UserRepository {
  static async generateUserRoles() {
    await prisma.user_Role.createMany({
      data: [
        { id: 0, name: 'DEVELOPER' },
        { id: 1, name: 'TENANT ADMIN' },
        { id: 2, name: 'REGIONAL VP' },
        { id: 3, name: 'PAYROLL ADMIN' },
        { id: 4, name: 'PAYROLL' },
        { id: 5, name: 'HR ADMIN' },
        { id: 6, name: 'HR' },
        { id: 7, name: 'COMPANY MANAGER' },
        { id: 8, name: 'STAFF' },
      ],
      skipDuplicates: true,
    });
  }
}

export default UserRepository;
