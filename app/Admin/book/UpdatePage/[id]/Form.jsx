'use client';
import React, { useState } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import { updateLesson } from './prismaUpdateDynamic';
import { deleteLesson } from './prismaDeleteDynamic';

import deleteImg from '../../../../../public/deleteImg.png';
import Image from 'next/image';
import { useFormState } from 'react-dom';

export default function UpdateLessonPage({ data }) {
    const TypeLearningList = [
        {
            value: 'Индивидуальное',
            label: 'Индивидуальное',
        },
        {
            value: 'Групповое',
            label: 'Групповое',
        },
    ];
    const TimeOptions = { weekday: 'long', month: 'long', day: 'numeric' };


    const initialState = {
        message: '',
    };

    const [selectedFrameworks, setSelectedFrameworks] = useState([data.typeLearning]);
    const [state, formAction] = useFormState(updateLesson, initialState);

    return (
        <div className="flex mx-auto my-6 tems-center justify-center flex-col w-[100%] h-[40%] gap-[20px]">
            <div className="flex mx-auto items-center justify-center flex-col w-[40%] h-[70px] bg-[#F7F7F8] rounded-[15px]">
                <h1 className="text-[17px] font-semibold">
                    Изменение данных занятия
                </h1>
            </div>

            <div className="flex mx-auto items-center justify-center flex-col w-[40%] h-[30%] bg-[#F7F7F8] rounded-[15px]">
                <form
                    action={formAction}
                    className="flex items-center justify-center flex-col w-[100%] h-[100%] gap-y-[20px]"
                >
                    <div className="flex items-center justify-center w-[90%] h-[50px] rounded-[10px] p-3 my-10 bg-[#ffffff] gap-2 text-[#FF9100] ">
                        <div>Дата: {new Date(data.date).toLocaleDateString('ru-RU', TimeOptions)}</div>|
                        <div>№ дня недели: {new Date(data.date).getDay()}</div>|
                        <div>№ занятия: {data.numberLesson}</div>
                    </div>

                    <label className="w-[90%]">
                        <input
                            className="w-[100%] h-[50px] rounded-[10px] pl-3"
                            type="text"
                            defaultValue={data.studentName}
                            name="studentName"
                            placeholder="ФИО"
                        />
                    </label>
                    <label className="w-[90%]">
                        <input
                            className="w-[100%] h-[50px] rounded-[10px] pl-3"
                            type="text"
                            defaultValue={data.description}
                            name="description"
                            placeholder="Описание бронирования"
                        />
                    </label>

                    <label className="w-[90%]">
                        <div className="">
                            <MultiSelect
                                options={TypeLearningList}
                                onValueChange={setSelectedFrameworks}
                                placeholder="Выберите тип занятия"

                                defaultValue={selectedFrameworks}
                                animation={2}
                                variant="inverted"
                                className="w-[100%] rounded-[10px] pl-3 bg-white text-[#b1b1b1]"
                            />
                        </div>
                    </label>

                    <input hidden type="text" value={data.id} name="id" />
                    <input hidden type="text" value={data.numberLesson} name="lessonNum" />
                    <input hidden type="text" value={data.weekDay} name="lessonDay" />
                    <input hidden type="text" value={new Date(data.date)} name="date" />
                    {/* <input hidden type="text" value={selectedFrameworks.join(', ')} name="typeLearning" /> */}
                    <input hidden type="text" value={data.typeLearning} name="typeLearning" />
                    <input
                        className="flex w-[90%] h-[45px] items-center justify-center bg-[#FF9100] rounded-md text-stone-50"
                        type="submit"
                        value="Изменить данные"
                    ></input>

                    <div aria-live="polite">{state?.message}</div>

                    <button
                        className="flex items-center justify-center text-red-500 w-[90%] h-[45px] bg-[#9b9b9b] rounded-md mb-5"
                        onClick={async () => {
                            const Delete = await deleteLesson(data.id);
                            console.log(Delete);
                        }}
                    >
                        Удалить
                        <Image className="w-10 h-10 rounded-lg p-1" src={deleteImg} alt="deleteImg" />
                    </button>
                </form>
            </div>
        </div>
    );
}
