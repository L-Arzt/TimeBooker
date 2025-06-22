import Form from './Form.jsx';
// Импортируйте функцию для получения данных бронирования по id (создайте отдельно)
import { getLessonById } from './prismaUpdateDynamic';

export default async function UpdateLessonPage({ params }) {
    const { id } = params;
    const data = await getLessonById(id);
    return <Form data={data} />;
} 