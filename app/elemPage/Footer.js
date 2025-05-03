import Image from 'next/image';
import logoImg from '../../public/Logo.png'
import bgFooter from '../../public/bgFooter.png'

const FooterElem = () => (

    <section className="relative h-full max-h-[200px]">
        <Image
            className="absolute w-full -z-10 "
            src={bgFooter}

            alt="Decoration right sale block image">
        </Image>

        <article className="absolute flex items-start justify-end flex-col left-48 -bottom-40">
            <Image
                width={100}
                height={20}
                src={logoImg}
                alt="Decoration right sale block image">
            </Image>
            <div className="mt-6 text-center text-xs text-white">
                © {new Date().getFullYear()} TimeBrooker. Все права защищены.
            </div>
        </article>
    </section>
)


export default FooterElem;