import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = params.slug;

    // Fetch store details to get name and image for the dynamic card
    // We use a safe fallback for the base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://olinshop.vercel.app';

    try {
        const res = await fetch(`${baseUrl}/api/stores?slug=${slug}`);
        const store = await res.json();

        if (!store || store.error) {
            return {
                title: 'OlinShop',
            };
        }

        // Construct the Dynamic Image URL
        const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(store.name)}&subtitle=${encodeURIComponent(store.popularTitle || store.welcomeSubtitle || 'Sua loja online')}&image=${encodeURIComponent(store.banner || store.image || '')}`;

        return {
            title: `${store.name} | OlinShop`,
            description: store.welcomeSubtitle || 'Peça agora pelo OlinShop!',
            openGraph: {
                title: store.name,
                description: store.welcomeSubtitle || 'Peça agora pelo OlinShop!',
                images: [
                    {
                        url: ogImageUrl,
                        width: 1200,
                        height: 630,
                        alt: store.name,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: store.name,
                description: store.welcomeSubtitle,
                images: [ogImageUrl],
            },
        };
    } catch (e) {
        return {
            title: 'OlinShop',
            description: 'Sua loja online favorita',
        };
    }
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
