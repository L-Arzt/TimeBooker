import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import prisma from '@/app/libs/prisma';

export async function GET(request) {
    try {
        const session = await getServerSession(NextAuthOptions);

        // Проверка авторизации
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Проверка роли - только admin может создавать бизнесы
        if (session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // EnglishPro
        const englishProData = {
            name: 'EnglishPro',
            slug: 'englishpro',
            type: 'Школа английского языка',
            tagline: 'Профессиональное обучение английскому языку',
            description: 'Современная школа английского языка для детей и подростков с индивидуальным подходом к каждому ученику.',
            level: 'C1 (Advanced)',
            about: 'Наша школа использует современные методики обучения. Преподаватели имеют международный опыт и регулярно проходят стажировки за рубежом.',
            features: JSON.stringify([
                { title: 'Онлайн занятия', description: 'Занятия проходят в Zoom. На уроках мы используем интерактивную онлайн-доску Miro, где ученики видят все задания в реальном времени.' },
                { title: 'Учебные материалы', description: 'Школа предоставляет все необходимые материалы для занятий. Ученикам не нужно ничего покупать дополнительно.' },
                { title: 'Личный кабинет', description: 'Каждому ученику предоставляется доступ к личному кабинету для отслеживания расписания занятий и прогресса обучения.' },
                { title: 'Мы гарантируем', description: 'Интересные уроки с использованием интерактивных методов для комплексного развития всех языковых навыков.' }
            ]),
            prices: JSON.stringify([
                { title: 'Индивидуальное занятие', desc1: 'Длительность 60 минут', desc2: 'Группа 1 человек', price: '700' },
                { title: 'Групповое занятие', desc1: 'Длительность 60 минут', desc2: 'Группа 3-4 человека', price: '400' },
                { title: 'Абонемент на 5 занятий', desc1: 'Длительность суммарно 300 минут', desc2: 'Индивидуально/в группе', price: '3000/1700' }
            ]),
            promo: JSON.stringify({ title: 'Акция для новых учеников', description: 'Пробное занятие всего за <span class="text-[#E74C3C] font-bold">299 рублей</span>!<br/>Запишитесь сейчас и получите персональную консультацию по уровню языка.', buttonText: 'Записаться на пробное занятие' }),
            ownerId: session.user.id
        };

        // FitnessClub
        const fitnessClubData = {
            name: 'FitnessClub',
            slug: 'fitnessclub',
            type: 'Фитнес-центр',
            tagline: 'Современный фитнес-центр для всей семьи',
            description: 'Мы предлагаем широкий спектр тренировок и программ для поддержания физической формы. Наши тренеры помогут вам достичь ваших целей.',
            about: 'Наш фитнес-центр оснащен современным оборудованием и предлагает разнообразные групповые занятия. Мы создаем комфортные условия для тренировок и заботимся о здоровье наших клиентов.',
            features: JSON.stringify([
                { title: 'Тренажерный зал', description: 'Современное оборудование от ведущих производителей. Просторный зал с кардио и силовыми тренажерами.' },
                { title: 'Групповые программы', description: 'Более 20 направлений групповых программ для разных уровней подготовки: йога, пилатес, зумба, степ и другие.' },
                { title: 'Персональные тренировки', description: 'Индивидуальный подход к каждому клиенту. Разработка программы тренировок с учетом ваших целей и особенностей.' },
                { title: 'Детский фитнес', description: 'Специальные программы для детей разных возрастов. Развитие физических качеств в игровой форме.' }
            ]),
            prices: JSON.stringify([
                { title: 'Разовое посещение', desc1: 'Тренажерный зал', desc2: 'Без ограничения по времени', price: '500' },
                { title: 'Абонемент на месяц', desc1: 'Безлимитное посещение', desc2: 'Тренажерный зал + групповые', price: '3500' },
                { title: 'Персональная тренировка', desc1: 'Длительность 60 минут', desc2: 'С опытным тренером', price: '1500' }
            ]),
            promo: JSON.stringify({ title: 'Специальное предложение для новичков', description: 'Первое посещение всего за <span class="text-[#E74C3C] font-bold">300 рублей</span>!<br/>Получите консультацию тренера и составление программы тренировок.', buttonText: 'Записаться на пробную тренировку' }),
            ownerId: session.user.id
        };

        // Seed EnglishPro
        let englishPro = await prisma.Business.findUnique({ where: { slug: 'englishpro' } });
        if (!englishPro) {
            englishPro = await prisma.Business.create({ data: englishProData });
        }

        // Seed FitnessClub
        let fitnessClub = await prisma.Business.findUnique({ where: { slug: 'fitnessclub' } });
        if (!fitnessClub) {
            fitnessClub = await prisma.Business.create({ data: fitnessClubData });
        }

        return NextResponse.json({ message: 'Seed completed', englishPro, fitnessClub }, { status: 200 });
    } catch (error) {
        console.error('Error seeding businesses:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 