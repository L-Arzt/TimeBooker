"use client";
import React, { useState, useEffect } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createLesson } from './prismaCreateDynamic';

export default function Book({ params }) {
    const [studentName, setStudentName] = useState('');
    const [description, setDescription] = useState('');
    const TypeLearningList = [
        {
            value: 'Онлайн',
            label: 'Онлайн',
            // icon: Turtle,
        },
        {
            value: 'Офлайн',
            label: 'Офлайн',
        },
        {
            value: 'Индивидуально',
            label: 'Индивидуально',
        },
        {
            value: 'Групповой',
            label: 'Групповой',
        },
        {
            value: 'Консультация',
            label: 'Консультация',
        },
    ];
    const initialState = { message: '' };
    const [selectedLearning, setSelectedLearning] = useState([]);
    const [state, formAction] = useFormState(createLesson, initialState);
    const TimeOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const formattedDate = new Date(params.params[2]).toLocaleDateString('ru-RU', TimeOptions);
    const router = useRouter();

    useEffect(() => {
        if (state?.redirectTo) {
            router.push(state.redirectTo);
        }
    }, [state, router]);

    return (
        <div className="flex mx-auto my-6 items-center justify-center flex-col w-[100%] h-[40%] gap-[30px]">
            <div className="flex mx-auto items-center justify-center flex-col w-[40%] h-[70px] bg-[#F7F7F8] rounded-[15px]">
                <h1 className="text-[17px] font-semibold">Заполните форму, чтобы забронировать занятие</h1>
            </div>
            <div className="flex mx-auto items-center justify-center flex-col w-[40%] h-[30%] bg-[#F7F7F8] rounded-[15px]">
                <form action={formAction} className="flex items-center justify-center flex-col w-[100%] h-[100%] gap-y-[20px]">
                    <div className="flex  items-center justify-center w-[90%] h-[50px] rounded-[10px] p-3 my-10 bg-[#ffffff] gap-2 text-[#FF9100]">
                        <div>Дата: {formattedDate}</div>|
                        <div>№ дня недели: {params.params[1]}</div>|
                        <div>№ занятия: {params.params[0]} </div>
                    </div>
                    <label className="w-[90%]">
                        <input className="w-[100%] h-[50px] rounded-[10px] pl-3" type="text" defaultValue={studentName} name="studentName" placeholder="ФИО" />
                    </label>
                    <label className="w-[90%]">
                        <input className="w-[100%] h-[50px] rounded-[10px] pl-3" type="text" defaultValue={description} name="description" placeholder="Описание бронирования" />
                    </label>
                    <label className="w-[90%]">
                        <div className="">
                            <MultiSelect options={TypeLearningList} onValueChange={setSelectedLearning} placeholder="Выберите формат " animation={2} variant="inverted" className="w-[100%]  rounded-[10px] pl-3  bg-white text-[#b1b1b1]" />
                        </div>
                    </label>
                    <input hidden type="text" value={params.params[0]} name="lessonNum" />
                    <input hidden type="text" value={params.params[1]} name="lessonDay" />
                    <input hidden type="text" value={params.params[2]} name="date" />
                    <input hidden type="text" value={selectedLearning.join(', ')} name="typeLearning" />
                    <input hidden type="text" value={params.slug} name="slug" />
                    <input className="flex w-[90%] h-[45px] items-center justify-center bg-[#FF9100]  rounded-md text-stone-50" type="submit" value="Забронировать" />
                    <div aria-live="polite">{state?.message}</div>
                </form>
            </div>
        </div>
    );
} 