'use server';

import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';

const prisma = new PrismaClient();

export async function createLesson(prevState, formData) {
  const data = Object.fromEntries(formData);

  // Получаем сессию
  const session = await getServerSession(NextAuthOptions);

  if (!session) {
    return {
      message: 'Необходимо войти в систему',
    };
  }

  const userId = session.user.id;

  const lesson = await prisma.timetable.findFirst({
    where: {
      date: new Date(data.date),
      numberLesson: Number(data.lessonNum),
      // weekDay: Number(data.weekDay),
    },
  });

  console.log(lesson);

  if (lesson) {
    return {
      message: 'Уже занято',
    };
  }

  const createLesson = await prisma.timetable.create({
    data: {
      numberLesson: Number(data.lessonNum),
      weekDay: Number(data.lessonDay),
      studentName: data.studentName,
      description: data.description,
      date: new Date(data.date),
      typeLearning: data.typeLearning,
      booked: true,
      userId: userId,
    },
  });
  if (createLesson) {
    redirect('/Admin/TimeTableAdmin');
    return {
      message: 'Готово',
    };
  }
  return {
    message: 'Ошибка',
  };
}
