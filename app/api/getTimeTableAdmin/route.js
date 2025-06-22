import { PrismaClient } from '@prisma/client';
import prisma from '@/app/libs/prisma';

export async function POST(req) {
  const { monday, sunday, slug } = await req.json();
  let businessId = undefined;
  if (slug) {
    const business = await prisma.business.findUnique({ where: { slug } });
    businessId = business ? business.id : undefined;
  }

  async function getData() {
    const data = await prisma.timetable.findMany({
      where: {
        date: {
          gte: monday,
          lte: sunday,
        },
        ...(businessId && { businessId }),
      },
    });
    return data;
  }
  const data = await getData();

  return Response.json({ data });
}
