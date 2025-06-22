'use client'

import { useState } from 'react';
import InputMask from 'react-input-mask';

export default function ContactForm({ businessSlug }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

        try {
            // В реальном приложении здесь будет отправка на API
            // const res = await fetch('/api/contact', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ ...formData, businessSlug }),
            // });
            
            // Имитация успешной отправки
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: 'Спасибо! Мы свяжемся с вами в ближайшее время.' },
            });
            
            setFormData({
                name: '',
                phone: '',
                email: '',
                message: '',
            });
        } catch (error) {
            setStatus({
                submitted: false,
                submitting: false,
                info: { error: true, msg: 'Произошла ошибка. Пожалуйста, попробуйте позже.' },
            });
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {status.submitted ? (
                <div className="text-center p-6 bg-green-50 rounded-lg">
                    <svg 
                        className="w-12 h-12 text-green-500 mx-auto mb-4"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    <h3 className="text-xl font-medium text-green-800 mb-2">Сообщение отправлено!</h3>
                    <p className="text-green-700">{status.info.msg}</p>
                    <button 
                        onClick={() => setStatus({ submitted: false, submitting: false, info: { error: false, msg: null } })}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Отправить еще
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">Связаться с нами</h3>
                    
                    {status.info.error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {status.info.msg}
                        </div>
                    )}
                    
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 mb-2">Имя</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 mb-2">Телефон</label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="message" className="block text-gray-700 mb-2">Сообщение</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                            rows="4"
                        ></textarea>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={status.submitting}
                        className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ${
                            status.submitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {status.submitting ? 'Отправка...' : 'Отправить'}
                    </button>
                </form>
            )}
        </div>
    );
} 