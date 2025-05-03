import { PrismaClient } from '@prisma/client';
import Form from './Form';

export default async function UpdateBook({ params }) {
  const prisma = new PrismaClient();

  const data = await prisma.timetable.findFirst({
    where: {
      id: Number(params.id),
    },
  });
  console.log(params.id);

  return <Form data={data} />;
}
