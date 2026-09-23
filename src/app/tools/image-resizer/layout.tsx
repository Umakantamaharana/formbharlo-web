import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://formbharlo.in';

export const metadata: Metadata = {
  title: 'Govt Exam Photo & Signature Resizer 2026 (20KB - 50KB Online Compressor)',
  description:
    'Free online photo and signature resizer for SSC CGL/CHSL, UPSC, RRB Railway, IBPS Banking, and State PSC exams. Compress images to exact 20-50 KB, 3.5x4.5 cm dimensions with 100% client-side privacy.',
  keywords: [
    'SSC photo resizer',
    'SSC signature resizer 10 to 20 kb',
    'Govt exam image resizer',
    'UPSC photo size compressor',
    'RRB photo signature tool',
    'IBPS image resizer 20kb to 50kb',
    'Passport photo 3.5 x 4.5 cm online',
    'Sarkari exam photo crop tool',
  ],
  alternates: {
    canonical: `${siteUrl}/tools/image-resizer`,
  },
  openGraph: {
    title: 'Free Govt Exam Photo & Signature Resizer 2026 | FormBharlo',
    description:
      'Instantly resize and compress passport photos & signatures to exact government portal requirements (SSC, UPSC, RRB, IBPS). 100% free & private.',
    url: `${siteUrl}/tools/image-resizer`,
    siteName: 'FormBharlo',
    images: [`${siteUrl}/api/og?title=Govt+Exam+Photo+Resizer&category=Tools`],
  },
};

export default function ImageResizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
