import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Treatment = "circle" | "cutout" | "portrait";
type PreviewTheme = "light" | "dark";

interface PhotoPreviewProps {
  treatment: Treatment;
  theme: PreviewTheme;
}

const options: { id: Treatment; name: string; description: string }[] = [
  {
    id: "circle",
    name: "Lingkaran",
    description: "Wajah paling mudah dikenali, terutama pada layar ponsel.",
  },
  {
    id: "cutout",
    name: "Tanpa bingkai",
    description: "Pose tubuh terlihat utuh dan terasa lebih terbuka.",
  },
  {
    id: "portrait",
    name: "Potret 4:5",
    description: "Memberi batas yang jelas antara foto dan isi halaman.",
  },
];

function PhotoPreview({ treatment, theme }: PhotoPreviewProps) {
  const isDark = theme === "dark";
  const photoClassName =
    treatment === "circle"
      ? "relative aspect-square w-36 shrink-0 overflow-hidden rounded-full border border-[var(--palette-surface)] sm:w-44"
      : treatment === "portrait"
        ? "relative aspect-4/5 w-36 shrink-0 overflow-hidden rounded-[9px] border border-[var(--palette-surface)] sm:w-44"
        : "relative aspect-4/5 w-36 shrink-0 sm:w-44";
  const photoBackground =
    treatment === "cutout"
      ? ""
      : isDark
        ? "bg-[color-mix(in_srgb,var(--palette-neutral)_70%,var(--palette-surface))]"
        : "bg-[var(--palette-tertiary)]";

  return (
    <div
      className={`flex min-h-64 flex-col justify-between overflow-hidden rounded-[9px] border p-6 ${
        isDark
          ? "border-[var(--palette-neutral)] bg-[var(--palette-neutral)] text-[var(--palette-tertiary)]"
          : "border-[var(--palette-surface)] bg-[var(--palette-tertiary)] text-[var(--palette-neutral)]"
      }`}
    >
      <span className={`text-sm ${isDark ? "text-[var(--palette-surface)]" : "text-[var(--palette-neutral)]"}`}>
        {isDark ? "Dark mode" : "Light mode"}
      </span>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0 pb-2">
          <p className="text-xl font-bold leading-tight">Bayu Purnomo</p>
          <p className={`mt-2 text-sm ${isDark ? "text-[var(--palette-surface)]" : "text-[var(--palette-neutral)]"}`}>
            Full Stack Developer
          </p>
        </div>
        <div className={`${photoClassName} ${photoBackground}`}>
          <Image
            src="/images/avatar/bayu-purnomo.webp"
            alt="Foto Bayu Purnomo"
            fill
            sizes="(max-width: 640px) 144px, 176px"
            className={
              treatment === "circle"
                ? "origin-top scale-125 object-cover object-top"
                : "object-contain object-bottom"
            }
          />
        </div>
      </div>
    </div>
  );
}

export default function PhotoOptionsPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 text-text-1">
      <Link href="/" className="text-sm text-accent-ink underline underline-offset-4 hover:text-accent-ink-hover focus-visible:outline-2">
        Kembali ke portofolio
      </Link>
      <h1 className="mt-8 text-4xl font-bold leading-tight">Pilihan tampilan foto hero</h1>
      <p className="mt-4 max-w-2xl text-base text-text-2">
        Bandingkan foto yang sama pada tema terang dan gelap. Setiap pilihan memakai komposisi hero yang serupa.
      </p>

      <div className="mt-16 space-y-16">
        {options.map((option) => (
          <section key={option.id} aria-labelledby={`${option.id}-title`}>
            <h2 id={`${option.id}-title`} className="text-2xl font-bold">
              {option.name}
            </h2>
            <p className="mt-2 text-text-2">{option.description}</p>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <PhotoPreview treatment={option.id} theme="light" />
              <PhotoPreview treatment={option.id} theme="dark" />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
