"use client";

import { useState } from "react";
import { getCategoryStyleFromName } from "../../lib/categoryIcons";

interface CategoryNavProps {
    categories: string[];
    activeCategory: string;
    onSelect: (cat: string) => void;
}

export default function CategoryNav({ categories, activeCategory, onSelect }: CategoryNavProps) {

    return (
        <div className="sticky-nav" style={{ overflowX: "auto", whiteSpace: "nowrap", padding: "10px 0", scrollbarWidth: "none" }}>
            <div className="flex gap-3" style={{ padding: "0 1rem" }}>
                {categories.map(cat => {
                    const isActive = activeCategory === cat;
                    const style = getCategoryStyleFromName(cat);

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
                            <span className="tracking-tight">{cat}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
