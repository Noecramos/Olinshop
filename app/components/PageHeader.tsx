"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function PageHeader() {
    const [src, setSrc] = useState("https://rfbwcz2lzvkh4d7s.public.blob.vercel-storage.com/olinshop-header.png");

    useEffect(() => {
        fetch('/api/config')
            .then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.json();
            })
            .then(data => {
                if (data && !data.error) {
                    // Use pageHeaderImage if set, otherwise headerImage (Logo), otherwise default
                    if (data.pageHeaderImage) setSrc(data.pageHeaderImage);
                    else if (data.headerImage) setSrc(data.headerImage);
                }
            })
            .catch(() => { });
    }, []);

    return (
        <div className="w-full bg-gradient-to-r from-purple-100 to-pink-100 py-6 px-4 flex justify-center items-center relative">
            {/* Fallback pattern background if needed, or simple gradient */}
            <Image
                src={src}
                alt="OlinShop"
                width={300}
                height={100}
                style={{ objectFit: 'contain', maxHeight: '100px', width: 'auto' }}
                priority
                unoptimized
            />
        </div>
    );
}
