'use server';

import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function updateLesson(prevState, formData) {
  const data = Object.fromEntries(formData);

  const createLesson = await prisma.timetable.update({
    where: {
      id: Number(data.id),
    },
    data: {
      numberLesson: Number(data.lessonNum),
      weekDay: Number(data.lessonDay),
      studentName: data.studentName,
      description: data.description,
      date: new Date(data.date),
      typeLearning: data.typeLearning,
      booked: true,
      userId: data.userId,
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