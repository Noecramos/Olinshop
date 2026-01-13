"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductModalProps {
    item: any;
    onClose: () => void;
    onConfirm: (selectedVariants: any) => void;
}

export default function ProductModal({ item, onClose, onConfirm }: ProductModalProps) {
    const [selectedVariants, setSelectedVariants] = useState<any>({});

    const handleSelect = (variantName: string, option: string) => {
        setSelectedVariants((prev: any) => ({
            ...prev,
            [variantName]: option
        }));
    };

    const isComplete = () => {
        if (!item.variants || item.variants.length === 0) return true;
        return item.variants.every((v: any) => selectedVariants[v.name]);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                {/* Header with Image */}
                <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-3xl overflow-hidden">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all active:scale-95"
                    >
                        <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    {item.image && (
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    )}
                </div>

                {/* Product Info */}
                <div className="p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
                        <p className="text-gray-500 mt-1">{item.description}</p>
                        <p className="text-xl font-black text-gray-900 mt-2">
                            {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    </div>
                </div>

                {/* Variants Selection */}
                <div className="p-6 space-y-4">
                    {item.variants && item.variants.map((v: any, i: number) => (
                        <div key={i} className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                {v.name}
                                {!selectedVariants[v.name] && <span className="text-[10px] text-blue-500 normal-case font-normal">(Obrigatório)</span>}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(typeof v.options === 'string' ? v.options.split(',') : v.options).map((opt: string) => {
                                    const cleanOpt = opt.trim();
                                    const isSelected = selectedVariants[v.name] === cleanOpt;
                                    return (
                                        <button
                                            key={cleanOpt}
                                            onClick={() => handleSelect(v.name, cleanOpt)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${isSelected
                                                ? 'bg-accent border-accent text-white shadow-md transform scale-105'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'
                                                }`}
                                        >
                                            {cleanOpt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <button
                        disabled={!isComplete()}
                        onClick={() => onConfirm(selectedVariants)}
                        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 ${isComplete()
                            ? 'bg-accent text-white hover:bg-accent-hover shadow-pink-200'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isComplete() ? 'Adicionar ao Carrinho' : 'Selecione as opções'}
                    </button>
                </div>
            </div>
        </div>
    );
}
