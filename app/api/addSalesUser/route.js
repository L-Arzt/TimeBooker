import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { phone, name } = req.body;

        try {
            const newUser = await prisma.salesuser.create({
                data: {
                    phone,
                    name,
                },
            });
            res.status(200).json(newUser);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка добавления пользователя в базу данных' });
        }
    } else {
        res.status(405).json({ error: 'Метод не поддерживается' });
    }
}
