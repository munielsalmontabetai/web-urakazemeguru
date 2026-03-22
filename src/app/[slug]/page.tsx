import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { userConfig } from "@/config/userConfig";
import { SectionHeading } from "@/components/ui/custom/SectionHeading";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  if (!userConfig.customPages) return [];
  return userConfig.customPages.map((page) => ({
    slug: page.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageData = userConfig.customPages?.find((p) => p.slug === slug);

  if (!pageData) {
    return { title: "Not Found" };
  }

  return {
    title: pageData.title,
    description: pageData.content?.slice(0, 100)
  };
}

export default async function CustomPage({ params }: Props) {
  const { slug } = await params;
  const pageData = userConfig.customPages?.find((p) => p.slug === slug);

  if (!pageData) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] px-4 pt-32 pb-20">
      {/* Background Decor */}
      <div className="pointer-events-none absolute top-40 -left-64 h-[500px] w-[500px] rounded-full bg-[var(--primary)] opacity-5 blur-3xl" />
      <div className="pointer-events-none absolute -right-64 bottom-40 h-[500px] w-[500px] rounded-full bg-[var(--secondary)] opacity-5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <SectionHeading>{pageData.title}</SectionHeading>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[var(--primary)]/10 bg-white p-8 shadow-sm md:p-12">
          {pageData.image && (
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src={pageData.image}
                alt={pageData.title}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}
          {pageData.content && (
            <div className="font-text text-lg leading-relaxed tracking-wider whitespace-pre-wrap text-[var(--foreground)]/80">
              {pageData.content}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
