'use client';
import Image from "next/image";
import InputMask from 'react-input-mask';
import saleBook from '../../../public/saleblockbook.png';
import { useState } from 'react';

export default function PromoBlock({ promo }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (value.replace(/[^0-9]/g, "").length === 11) {
      setShowNameInput(true);
    } else {
      setShowNameInput(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch('/api/addSalesUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, name: userName }),
      });
      if (response.ok) {
        setSubmitted(true);
        setPhoneNumber("");
        setUserName("");
        setShowNameInput(false);
      } else {
        setError('Ошибка при добавлении пользователя');
      }
    } catch (err) {
      setError('Ошибка: ' + err.message);
    }
  };

  return (
    <article className="flex items-center justify-center flex-col gap-3">
      <figure className="my-20">
        <Image src={saleBook} alt="Image sale block main" />
      </figure>
      <h1 className="text-[24px] text-[#A56714] font-semibold">{promo.title || 'Записывайтесь на пробное занятие со скидкой!'}</h1>
      <p className="text-[16px] text-[#A56714]" dangerouslySetInnerHTML={{ __html: promo.description || 'При записи на сайте действует скидка 20% на пробное занятие.' }} />
      <div className="my-10 border rounded-3xl border-[#A56714]">
        {submitted ? (
          <div className="p-4 text-green-700">Спасибо! Мы свяжемся с вами в ближайшее время.</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 p-4">
            <InputMask
              mask="+7(999)-999-99-99"
              className="p-3 rounded-3xl text-[#AE8349] outline-none placeholder:text-[#AE8349]"
              placeholder="Ваш номер телефона"
              value={phoneNumber}
              onChange={handlePhoneChange}
              required
            />
            {showNameInput && (
              <input
                type="text"
                className="p-3 rounded-3xl text-[#AE8349] outline-none placeholder:text-[#AE8349]"
                placeholder="Ваше имя"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            )}
            <button className="bg-[#FF9100] text-white p-3 border border-[#A56714] rounded-3xl" type="submit">Отправить</button>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </form>
        )}
      </div>
    </article>
  );
} 