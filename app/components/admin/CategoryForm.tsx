"use client";

import { useState, useEffect } from "react";

export default function CategoryForm({ restaurantId, onSave }: { restaurantId: string, onSave: () => void }) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [subcategory, setSubcategory] = useState("");
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
            const res = await fetch('/api/categories', {
                method: 'POST',
                body: JSON.stringify({ restaurantId, name, subcategory: subcategory || null })
            });
            const data = await res.json();

            if (res.ok) {
                setName("");
                setSubcategory("");
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
                    <label className="text-xs font-semibold text-gray-500 uppercase ml-1 mb-2 block">
                        Subcategoria (Opcional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {subcategoryOptions.map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setSubcategory(subcategory === option ? '' : option)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${subcategory === option
                                        ? 'bg-accent text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        className="w-full mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-accent outline-none transition-all text-sm"
                        placeholder="Ou digite uma subcategoria personalizada..."
                        value={!subcategoryOptions.includes(subcategory) ? subcategory : ''}
                        onChange={e => setSubcategory(e.target.value)}
                    />
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
