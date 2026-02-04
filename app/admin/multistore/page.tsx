"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MultiStoreLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [stores, setStores] = useState<any[] | null>(null);
    const [ownerName, setOwnerName] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/unified-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                if (data.stores.length === 1) {
                    // Only 1 store, redirect directly
                    const store = data.stores[0];
                    // Set local session for that store
                    localStorage.setItem(`admin_session_${store.slug}`, 'true');
                    router.push(`/admin/${store.slug}`);
                } else {
                    // Multiple stores, show selection
                    setStores(data.stores);
                    setOwnerName(data.ownerName);
                    // We can also store a "super session" here if we wanted
                }
            } else {
                alert(data.error || "Erro ao entrar");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão");
        } finally {
            setLoading(false);
        }
    };

    const accessStore = (slug: string) => {
        // Grant access to specific store
        localStorage.setItem(`admin_session_${slug}`, 'true');
        router.push(`/admin/${slug}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {!stores ? (
                    // Login Form
                    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-black text-gray-900 mb-2">Login Central</h1>
                            <p className="text-gray-500 font-medium">Gerencie todas as suas lojas em um só lugar</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email do Proprietário</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-accent rounded-2xl outline-none transition-all"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Senha</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-accent rounded-2xl outline-none transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full p-4 bg-accent text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-all disabled:opacity-50 disabled:transform-none"
                            >
                                {loading ? 'Verificando...' : 'Entrar na Rede'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link href="/admin" className="text-sm font-bold text-gray-400 hover:text-gray-600">
                                ← Voltar para login por loja
                            </Link>
                        </div>
                    </div>
                ) : (
                    // Store Selection
                    <div className="animate-fade-in">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Olá, {ownerName}! 👋</h2>
                            <p className="text-gray-500 font-medium">Selecione uma loja para gerenciar</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stores.map((store) => (
                                <button
                                    key={store.id}
                                    onClick={() => accessStore(store.slug)}
                                    className="bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-accent hover:shadow-xl transition-all duration-300 group text-left"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl overflow-hidden">
                                            {store.image ? (
                                                <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                                            ) : (
                                                '🏪'
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-accent transition-colors">{store.name}</h3>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">#{store.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${store.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {store.active ? 'Ativa' : 'Inativa'}
                                        </span>
                                        <span className="text-gray-300 group-hover:translate-x-1 transition-transform">➜</span>
                                    </div>
                                </button>
                            ))}

                            {/* Option to create new store */}
                            <Link href="/register" className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-accent hover:bg-white transition-all flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-accent group">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm group-hover:shadow-md transition-all">
                                    ➕
                                </div>
                                <span className="font-bold">Adicionar Nova Loja</span>
                            </Link>
                        </div>

                        <div className="mt-12 text-center">
                            <button
                                onClick={() => setStores(null)}
                                className="text-sm font-bold text-gray-400 hover:text-gray-600 underline"
                            >
                                Sair da conta
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
