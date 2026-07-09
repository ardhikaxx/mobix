import Link from "next/link";
import Image from "next/image";

export function MobixBadge({
  slug,
  variant = "default",
}: {
  slug?: string;
  variant?: "default" | "compact";
}) {
  const href = slug ? `/apps/${slug}` : "/";
  const isCompact = variant === "compact";

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-lg border border-store/30 bg-white px-4 py-2 shadow-sm transition hover:shadow-md hover:border-store dark:bg-gray-900 dark:border-store/20 dark:hover:border-store/40"
    >
      <div className="relative size-6 shrink-0 overflow-hidden rounded-md shadow-sm">
        <Image src="/images/logo_mobix.png" alt="Mobix" fill sizes="24px" className="object-cover" />
      </div>
      <div className="flex flex-col leading-tight">
        {isCompact ? (
          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Mobix</span>
        ) : (
          <>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">Available on</span>
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Mobix</span>
          </>
        )}
      </div>
    </Link>
  );
}

export function MobixBadgeRaw({
  slug,
  baseUrl = "https://mobix-mu.vercel.app",
}: {
  slug: string;
  baseUrl?: string;
}) {
  const href = `${baseUrl}/apps/${slug}`;

  return {
    markdown: `[![Available on Mobix](${baseUrl}/badge.svg)](${href})`,
    html: `<a href="${href}" target="_blank" rel="noopener noreferrer"><img src="${baseUrl}/badge.svg" alt="Available on Mobix" width="180" height="60" /></a>`,
    bbcode: `[url=${href}][img]${baseUrl}/badge.svg[/img][/url]`,
    plain: href,
  };
}
