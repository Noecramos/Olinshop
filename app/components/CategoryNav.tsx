"use client";

import { useState } from "react";

interface CategoryNavProps {
    categories: string[];
    activeCategory: string;
    onSelect: (cat: string) => void;
}

export default function CategoryNav({ categories, activeCategory, onSelect }: CategoryNavProps) {

    // Helper to auto-generate colorful styles keys based on category name
    const getCategoryStyle = (name: string) => {
        const lower = name.toLowerCase();
        // Generic Shop Categories
        if (lower.includes('bermuda') || lower.includes('short')) return { icon: '🩳', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' };
        if (lower.includes('calça') || lower.includes('jeans')) return { icon: '👖', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' };
        if (lower.includes('vestido') || lower.includes('saia')) return { icon: '👗', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' };
        if (lower.includes('biquini') || lower.includes('maiô') || lower.includes('banho') || lower.includes('praia')) return { icon: '👙', bg: '#ECFEFF', border: '#CFFAFE', text: '#0E7490' };
        if (lower.includes('casaco') || lower.includes('jaqueta') || lower.includes('moletom') || lower.includes('frio')) return { icon: '🧥', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' };
        if (lower.includes('social') || lower.includes('gola')) return { icon: '👔', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' };
        if (lower.includes('polo')) return { icon: '👕', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' }; // Polo is a collared t-shirt, distinct style
        if (lower.includes('camis') || lower.includes('blus') || lower.includes('t-shirt') || lower.includes('roupa') || lower.includes('moda') || lower.includes('vest')) return { icon: '👕', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' };
        if (lower.includes('eletr') || lower.includes('tech') || lower.includes('celu') || lower.includes('fone') || lower.includes('audio') || lower.includes('carreg')) return { icon: '💻', bg: '#F1F5F9', border: '#CBD5E1', text: '#334155' };
        if (lower.includes('calc') || lower.includes('tenis') || lower.includes('sapato') || lower.includes('sandalia')) return { icon: '👟', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' };
        if (lower.includes('salto') || lower.includes('scarpin')) return { icon: '👠', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' };
        if (lower.includes('bota') || lower.includes('coturno')) return { icon: '👢', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' };
        if (lower.includes('boné') || lower.includes('bone') || lower.includes('chapeu')) return { icon: '🧢', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' };
        if (lower.includes('oculos') || lower.includes('óculos')) return { icon: '🕶️', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' };
        if (lower.includes('bolsa') || lower.includes('mochila') || lower.includes('mala')) return { icon: '👜', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' };
        if (lower.includes('carteira')) return { icon: '👛', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' };
        if (lower.includes('acess') || lower.includes('joia') || lower.includes('relo') || lower.includes('pulseira') || lower.includes('colar')) return { icon: '⌚', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' };
        if (lower.includes('casa') || lower.includes('decor') || lower.includes('move')) return { icon: '🏠', bg: '#ECFDF5', border: '#D1FAE5', text: '#047857' };
        if (lower.includes('beleza') || lower.includes('cosm') || lower.includes('perf')) return { icon: '💄', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' };

        // Legacy/Food Categories
        if (lower.includes('pizza')) return { icon: '🍕', bg: '#FFF5EB', border: '#FFD3A3', text: '#E06C00' };
        if (lower.includes('lanche') || lower.includes('burger') || lower.includes('hamb')) return { icon: '🍔', bg: '#FFEBEE', border: '#FFCDD2', text: '#C62828' };
        if (lower.includes('bebida') || lower.includes('suco') || lower.includes('refr')) return { icon: '🥤', bg: '#E3F2FD', border: '#BBDEFB', text: '#1565C0' };
        if (lower.includes('açaí') || lower.includes('acai') || lower.includes('doce') || lower.includes('sobremesa')) return { icon: '🍧', bg: '#FCE4EC', border: '#F8BBD0', text: '#C2185B' };
        if (lower.includes('combo') || lower.includes('promo')) return { icon: '🏷️', bg: '#F3E5F5', border: '#E1BEE7', text: '#6A1B9A' };
        if (lower.includes('porção') || lower.includes('petisco')) return { icon: '🍟', bg: '#FFF8E1', border: '#FFECB3', text: '#FF6F00' };

        // Delivery / Logistics specific
        if (lower.includes('entrega') || lower.includes('delivery') || lower.includes('ifood') || lower.includes('motoboy')) return { icon: '🛵', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' };

        // Default
        return { icon: '📦', bg: '#F5F5F5', border: '#E0E0E0', text: '#616161' };
    };

    return (
        <div className="sticky-nav" style={{ overflowX: "auto", whiteSpace: "nowrap", padding: "10px 0", scrollbarWidth: "none" }}>
            <div className="flex gap-3" style={{ padding: "0 1rem" }}>
                {categories.map(cat => {
                    const style = getCategoryStyle(cat);
                    const isActive = activeCategory === cat;
                    // If category name already has emoji, don't add another icon
                    const hasEmoji = /\p{Emoji}/u.test(cat);
                    const displayIcon = hasEmoji ? '' : style.icon;

                    return (
                        <button
                            key={cat}
                            onClick={() => onSelect(cat)}
                            className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 py-3 px-6"
                            style={{
                                borderRadius: "20px",
                                border: isActive ? `2px solid #FF1B8D` : `1px solid ${style.border}`,
                                background: isActive ? 'white' : style.bg,
                                color: isActive ? '#FF1B8D' : (style.text === '#616161' ? '#424242' : style.text),
                                fontWeight: 800,
                                fontSize: "0.95rem",
                                opacity: isActive ? 1 : 0.9,
                                boxShadow: isActive ? '0 10px 20px rgba(255,27,141,0.15)' : 'none'
                            }}
                        >
                            {displayIcon && <span className="text-xl">{displayIcon}</span>}
                            <span className="tracking-tight">{cat}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
