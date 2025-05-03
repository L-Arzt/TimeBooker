'use server';

import prisma from '@/app/libs/prisma';
import { hash } from 'bcryptjs';

export async function registerUser(formData) {
    const { userName, email, password, role } = Object.fromEntries(formData);

    try {
        const hashedPassword = await hash(password, 10);
        const user = await prisma.users.create({
            data: {
                userName,
                email,
                password: hashedPassword,
                role,
            },
        });

        return { status: 'success', message: 'User created successfully' };
    } catch (error) {
        console.error(error);
        return { status: 'error', message: 'Аккаунт с такой почтой или никнеймом уже зарегистрирован' };
    }
}
