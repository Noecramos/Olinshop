"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        // Fetch config on mount
        fetch('/api/config')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch config');
                return res.json();
            })
            .then(data => {
                if (data && !data.error) {
                    setConfig(data);
                    applyTheme(data);
                }
            })
            .catch(err => console.error("Failed to load theme config", err));
    }, []);

    const applyTheme = (theme: any) => {
        const root = document.documentElement;

        // Apply Primary Color (Accent) - This controls buttons, links, etc.
        if (theme.primaryColor) {
            root.style.setProperty('--accent', theme.primaryColor);

            // Calculate hover color (slightly darker)
            // Valid for hex colors
            if (theme.primaryColor.startsWith('#')) {
                // Simple darkening logic or just use same color for now to be safe
                // Ideally use color manipulation lib, but we'll map same for now
                root.style.setProperty('--accent-hover', theme.primaryColor);
            }
        }

        // Apply Secondary Color
        if (theme.secondaryColor) {
            root.style.setProperty('--accent-secondary', theme.secondaryColor);
        }

        // Update Gradients
        if (theme.primaryColor && theme.secondaryColor) {
            root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`);
        }
    };

    return (
        <>
            {/* Inject Global Page Header Override if present */}
            {config?.pageHeaderImage && (
                <style jsx global>{`
                    :root {
                        --page-header-image: url('${config.pageHeaderImage}');
                    }
                `}</style>
            )}
            {children}
        </>
    );
}
