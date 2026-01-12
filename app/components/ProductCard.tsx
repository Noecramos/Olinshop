"use client";

import Image from "next/image";

interface ProductCardProps {
    item: {
        id: string | number;
        name: string;
        description: string;
        price: number;
        category: string;
        image?: string;
    };
    onAdd: () => void;
}

export default function ProductCard({ item, onAdd }: ProductCardProps) {
    return (
        <div className="product-card" onClick={onAdd}>

            {/* Image Section */}
            <div className="product-image-wrapper">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="product-image-transition"
                        style={{ objectFit: "cover" }}
                    />
                ) : (
                    <div style={{ width: "100%", height: "100%", background: "#f5f5f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d2d2d7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                            <path d="m3.3 7 8.7 5 8.7-5" />
                            <path d="M12 22V12" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div style={{ padding: "0.75rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ marginBottom: "0.5rem" }}>
                    <h3 className="font-medium truncate" style={{ color: "var(--text)", marginBottom: "0.25rem", fontSize: "0.9rem" }}>{item.name}</h3>
                    <p className="line-clamp-2" style={{ color: "var(--text-secondary)", fontSize: "0.75rem", lineHeight: "1.3" }}>{item.description}</p>
                </div>

                <div className="flex justify-between items-center" style={{ marginTop: "auto" }}>
                    <span style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "1rem" }}>
                        {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <button className="add-btn">
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}
