"use client";

import { useState, useEffect } from "react";
import { compressImage } from "@/lib/compress";

export default function ProductForm({ restaurantId, onSave, refreshCategories }: { restaurantId: string, onSave: () => void, refreshCategories?: number }) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Initial Form State
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        image: "",
        weight: "0.5",
        height: "15",
        width: "15",
        length: "15"
    });
    const [variants, setVariants] = useState<any[]>([]); // [{ name: "Tamanho", options: ["P", "M", "G"] }]

    // Fetch Data
    const fetchData = async () => {
        // Fetch Categories
        fetch(`/api/categories?restaurantId=${restaurantId}`)
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                // Default category if creating new
                if (data.length > 0 && !form.categoryId && !editingId) {
                    setForm(prev => ({ ...prev, categoryId: data[0].id }));
                }
            });

        // Fetch Products
        fetch(`/api/products?restaurantId=${restaurantId}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => setProducts(Array.isArray(data) ? data : []));
    };

    useEffect(() => {
        fetchData();
    }, [restaurantId, refreshCategories]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        try {
            const compressed = await compressImage(e.target.files[0]);
            const formData = new FormData();
            formData.append("file", compressed);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });

            if (!res.ok) {
                if (res.status === 413) throw new Error("413");
                throw new Error("Erro");
            }

            const data = await res.json();
            if (data.success) setForm({ ...form, image: data.url });
        } catch (err: any) {
            if (err.message === "413") alert("Imagem muito grande mesmo comprimida!");
            else alert("Erro ao fazer upload");
        } finally { setUploading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const url = editingId ? '/api/products' : '/api/products';
        const method = editingId ? 'PUT' : 'POST';

        // Find category name from ID
        const selectedCat = categories.find(c => c.id === form.categoryId);
        const categoryName = selectedCat ? selectedCat.name : "Geral";

        const body: any = {
            ...form,
            restaurantId,
            price: parseFloat(form.price),
            category: categoryName,
            variants,
            weight: parseFloat(form.weight) || 0.5,
            height: parseFloat(form.height) || 15,
            width: parseFloat(form.width) || 15,
            length: parseFloat(form.length) || 15
        };
        if (editingId) body.id = editingId;

        try {
            const res = await fetch(url, {
                method: method,
                body: JSON.stringify(body)
            });

            if (res.ok) {
                // Reset
                setForm({ ...form, name: "", description: "", price: "", image: "", weight: "0.5", height: "15", width: "15", length: "15" });
                setVariants([]);
                setEditingId(null);
                fetchData(); // Refresh list
                onSave();
            } else {
                alert('Erro ao salvar');
            }
        } catch (err) { alert('Erro na conexão'); }
        finally { setLoading(false); }
    };

    const handleEdit = (prod: any) => {
        setEditingId(prod.id);

        // Find ID from category name
        const foundCat = categories.find(c => c.name === prod.category);
        const catId = foundCat ? foundCat.id : (categories.length > 0 ? categories[0].id : "");

        setForm({
            name: prod.name,
            description: prod.description || "",
            price: prod.price.toString(),
            categoryId: catId,
            image: prod.image || "",
            weight: prod.weight?.toString() || "0.5",
            height: prod.height?.toString() || "15",
            width: prod.width?.toString() || "15",
            length: prod.length?.toString() || "15"
        });
        setVariants(prod.variants || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({ name: "", description: "", price: "", categoryId: categories[0]?.id || "", image: "", weight: "0.5", height: "15", width: "15", length: "15" });
        setVariants([]);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este produto?')) return;
        try {
            await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            fetchData();
        } catch (e) { alert('Erro ao excluir'); }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Form */}
            <div className="w-full lg:w-1/3">
                <form onSubmit={handleSubmit} className="card p-6 sticky top-4 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg">{editingId ? 'Editar Produto' : 'Novo Produto'}</h3>
                        {editingId && (
                            <button type="button" onClick={handleCancel} className="text-xs text-accent font-bold hover:underline">
                                Cancelar
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* Image Upload Area */}
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors bg-white">
                            <input type="file" id="prod-img" name="image" accept="image/*" onChange={handleUpload} className="hidden" />
                            <label htmlFor="prod-img" className="cursor-pointer block">
                                {form.image ? (
                                    <div className="relative h-40 w-full">
                                        <img src={form.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                        <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs py-1 rounded-b-lg">Trocar Imagem</div>
                                    </div>
                                ) : (
                                    <div className="py-8">
                                        <div className="text-4xl mb-2">📸</div>
                                        <p className="text-sm text-gray-500">{uploading ? "Enviando..." : "Toque para adicionar foto"}</p>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Input Fields */}
                        <div>
                            <label htmlFor="productName" className="text-xs font-semibold text-gray-500 uppercase ml-1">Nome do Produto</label>
                            <input
                                id="productName"
                                name="productName"
                                className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all"
                                placeholder="Ex: Camiseta Oversized ou iPhone 15"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="productPrice" className="text-xs font-semibold text-gray-500 uppercase ml-1">Preço (R$)</label>
                                <input
                                    id="productPrice"
                                    name="productPrice"
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all"
                                    placeholder="0,00"
                                    type="number" step="0.01"
                                    value={form.price}
                                    onChange={e => setForm({ ...form, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="productCategory" className="text-xs font-semibold text-gray-500 uppercase ml-1">Categoria</label>
                                <select
                                    id="productCategory"
                                    name="productCategory"
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none"
                                    value={form.categoryId}
                                    onChange={e => setForm({ ...form, categoryId: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Selecione...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="productDescription" className="text-xs font-semibold text-gray-500 uppercase ml-1">Descrição</label>
                            <textarea
                                id="productDescription"
                                name="productDescription"
                                className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all"
                                placeholder="Detalhes, especificações, etc."
                                rows={2}
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        {/* Logistics Section */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
                            <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Logística (Correios)</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Peso (kg)</label>
                                    <input
                                        type="number" step="0.01"
                                        className="w-full p-2 text-xs bg-white rounded-lg border border-blue-100 outline-none focus:border-blue-500"
                                        value={form.weight}
                                        onChange={e => setForm({ ...form, weight: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Alt. (cm)</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 text-xs bg-white rounded-lg border border-blue-100 outline-none focus:border-blue-500"
                                        value={form.height}
                                        onChange={e => setForm({ ...form, height: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Larg. (cm)</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 text-xs bg-white rounded-lg border border-blue-100 outline-none focus:border-blue-500"
                                        value={form.width}
                                        onChange={e => setForm({ ...form, width: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Comp. (cm)</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 text-xs bg-white rounded-lg border border-blue-100 outline-none focus:border-blue-500"
                                        value={form.length}
                                        onChange={e => setForm({ ...form, length: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Variants Section */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-xs font-bold text-gray-700 uppercase">Grade / Variações</h4>
                                <button
                                    type="button"
                                    onClick={() => setVariants([...variants, { name: "", options: "", required: true }])}
                                    className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-100 font-bold"
                                >
                                    + Adicionar
                                </button>
                            </div>

                            <div className="space-y-3">
                                {variants.map((v, i) => (
                                    <div key={i} className="bg-white p-3 rounded-lg border border-gray-100 flex flex-col gap-2 relative group">
                                        <button
                                            type="button"
                                            onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                                            className="absolute -top-2 -right-2 bg-red-100 text-accent w-5 h-5 rounded-full flex items-center justify-center text-[10px] hover:bg-red-200"
                                        >
                                            ✕
                                        </button>
                                        <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-lg border border-gray-100/50">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={v.required !== false} // Default to true if undefined
                                                    onChange={e => {
                                                        const newV = [...variants];
                                                        newV[i].required = e.target.checked;
                                                        setVariants(newV);
                                                    }}
                                                    className="w-3 h-3 rounded text-blue-500 focus:ring-blue-500"
                                                />
                                                Obrigatório
                                            </label>
                                        </div>
                                        <input
                                            placeholder="Nome (ex: Tamanho ou Cor)"
                                            className="text-xs font-bold border-b border-gray-100 w-full focus:outline-none focus:border-blue-300 pb-1"
                                            value={v.name}
                                            onChange={e => {
                                                const newV = [...variants];
                                                newV[i].name = e.target.value;
                                                setVariants(newV);
                                            }}
                                        />
                                        <input
                                            placeholder="Opções (ex: P, M, G ou Azul, Preto)"
                                            className="text-xs border-none w-full focus:outline-none text-gray-500"
                                            value={typeof v.options === 'string' ? v.options : v.options.join(', ')}
                                            onChange={e => {
                                                const newV = [...variants];
                                                newV[i].options = e.target.value;
                                                setVariants(newV);
                                            }}
                                        />
                                    </div>
                                ))}
                                {variants.length === 0 && (
                                    <p className="text-[10px] text-gray-400 text-center italic">Nenhuma variação (Tamanho, Cor, etc)</p>
                                )}
                            </div>
                        </div>

                        <button type="submit" className={`w-full py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all ${editingId ? 'bg-accent hover:bg-accent-hover' : 'bg-[#1D1D1F] hover:bg-black'}`} disabled={loading || uploading}>
                            {loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Adicionar Produto'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Right Column: List */}
            <div className="w-full lg:w-2/3">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Produtos Cadastrados ({products.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map(prod => (
                        <div key={prod.id} className={`bg-white p-4 rounded-2xl border transition-all ${editingId === prod.id ? 'border-blue-500 ring-2 ring-blue-100 shadow-md transform scale-[1.02]' : 'border-gray-100 hover:shadow-md'}`}>
                            <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                                    {prod.image ? (
                                        <img src={prod.image} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-900 truncate">{prod.name}</h4>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(prod)} className="p-1.5 text-accent hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(prod.id)} className="p-1.5 text-accent hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{prod.description}</p>
                                    {prod.variants && prod.variants.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {prod.variants.map((v: any, idx: number) => (
                                                <span key={idx} className="text-[9px] bg-blue-50 text-accent px-1.5 py-0.5 rounded border border-blue-100">
                                                    {v.name}: {typeof v.options === 'string' ? v.options : (Array.isArray(v.options) ? v.options.join(',') : '')}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="mt-2 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-green-700 leading-none">R$ {Number(prod.price).toFixed(2)}</span>
                                            <span className="text-[9px] text-gray-400 mt-1 font-bold">{prod.weight}kg • {prod.length}x{prod.width}x{prod.height}cm</span>
                                        </div>
                                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full text-gray-600 font-medium">{prod.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-full py-10 text-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            Nenhum produto cadastrado.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
