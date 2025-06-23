import Link from 'next/link';

export default function TimeBookerFooter({ businessName = 'TimeBooker', businessType = 'Платформа онлайн-бронирования' }) {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Platform Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">TimeBooker</h3>
            <p className="text-gray-300 mb-4">
              Платформа для создания профессиональных страниц онлайн-бронирования
            </p>
            <div className="flex space-x-4">
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                О платформе
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Контакты
              </Link>
            </div>
          </div>

          {/* Business Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Текущий бизнес</h4>
            <p className="text-gray-300 mb-2">{businessName}</p>
            <p className="text-gray-400 text-sm">{businessType}</p>
            <Link 
              href="/" 
              className="text-[#FF9100] hover:text-[#E67E00] text-sm transition-colors"
            >
              О платформе →
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Быстрые ссылки</h4>
            <div className="space-y-2">
              <Link href="/pricing" className="block text-gray-300 hover:text-white transition-colors">
                Тарифы
              </Link>
              <Link href="/features" className="block text-gray-300 hover:text-white transition-colors">
                Возможности
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 TimeBooker. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
} 