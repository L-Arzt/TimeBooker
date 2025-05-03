import Image from "next/image";

const PriceCard = ({ src, alt, width, height, cardtextmain, cardtextdesc1, cardtextdesc2, cardtextprice }) => (
    <article className="flex items-center justify-start flex-col p-5 w-[280px] h-[360px] border border-[#FF9100] rounded-3xl bg-white text-[#FF9100] hover:bg-[#FF9100] hover:text-white ">
        < figure className="p-3">
            <Image src={src} alt={alt} width={width} height={height} />
        </figure >

        <section className="flex text-center justify-center flex-col  h-1/2">
            <h3 className=' text-[19px]'>{cardtextmain}</h3>
            <p className='text-[12px]'>{cardtextdesc1}</p>
            <p className='text-[12px]'>{cardtextdesc2}</p>
            <p className='text-[20px] text-black text-lg font-semibold p-3'>{cardtextprice}₽</p>
        </section>
    </article >
);

export default PriceCard;