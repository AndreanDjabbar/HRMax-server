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

  static async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async createUserProfile(userId, {
    profileImage=null,
    phoneCountryID,
    phoneNumber,
  }) {
    return await prisma.user_Profile.create({
      data: {
        user_id: userId,
        profile_image: profileImage,
        phone_country_id: phoneCountryID,
        phone_number: phoneNumber,
      },
    });
  }

  static async verifiedUserByID(userId) {
    return await prisma.user.update({
      where: { id: userId },
      data: { is_verified: true },
    });
  }

  static async deleteUserbyID(userId) {
    return await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}

export default UserRepository;
