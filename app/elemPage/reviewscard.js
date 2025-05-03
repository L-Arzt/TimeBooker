import Image from "next/image";
import goodstar from '../../public/goodstar.png'
import badstar from '../../public/badstar.png'


const Star = ({ filled }) => (
    <Image src={filled ? goodstar : badstar} alt="image rating star" width={20} height={20} />
);

const ReviewsCard = ({ src, cardtexth, cardtextp, rating }) => (
    <article className="flex items-center text-center justify-center flex-col border border-[#FF9100] rounded-3xl bg-white w-full max-w-[570px] h-[400px] gap-5">
        <div >
            <Image src={src} alt="image person in card " width={120} height={150} className="rounded-2xl" />
        </div>
        <h3 className="text-[#FF9100] text-[26px]">{cardtexth}</h3>
        <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} filled={index < rating} />
            ))}
        </div>

        <p className='text-[12px] text-[#D67E09]'>{cardtextp}</p>

    </article>
);

export default ReviewsCard;
