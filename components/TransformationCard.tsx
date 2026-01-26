import Image from "next/image";

interface TransformationCardProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
}

export default function TransformationCard({
  beforeImage,
  afterImage,
  title,
  description,
}: TransformationCardProps) {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Before */}
        <div className="relative h-[360px]">
          <Image
            src={beforeImage}
            alt="Before transformation"
            fill
            className="object-cover"
          />
          <span className="absolute top-4 left-4 bg-white/90 text-sm px-4 py-1 rounded-full">
            Before
          </span>
        </div>

        {/* After */}
        <div className="relative h-[360px]">
          <Image
            src={afterImage}
            alt="After transformation"
            fill
            className="object-cover"
          />
          <span className="absolute top-4 left-4 bg-[#9BAF9B] text-white text-sm px-4 py-1 rounded-full">
            After
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="px-8 py-6">
        <h3 className="font-serif text-2xl text-neutral-900">{title}</h3>
        <p className="mt-2 text-neutral-600">{description}</p>
      </div>
    </div>
  );
}
