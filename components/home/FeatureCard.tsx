// Home page feature card component placeholder.
type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
  comingSoon?: boolean;
};

export default function FeatureCard({
  icon,
  title,
  description,
  comingSoon = false,
}: FeatureCardProps) {
  return (
    <article className="relative border-l-2 border-green-500 bg-white p-6 shadow-sm">
      {comingSoon && (
        <span className="absolute right-4 top-4 rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase text-green-600">
          Coming Soon
        </span>
      )}

      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50 text-xl">
        {icon}
      </div>

      <h3 className="mt-5 font-bold text-slate-900">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  );
}