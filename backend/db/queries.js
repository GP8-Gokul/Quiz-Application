import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
  })
}

export const createQuiz = async (title, slug, questions, createdById) => {
  return await prisma.quiz.create({
    data: {
      title,
      slug,
      createdById,
      questions:{
        create: questions.map((q) => ({
          text : q.text,
          options: {
            create: q.options.map((o) => ({
              text: o.text,
              isCorrect: o.isCorrect,
            })),
          },
        })),
      },
    },
  })
}

export const findQuizzesByUserId = async (userId) => {
  return await prisma.quiz.findMany({
    where: { createdById: userId },
  })
}

export const findQuizBySlug = async (slug) => {
  return await prisma.quiz.findUnique({
    where: { slug },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  })
}
