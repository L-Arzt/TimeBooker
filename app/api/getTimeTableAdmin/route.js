
import { PrismaClient } from '@prisma/client';
export async function POST(req) {
  const weekRange = await req.json();
  const prisma = new PrismaClient();

  async function getData() {

    const data = await prisma.timetable.findMany({
      where: {

        date: {
          gte: weekRange.monday,
          lte: weekRange.sunday,
        },
      },


    });


    return data;
  }
  const data = await getData();

  return Response.json({ data });
}
