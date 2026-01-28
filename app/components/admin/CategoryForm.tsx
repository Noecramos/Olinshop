"use client";

import { useState, useEffect } from "react";

export default function CategoryForm({ restaurantId, onSave }: { restaurantId: string, onSave: () => void }) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [customSubcategory, setCustomSubcategory] = useState("");
    const [categories, setCategories] = useState<any[]>([]);

    const fetchCategories = () => {
        fetch(`/api/categories?restaurantId=${restaurantId}`)
            .then(res => res.json())
            .then(data => setCategories(data || []))
            .catch(() => { });
    };

    // Initial fetch
    useEffect(() => {
        fetchCategories();
    }, [restaurantId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Combine selected subcategories into a comma-separated string
            const subcategoryString = subcategories.length > 0 ? subcategories.join(', ') : null;

            const res = await fetch('/api/categories', {
                method: 'POST',
                body: JSON.stringify({ restaurantId, name, subcategory: subcategoryString })
            });
            const data = await res.json();

            if (res.ok) {
                setName("");
                setSubcategories([]);
                setCustomSubcategory("");
                fetchCategories(); // Refresh local list
                onSave(); // Notify parent
            } else {
                alert(data.error || 'Erro ao salvar categoria');
            }
        } catch (err) {
            alert('Erro ao salvar categoria');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja excluir esta categoria?')) return;
        try {
            await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
            fetchCategories();
            onSave();
        } catch (e) {
            alert('Erro ao excluir');
        }
    };

    const subcategoryOptions = ['Jovem', 'Adulto', 'Infantil', 'Feminino', 'Masculino', 'Unissex'];

    const toggleSubcategory = (option: string) => {
        setSubcategories(prev => {
            if (prev.includes(option)) {
                return prev.filter(s => s !== option);
            } else {
                return [...prev, option];
            }
        });
    };

    const addCustomSubcategory = () => {
        if (customSubcategory.trim() && !subcategories.includes(customSubcategory.trim())) {
            setSubcategories(prev => [...prev, customSubcategory.trim()]);
            setCustomSubcategory("");
        }
    };

    const removeSubcategory = (sub: string) => {
        setSubcategories(prev => prev.filter(s => s !== sub));
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label htmlFor="categoryDescription" className="text-xs font-semibold text-gray-500 uppercase ml-1">Nova Categoria</label>
                        <input
                            id="categoryDescription"
                            name="categoryName"
                            className="w-full p-3 bg-white rounded-xl border-2 border-gray-100 focus:border-red-500 outline-none transition-all"
                            placeholder="Ex: Roupas Femininas"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all"
                        disabled={loading}
                    >
                        {loading ? '...' : '+ Adicionar'}
                    </button>
                </div>

                {/* Subcategory Selection */}
                <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase ml-1 mb-2 block">
                        Subcategorias (Opcional - Selecione múltiplas)
                    </span>

                    {/* Selected subcategories display */}
                    {subcategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="text-xs font-semibold text-blue-700">Selecionadas:</span>
                            {subcategories.map(sub => (
                                <span
                                    key={sub}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium"
                                >
                                    {sub}
                                    <button
                                        type="button"
                                        onClick={() => removeSubcategory(sub)}
                                        className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Predefined options */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {subcategoryOptions.map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => toggleSubcategory(option)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${subcategories.includes(option)
                                    ? 'bg-accent text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {/* Custom subcategory input */}
                    <div className="flex gap-2">
                        <label htmlFor="customSubcategory" className="sr-only">Subcategoria Personalizada</label>
                        <input
                            type="text"
                            id="customSubcategory"
                            name="customSubcategory"
                            className="flex-1 p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-accent outline-none transition-all text-sm"
                            placeholder="Ou digite uma subcategoria personalizada..."
                            value={customSubcategory}
                            onChange={e => setCustomSubcategory(e.target.value)}
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addCustomSubcategory();
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={addCustomSubcategory}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            + Adicionar
                        </button>
                    </div>
                </div>
            </form>

            {/* List of Categories */}
            <div className="flex flex-wrap gap-2">
                {categories.map((cat: any) => (
                    <div key={cat.id} className="bg-white border border-gray-200 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                        <span className="font-bold text-gray-700 text-sm">
                            {cat.name}
                            {cat.subcategory && <span className="text-gray-500 font-normal ml-1">({cat.subcategory})</span>}
                        </span>
                        <button
                            onClick={() => handleDelete(cat.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Excluir categoria"
                            type="button"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
