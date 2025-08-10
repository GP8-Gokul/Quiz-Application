import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (email, password, name) => {
  return await prisma.user.create({
    data: {
      email,
      password,
      name,
    },
  });
};


