import Image from "next/image";

const AboutMeCard = ({ src, alt, width, height, cardtexth, cardtextp }) => (
    <article className="flex items-center justify-start flex-col p-5 w-[260px] h-[300px] border border-[#FF9100] rounded-3xl bg-white text-[#FF9100] hover:bg-[#FF9100] hover:text-white ">
        < figure className="p-3">
            <Image src={src} alt={alt} width={width} height={height} />
        </figure >

        <section className="flex text-center justify-center flex-col">
            <h3 className=' text-[19px]'>{cardtexth}</h3>
            <p className='text-[12px]'>{cardtextp}</p>
        </section>
    </article >
);

export default AboutMeCard;