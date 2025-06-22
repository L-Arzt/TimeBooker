'use client'

import { useState } from 'react';
import InputMask from 'react-input-mask';

export default function ContactForm() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showNameInput, setShowNameInput] = useState(false);
    const [userName, setUserName] = useState("");

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);

        if (value.replace(/[^0-9]/g, "").length === 11) {
            setShowNameInput(true);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/addSalesUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phoneNumber,
                    name: userName,
                }),
            });

            if (response.ok) {
                const newUser = await response.json();
                console.log('Новый пользователь добавлен:', newUser);

                // Очистка полей после отправки
                setPhoneNumber("");
                setUserName("");
                setShowNameInput(false);
            } else {
                console.error('Ошибка при добавлении пользователя');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    return (
        <div className="my-10 border-2 border-[#E74C3C] rounded-3xl p-6 bg-white shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputMask
                    mask="+7(999)-999-99-99"
                    className="w-full p-4 rounded-2xl border-2 border-gray-200 text-[#2C3E50] outline-none focus:border-[#E74C3C] transition-colors placeholder:text-[#7F8C8D]"
                    placeholder="Ваш номер телефона"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                />
                {showNameInput && (
                    <input
                        type="text"
                        className="w-full p-4 rounded-2xl border-2 border-gray-200 text-[#2C3E50] outline-none focus:border-[#E74C3C] transition-colors placeholder:text-[#7F8C8D]"
                        placeholder="Ваше имя"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                )}
                <button
                    className="w-full bg-[#E74C3C] hover:bg-[#C0392B] text-white p-4 border border-[#E74C3C] rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    type="submit"
                >
                    Отправить заявку
                </button>
            </form>
        </div>
    );
} 