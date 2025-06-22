import Form from './Form.jsx';
import { getLessonById } from './prismaUpdateDynamic';

export default async function UpdateLessonPage({ params }) {
    const { id, slug } = params;
    const data = await getLessonById(id);
    return <Form data={{ ...data, slug }} />;
} 