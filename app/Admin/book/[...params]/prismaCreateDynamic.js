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

  // Проверяем дату
  const parsedDate = new Date(data.date);
  if (isNaN(parsedDate.getTime())) {
    return { message: 'Некорректная дата!' };
  }

  const lesson = await prisma.timetable.findFirst({
    where: {
      date: parsedDate,
      numberLesson: Number(data.lessonNum),
      // weekDay: Number(data.lessonDay), // если нужно
    },
  });

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
      date: parsedDate,
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
