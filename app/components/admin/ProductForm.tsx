"use client";

import { useState, useEffect } from "react";
import { compressImage } from "@/lib/compress";

export default function ProductForm({ restaurantId, onSave, refreshCategories }: { restaurantId: string, onSave: () => void, refreshCategories?: number }) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

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
        length: "15",
        trackStock: false,
        stockQuantity: "0",
        isService: false,
        requiresBooking: false,
        serviceDuration: "60",
        isSoldByWeight: false
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

    // Auto-calculate total stock from variants
    useEffect(() => {
        if (form.trackStock && variants.length > 0) {
            let total = 0;
            let hasComplexOptions = false;

            variants.forEach(v => {
                if (Array.isArray(v.options)) {
                    hasComplexOptions = true;
                    v.options.forEach((opt: any) => {
                        total += (parseInt(opt.stock) || 0);
                    });
                }
            });

            if (hasComplexOptions) {
                setForm(prev => ({ ...prev, stockQuantity: total.toString() }));
            }
        }
    }, [variants, form.trackStock]);

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
            length: parseFloat(form.length) || 15,
            trackStock: form.trackStock,
            stockQuantity: form.isSoldByWeight ? (parseFloat(form.stockQuantity) || 0) : (parseInt(form.stockQuantity) || 0),
            isService: form.isService,
            requiresBooking: form.requiresBooking,
            isService: form.isService,
            requiresBooking: form.requiresBooking,
            serviceDuration: parseInt(form.serviceDuration) || 60,
            isSoldByWeight: form.isSoldByWeight
        };
        if (editingId) body.id = editingId;

        try {
            const res = await fetch(url, {
                method: method,
                body: JSON.stringify(body)
            });

            if (res.ok) {
                // Reset
                setForm({ ...form, name: "", description: "", price: "", image: "", weight: "0.5", height: "15", width: "15", length: "15", trackStock: false, stockQuantity: "0" });
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
            length: prod.length?.toString() || "15",
            trackStock: prod.track_stock || false,
            stockQuantity: prod.stock_quantity?.toString() || "0",
            isService: prod.is_service || false,
            requiresBooking: prod.requires_booking || false,
            requiresBooking: prod.requires_booking || false,
            serviceDuration: prod.service_duration?.toString() || "60",
            isSoldByWeight: prod.isSoldByWeight || prod.is_sold_by_weight || false
        });
        setVariants(prod.variants || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({ name: "", description: "", price: "", categoryId: categories[0]?.id || "", image: "", weight: "0.5", height: "15", width: "15", length: "15", trackStock: false, stockQuantity: "0", isService: false, requiresBooking: false, serviceDuration: "60", isSoldByWeight: false });
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
                                <div className="flex justify-between items-end mb-1">
                                    <label htmlFor="productPrice" className="text-xs font-semibold text-gray-500 uppercase ml-1">
                                        {form.isSoldByWeight ? 'Preço (Kg)' : 'Preço'}
                                    </label>
                                    <label className="flex items-center gap-1.5 cursor-pointer bg-gray-100 px-2 py-0.5 rounded-lg hover:bg-gray-200 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="w-3.5 h-3.5 rounded text-accent focus:ring-accent border-gray-300"
                                            checked={form.isSoldByWeight}
                                            onChange={e => setForm({ ...form, isSoldByWeight: e.target.checked })}
                                        />
                                        <span className="text-[10px] font-bold text-gray-600 uppercase">Peso/Granel</span>
                                    </label>
                                </div>
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

                        {/* Service Settings */}
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[10px] font-black text-purple-800 uppercase tracking-widest">Configuração de Agendamento</h4>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isService}
                                        onChange={e => setForm({ ...form, isService: e.target.checked, requiresBooking: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                    <span className="ml-2 text-xs font-bold text-gray-500">É serviço?</span>
                                </label>
                            </div>

                            {form.isService && (
                                <div className="grid grid-cols-2 gap-3 animate-fade-in">
                                    <div>
                                        <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Duração (min)</label>
                                        <input
                                            type="number"
                                            value={form.serviceDuration}
                                            onChange={e => setForm({ ...form, serviceDuration: e.target.value })}
                                            className="w-full p-2 text-xs bg-white rounded-lg border border-purple-100 outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div className="flex items-end pb-2">
                                        <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.requiresBooking}
                                                onChange={e => setForm({ ...form, requiresBooking: e.target.checked })}
                                                className="w-4 h-4 text-purple-600 rounded"
                                            />
                                            Exige Agendamento
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Logistics Section */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
                            <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Logística (Correios)</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="weight" className="text-[9px] font-bold text-gray-400 uppercase ml-1">Peso (kg)</label>
                                    <input
                                        type="number" step="0.01"
                                        id="weight"
                                        name="weight"
                                        className="w-full p-2 text-xs bg-white rounded-lg border border-blue-100 outline-none focus:border-blue-500"
                                        value={form.weight}
                                        onChange={e => setForm({ ...form, weight: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="height" className="text-[9px] font-bold text-gray-400 uppercase ml-1">Alt. (cm)</label>
                                    <input
                                        type="number"
                                        id="height"
                                        name="height"
                                        className="w-full p-2 text-xs bg-white rounded-lg border border-blue-100 outline-none focus:border-blue-500"
                                        value={form.height}
                                        onChange={e => setForm({ ...form, height: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="width" className="text-[9px] font-bold text-gray-400 uppercase ml-1">Larg. (cm)</label>
                                    <input
                                        type="number"
                                        id="width"
                                        name="width"
                                        className="w-full p-2 text-xs bg-white rounded-lg border border-blue-100 outline-none focus:border-blue-500"
                                        value={form.width}
                                        onChange={e => setForm({ ...form, width: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="length" className="text-[9px] font-bold text-gray-400 uppercase ml-1">Comp. (cm)</label>
                                    <input
                                        type="number"
                                        id="length"
                                        name="length"
                                        className="w-full p-2 text-xs bg-white rounded-lg border border-blue-100 outline-none focus:border-blue-500"
                                        value={form.length}
                                        onChange={e => setForm({ ...form, length: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stock Management Section */}
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xs font-black text-orange-800 uppercase tracking-widest">Controle de Estoque</h4>
                                <label htmlFor="trackStock" className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="trackStock"
                                        name="trackStock"
                                        className="sr-only peer"
                                        checked={form.trackStock}
                                        onChange={e => {
                                            const active = e.target.checked;
                                            setForm({ ...form, trackStock: active });

                                            // Auto-convert string options to object options if enabling stock
                                            if (active) {
                                                const converted = variants.map(v => {
                                                    if (typeof v.options === 'string') {
                                                        const names = v.options.split(',').map((s: string) => s.trim()).filter((s: string) => s);
                                                        return {
                                                            ...v,
                                                            options: names.map((name: string) => ({ name, stock: 10, minStock: 0 }))
                                                        };
                                                    }
                                                    return v;
                                                });
                                                setVariants(converted);
                                            }
                                        }}
                                    />
                                    <div className="relative w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-orange-600"></div>
                                </label>
                            </div>

                            {form.trackStock && (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="stockQuantity" className="text-xs font-bold text-gray-400 uppercase ml-1">{form.isSoldByWeight ? 'Quantidade Total (Kg/g)' : 'Quantidade Total'}</label>
                                        <input
                                            type="number" step={form.isSoldByWeight ? "0.001" : "1"}
                                            id="stockQuantity"
                                            name="stockQuantity"
                                            className="w-full p-2.5 text-sm bg-white rounded-lg border border-orange-100 outline-none focus:border-orange-500"
                                            placeholder={form.isSoldByWeight ? "Ex: 20.5" : "Geral do produto"}
                                            value={form.stockQuantity}
                                            onChange={e => setForm({ ...form, stockQuantity: e.target.value })}
                                        />
                                        <p className="text-[11px] text-orange-500 mt-2 font-medium italic leading-tight">
                                            * Se o produto possuir variações, o estoque de cada uma será somado ao total.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Variants Section */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-bold text-gray-700 uppercase">Grade / Variações</h4>
                                <button
                                    type="button"
                                    onClick={() => setVariants([...variants, { name: "", options: "", required: true }])}
                                    className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 font-bold"
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
                                            <label htmlFor={`v-${i}-required`} className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id={`v-${i}-required`}
                                                    name={`v-${i}-required`}
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
                                            id={`v-${i}-name`}
                                            name={`v-${i}-name`}
                                            placeholder="Nome (ex: Tamanho ou Cor)"
                                            className="text-sm font-bold border-b border-gray-100 w-full focus:outline-none focus:border-blue-300 pb-1"
                                            value={v.name}
                                            onChange={e => {
                                                const newV = [...variants];
                                                newV[i].name = e.target.value;
                                                setVariants(newV);
                                            }}
                                        />
                                        <input
                                            id={`v-${i}-options`}
                                            name={`v-${i}-options`}
                                            placeholder="Opções (ex: P, M, G ou Azul, Preto)"
                                            className="text-sm border-none w-full focus:outline-none text-gray-500"
                                            value={typeof v.options === 'string' ? v.options : (Array.isArray(v.options) ? v.options.map((o: any) => typeof o === 'string' ? o : o.name).join(', ') : '')}
                                            onChange={e => {
                                                const val = e.target.value;
                                                const newV = [...variants];

                                                if (form.trackStock) {
                                                    const names = val.split(',').map((s: string) => s.trim()).filter((s: string) => s);
                                                    const currentOpts = Array.isArray(v.options) ? v.options : [];
                                                    newV[i].options = names.map((name: string) => {
                                                        const existing = currentOpts.find((o: any) => (typeof o === 'string' ? o : o.name).trim() === name);
                                                        return {
                                                            name: name.trim(),
                                                            stock: typeof existing === 'object' ? (existing.stock ?? 10) : 10,
                                                            minStock: typeof existing === 'object' ? (existing.minStock || 0) : 0
                                                        };
                                                    });
                                                } else {
                                                    newV[i].options = val;
                                                }
                                                setVariants(newV);
                                            }}
                                        />

                                        {form.trackStock && Array.isArray(v.options) && v.options.length > 0 && (
                                            <div className="mt-2 space-y-2 border-t border-gray-50 pt-2">
                                                <>
                                                    <p className="text-xs font-bold text-orange-400 uppercase tracking-tighter">Estoque por Opção:</p>
                                                    <div className="flex flex-col gap-2">
                                                        {v.options.map((opt: any, optIdx: number) => (
                                                            <div key={optIdx} className="grid grid-cols-3 gap-2 items-center bg-gray-50 p-2.5 rounded-lg border border-orange-100/50">
                                                                <span className="text-xs font-bold text-gray-600 truncate">{opt.name}</span>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Qtd</span>
                                                                    <input
                                                                        type="number"
                                                                        id={`v-${i}-opt-${optIdx}-stock`}
                                                                        name={`v-${i}-opt-${optIdx}-stock`}
                                                                        className="w-full text-xs p-1.5 border border-gray-200 rounded text-center outline-none focus:border-orange-300"
                                                                        value={opt.stock}
                                                                        onChange={e => {
                                                                            const newV = [...variants];
                                                                            const newOpts = [...(newV[i].options as any[])];
                                                                            newOpts[optIdx] = { ...opt, stock: parseInt(e.target.value) || 0 };
                                                                            newV[i].options = newOpts;
                                                                            setVariants(newV);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Mín</span>
                                                                    <input
                                                                        type="number"
                                                                        id={`v-${i}-opt-${optIdx}-min`}
                                                                        name={`v-${i}-opt-${optIdx}-min`}
                                                                        className="w-full text-xs p-1.5 border border-gray-200 rounded text-center outline-none focus:border-orange-300"
                                                                        placeholder="0"
                                                                        value={opt.minStock || 0}
                                                                        onChange={e => {
                                                                            const newV = [...variants];
                                                                            const newOpts = [...(newV[i].options as any[])];
                                                                            newOpts[optIdx] = { ...opt, minStock: parseInt(e.target.value) || 0 };
                                                                            newV[i].options = newOpts;
                                                                            setVariants(newV);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            </div>
                                        )}
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
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Catálogo de Produtos ({products.length})</h3>
                        {products.filter(p => p.track_stock && p.stock_quantity <= 5).length > 0 && (
                            <div className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase inline-flex items-center gap-2 border border-orange-200 mt-2">
                                <span>⚠️ {products.filter(p => p.track_stock && p.stock_quantity <= 5).length} Itens com Estoque Baixo!</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            if (expandedCategories.length === categories.length) setExpandedCategories([]);
                            else setExpandedCategories(categories.map(c => c.name));
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline"
                    >
                        {expandedCategories.length === categories.length ? 'Recolher Tudo' : 'Expandir Tudo'}
                    </button>
                </div>

                <div className="space-y-4">
                    {categories.map(cat => {
                        const catProducts = products.filter(p => p.category === cat.name);
                        const isExpanded = expandedCategories.includes(cat.name);

                        return (
                            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                {/* Category Header */}
                                <button
                                    onClick={() => setExpandedCategories(prev =>
                                        prev.includes(cat.name) ? prev.filter(c => c !== cat.name) : [...prev, cat.name]
                                    )}
                                    className="w-full p-4 flex justify-between items-center bg-gray-50/50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{isExpanded ? '📂' : '📁'}</span>
                                        <div className="text-left">
                                            <h4 className="font-bold text-gray-800">{cat.name}</h4>
                                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{catProducts.length} Produtos</p>
                                        </div>
                                    </div>
                                    <span className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>

                                {/* Products inside Category */}
                                {isExpanded && (
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                                        {catProducts.map(prod => (
                                            <div key={prod.id} className={`bg-white p-4 rounded-xl border transition-all ${editingId === prod.id ? 'border-blue-500 ring-2 ring-blue-100 shadow-md transform scale-[1.02]' : 'border-gray-50 hover:shadow-md'}`}>
                                                <div className="flex gap-4">
                                                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                                                        {prod.image ? (
                                                            <img src={prod.image} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-bold text-sm text-gray-900 truncate">{prod.name}</h4>
                                                            <div className="flex gap-1">
                                                                <button onClick={() => handleEdit(prod)} className="p-1 text-accent hover:bg-blue-50 rounded transition-colors" title="Editar">
                                                                    ✏️
                                                                </button>
                                                                <button onClick={() => handleDelete(prod.id)} className="p-1 text-accent hover:bg-red-50 rounded transition-colors" title="Excluir">
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{prod.description}</p>

                                                        {prod.variants && prod.variants.length > 0 && (
                                                            <div className="flex flex-col gap-1 mt-2">
                                                                {prod.variants.slice(0, 1).map((v: any, idx: number) => (
                                                                    <div key={idx} className="flex flex-wrap gap-1">
                                                                        {(Array.isArray(v.options) ? v.options : []).slice(0, 3).map((opt: any, oIdx: number) => (
                                                                            <span key={oIdx} className="text-[8px] px-1 py-0.25 rounded bg-gray-50 text-gray-400 border border-gray-100">
                                                                                {typeof opt === 'string' ? opt : opt.name}
                                                                            </span>
                                                                        ))}
                                                                        {v.options.length > 3 && <span className="text-[8px] text-gray-400">+{v.options.length - 3}</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="mt-2 flex justify-between items-end">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-green-700 text-sm">R$ {Number(prod.price).toFixed(2)}</span>
                                                                {prod.track_stock && (
                                                                    <span className={`text-[9px] font-black ${prod.stock_quantity <= 0 ? 'text-red-500' : (prod.stock_quantity <= 5 ? 'text-orange-500' : 'text-gray-400')}`}>
                                                                        Est: {prod.stock_quantity}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-[9px] text-gray-300 font-bold">{prod.weight}kg</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {catProducts.length === 0 && (
                                            <div className="col-span-full py-6 text-center text-gray-400 text-xs italic">
                                                Nenhum produto nesta categoria.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {products.length === 0 && (
                        <div className="py-10 text-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            Nenhum produto cadastrado.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
