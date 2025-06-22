import prisma from './prisma';

/**
 * Получение бизнеса по его slug
 * @param {string} slug - URL-совместимый идентификатор бизнеса
 * @returns {Promise<Object|null>} - Объект бизнеса или null, если не найден
 */
export async function getBusinessBySlug(slug) {
    try {
        const business = await prisma.Business.findUnique({
            where: { slug },
        });

        return business;
    } catch (error) {
        console.error('Error fetching business by slug:', error);
        return null;
    }
}

/**
 * Получение всех бизнесов
 * @returns {Promise<Array>} - Массив бизнесов
 */
export async function getAllBusinesses() {
    try {
        const businesses = await prisma.Business.findMany({
            orderBy: { name: 'asc' },
        });

        return businesses;
    } catch (error) {
        console.error('Error fetching all businesses:', error);
        return [];
    }
}

/**
 * Создание нового бизнеса
 * @param {Object} data - Данные бизнеса
 * @param {number} ownerId - ID пользователя-владельца
 * @returns {Promise<Object>} - Созданный бизнес
 */
export async function createBusiness(data, ownerId) {
    try {
        const business = await prisma.Business.create({
            data: {
                ...data,
                ownerId,
            },
        });

        return business;
    } catch (error) {
        console.error('Error creating business:', error);
        throw error;
    }
}

/**
 * Проверка, является ли пользователь владельцем бизнеса
 * @param {number} userId - ID пользователя
 * @param {string} businessSlug - Slug бизнеса
 * @returns {Promise<boolean>} - true, если пользователь владелец, иначе false
 */
export async function isBusinessOwner(userId, businessSlug) {
    try {
        const business = await prisma.Business.findFirst({
            where: {
                slug: businessSlug,
                ownerId: userId,
            },
        });

        return !!business;
    } catch (error) {
        console.error('Error checking business ownership:', error);
        return false;
    }
}

/**
 * Получение расписания для конкретного бизнеса
 * @param {number} businessId - ID бизнеса
 * @returns {Promise<Object>} - Объект с данными расписания и диапазоном недели
 */
export async function getTimeTableForBusiness(businessId) {
    try {
        // Получаем текущую неделю
        function getMonday(d) {
            d = new Date(d);
            d.setHours(3);
            d.setMinutes(0, 0, 0);

            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1);
            return new Date(d.setDate(diff));
        }

        function getSunday(d) {
            d = new Date(d);
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? 0 : 7);
            return new Date(d.setDate(diff));
        }

        const weekRange = {
            from: getMonday(new Date()),
            to: getSunday(new Date()),
        };

        // Получаем данные расписания для бизнеса
        const data = await prisma.timetable.findMany({
            where: {
                date: {
                    gte: weekRange.from,
                    lte: weekRange.to,
                },
                businessId: businessId,
            },
        });

        return { data, weekRange };
    } catch (error) {
        console.error('Error fetching timetable for business:', error);
        return { data: [], weekRange: { from: new Date(), to: new Date() } };
    }
} 