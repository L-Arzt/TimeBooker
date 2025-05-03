import Image from "next/image";

const ImageWithBorder = ({ src, alt, width, height, imgStyle, borderStyle }) => (
    <div className="absolute w-[650px] h-[500px]">
        <div className={imgStyle}>
            <Image src={src} alt={alt} width={width} height={height} className="rounded-3xl" />
        </div>
        <div className={borderStyle}>
        </div>
    </div>
);

export default ImageWithBorder;