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
    const [quantity, setQuantity] = useState(1);

    const parsedVariants = (() => {
        try {
            return Array.isArray(item.variants) ? item.variants : (typeof item.variants === 'string' ? JSON.parse(item.variants) : []);
        } catch { return []; }
    })();

    const handleSelect = (variantName: string, option: string) => {
        setSelectedVariants((prev: any) => ({
            ...prev,
            [variantName]: option
        }));
    };

    const getStockForOption = (variantName: string, optionName: string) => {
        if (!item.track_stock) return 9999;
        const variant = parsedVariants.find((v: any) => v.name === variantName);
        if (!variant || !Array.isArray(variant.options)) return 9999;
        const option = variant.options.find((o: any) => (typeof o === 'string' ? o : o.name) === optionName);
        return typeof option === 'object' ? option.stock : 9999;
    };

    const isComplete = () => {
        if (item.track_stock && item.stock_quantity <= 0 && (!parsedVariants || parsedVariants.length === 0)) return false;
        if (!parsedVariants || parsedVariants.length === 0) return true;

        const allSelected = parsedVariants.every((v: any) => v.required === false || selectedVariants[v.name]);
        if (!allSelected) return false;

        // Check stock for each selected variant
        return Object.entries(selectedVariants).every(([vName, oName]) => {
            if (typeof oName !== 'string') return true;
            return getStockForOption(vName, oName) > 0;
        });
    };

    const increaseQuantity = () => {
        const maxStock = item.track_stock ? item.stock_quantity : 9999;
        setQuantity(prev => Math.min(maxStock, prev + 1));
    };
    const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
                {/* Header with Larger Image */}
                <div className="relative h-64 md:h-72 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-3xl overflow-hidden">
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
                        <p className="text-gray-600 mt-2 leading-relaxed">{item.description}</p>
                        <p className="text-2xl font-black text-gray-900 mt-4">
                            {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    </div>
                </div>

                {/* Variants Selection */}
                <div className="p-6 space-y-4">
                    {parsedVariants.map((v: any, i: number) => (
                        <div key={i} className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                {v.name}
                                {v.required !== false && !selectedVariants[v.name] && <span className="text-[10px] text-blue-500 normal-case font-normal">(Obrigatório)</span>}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(typeof v.options === 'string' ? v.options.split(',') : v.options).map((opt: any) => {
                                    const cleanOpt = typeof opt === 'string' ? opt.trim() : opt.name;
                                    const isSelected = selectedVariants[v.name] === cleanOpt;
                                    const stock = getStockForOption(v.name, cleanOpt);
                                    const isOutOfStock = item.track_stock && stock <= 0;

                                    return (
                                        <button
                                            key={cleanOpt}
                                            disabled={isOutOfStock}
                                            onClick={() => handleSelect(v.name, cleanOpt)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all relative ${isSelected
                                                ? 'bg-accent border-accent text-white shadow-md transform scale-105'
                                                : isOutOfStock
                                                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-60'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'
                                                }`}
                                        >
                                            {cleanOpt}
                                            {isOutOfStock && <span className="absolute -top-1 -right-1 text-[8px] bg-gray-400 text-white px-1 rounded-full">Esgotado</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Quantity Selector */}
                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Quantidade</h3>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={decreaseQuantity}
                                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center font-bold text-xl text-gray-700"
                            >
                                −
                            </button>
                            <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                            <button
                                onClick={increaseQuantity}
                                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center font-bold text-xl text-gray-700"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <button
                        disabled={!isComplete()}
                        onClick={() => onConfirm({ ...selectedVariants, quantity })}
                        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 ${isComplete()
                            ? 'bg-accent text-white hover:bg-accent-hover shadow-pink-200'
                            : (item.track_stock && item.stock_quantity <= 0) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {item.track_stock && item.stock_quantity <= 0
                            ? 'Produto Esgotado'
                            : isComplete()
                                ? `Adicionar ${quantity} ${quantity > 1 ? 'itens' : 'item'} ao Carrinho`
                                : 'Selecione as opções'}
                    </button>
                </div>
            </div>
        </div>
    );
}
