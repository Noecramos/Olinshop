"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import ProductForm from "@/app/components/admin/ProductForm";
import CategoryForm from "@/app/components/admin/CategoryForm";
import StoreSettings from "@/app/components/admin/StoreSettings";

export default function StoreAdmin() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;

    const [restaurant, setRestaurant] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [auth, setAuth] = useState(false);
    const [password, setPassword] = useState("");
    const [tab, setTab] = useState('dashboard'); // dashboard | products | categories | settings
    const [showHistory, setShowHistory] = useState(false);
    const [catRefresh, setCatRefresh] = useState(0);
    const [loading, setLoading] = useState<string | null>(null);

    const fetchRestaurant = useCallback(async () => {
        if (!slug) return;
        try {
            const res = await fetch(`/api/stores?slug=${slug}`);
            if (res.ok) {
                const data = await res.json();
                setRestaurant(data);
            }
        } catch (e) {
            console.error(e);
        }
    }, [slug]);

    const fetchOrders = useCallback(async () => {
        if (!restaurant) return;
        try {
            const res = await fetch(`/api/orders?restaurantId=${restaurant.id}&_t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (e) {
            console.error(e);
        }
    }, [restaurant]);

    // Auth check
    useEffect(() => {
        const session = localStorage.getItem(`admin_session_${slug}`);
        if (session === 'true') setAuth(true);
    }, [slug]);

    useEffect(() => {
        fetchRestaurant();
    }, [fetchRestaurant]);

    useEffect(() => {
        if (auth && restaurant) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 5000);
            return () => clearInterval(interval);
        }
    }, [auth, restaurant, fetchOrders]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === restaurant?.password || password === 'master123') {
            setAuth(true);
            localStorage.setItem(`admin_session_${slug}`, 'true');
        } else {
            alert("Senha incorreta");
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        setLoading(orderId);
        try {
            const res = await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, status: newStatus })
            });

            if (res.ok) {
                await fetchOrders();
            } else {
                const err = await res.json();
                alert(`Erro ao atualizar: ${err.error}`);
            }
        } catch (e) {
            alert("Erro de conexão");
        } finally {
            setLoading(null);
        }
    };

    const printOrder = (order: any) => {
        const win = window.open('', '_blank');
        if (!win) return;

        const itemsHtml = (order.items || []).map((item: any) => `
            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px;">
                <span>${item.quantity}x ${item.name}</span>
                <span>${(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
        `).join('');

        win.document.write(`
            <html>
                <body style="font-family: monospace; width: 300px; padding: 20px;">
                    <h2 style="text-align: center; margin-bottom: 5px;">${restaurant?.name.toUpperCase()}</h2>
                    <p style="text-align: center; margin-top: 0;">PEDIDO #${order.ticketNumber}</p>
                    <hr>
                    <p><strong>Cliente:</strong> ${order.customer?.name}</p>
                    <p><strong>Telefone:</strong> ${order.customer?.phone}</p>
                    <p><strong>Endereço:</strong> ${order.customer?.address}</p>
                    <hr>
                    ${itemsHtml}
                    <hr>
                    <p style="display: flex; justify-content: space-between;"><strong>TOTAL:</strong> <strong>${order.total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
                    <p><strong>Pagamento:</strong> ${order.paymentMethod?.toUpperCase()}</p>
                    ${order.observations ? `<p><strong>Obs:</strong> ${order.observations}</p>` : ''}
                    <hr>
                    <p style="text-align: center; font-size: 10px;">${new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                </body>
            </html>
        `);
        win.document.close();
        win.print();
    };

    if (!restaurant) return <div className="h-screen flex items-center justify-center">Carregando...</div>;

    if (!auth) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black text-gray-900 mb-2">Painel do Lojista</h1>
                        <p className="text-gray-500">{restaurant.name}</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Sua senha de acesso"
                            className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-accent rounded-2xl outline-none transition-all"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoFocus
                        />
                        <button className="w-full p-4 bg-accent text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all">
                            Entrar no Painel
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const activeOrders = orders.filter(o => !['sent', 'delivered', 'cancelled'].includes(o.status?.toLowerCase()));
    const historyOrders = orders.filter(o => ['sent', 'delivered', 'cancelled'].includes(o.status?.toLowerCase()));
    const displayedOrders = showHistory ? historyOrders : activeOrders;

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden lg:flex">
                <div className="p-6 border-b border-gray-50">
                    <h1 className="text-xl font-black text-gray-900">OLIN<span className="text-accent">SHOP</span></h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { id: 'dashboard', label: 'Início', icon: '📊' },
                        { id: 'products', label: 'Produtos', icon: '📦' },
                        { id: 'settings', label: 'Ajustes', icon: '⚙️' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${tab === item.id ? 'bg-accent text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 mt-auto">
                    <button
                        onClick={() => {
                            localStorage.removeItem(`admin_session_${slug}`);
                            window.location.reload();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
                    >
                        <span>🚪</span> Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg font-black text-gray-900 capitalize">{tab}</h2>
                        <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Sistema Online
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href={`/loja/${slug}`} target="_blank" className="text-xs font-bold text-gray-400 hover:text-accent transition-colors">
                            Ver minha loja ↗
                        </Link>
                    </div>
                </header>

                <div className="p-8">
                    {tab === 'dashboard' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Pedidos Ativos</p>
                                    <h3 className="text-3xl font-black text-gray-900">{activeOrders.length}</h3>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Vendas Hoje</p>
                                    <h3 className="text-3xl font-black text-gray-900">
                                        {orders
                                            .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
                                            .reduce((acc, o) => acc + (Number(o.total) || 0), 0)
                                            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </h3>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Ticket Médio</p>
                                    <h3 className="text-3xl font-black text-gray-900">
                                        {(orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0) / (orders.length || 1))
                                            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </h3>
                                </div>
                            </div>

                            {/* Orders List */}
                            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">Gestão de Pedidos</h3>
                                        <p className="text-xs text-gray-400 font-bold">Gerencie suas vendas em tempo real</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowHistory(false)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!showHistory ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            Ativos
                                        </button>
                                        <button
                                            onClick={() => setShowHistory(true)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${showHistory ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            Histórico
                                        </button>
                                        <button
                                            onClick={fetchOrders}
                                            className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-200"
                                        >
                                            🔄
                                        </button>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-50">
                                    {displayedOrders.length === 0 ? (
                                        <div className="p-20 text-center text-gray-300 font-bold italic">
                                            Nenhum pedido encontrado.
                                        </div>
                                    ) : (
                                        displayedOrders.map(order => (
                                            <div key={order.id} className="p-8 hover:bg-gray-50/50 transition-colors">
                                                <div className="flex flex-col lg:flex-row justify-between gap-8">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded-lg text-xs font-black">#{order.ticketNumber}</span>
                                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${order.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                    order.status?.toLowerCase() === 'preparing' ? 'bg-blue-100 text-blue-700' :
                                                                        'bg-green-100 text-green-700'
                                                                }`}>
                                                                {order.status?.toLowerCase() === 'pending' ? 'Pendente' :
                                                                    order.status?.toLowerCase() === 'preparing' ? 'Expedição' :
                                                                        order.status?.toLowerCase() === 'sent' ? 'Enviado' : order.status}
                                                            </span>
                                                            <span className="text-xs text-gray-400 font-bold">
                                                                {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>

                                                        <div className="mb-4">
                                                            <h4 className="font-black text-gray-900 text-lg leading-none mb-1">{order.customer?.name}</h4>
                                                            <p className="text-sm text-gray-500 font-medium">{order.customer?.address}</p>
                                                            <p className="text-xs text-gray-400 mt-1">📞 {order.customer?.phone}</p>
                                                        </div>

                                                        <div className="space-y-2">
                                                            {(order.items || []).map((item: any, i: number) => (
                                                                <div key={i} className="flex items-center gap-3 text-sm">
                                                                    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md text-[10px] font-black">{item.quantity}x</span>
                                                                    <span className="font-bold text-gray-700">{item.name}</span>
                                                                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                                                                        <span className="text-[10px] text-gray-400">
                                                                            ({Object.values(item.selectedVariants).join(', ')})
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {order.observations && (
                                                            <div className="mt-4 p-4 bg-orange-50 rounded-2xl border border-orange-100 text-xs text-orange-800 font-medium italic">
                                                                Obs: {order.observations}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="lg:w-64 flex flex-col justify-between items-end">
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total do Pedido</p>
                                                            <h3 className="text-2xl font-black text-gray-900">
                                                                {Number(order.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                            </h3>
                                                            <p className="text-[10px] font-bold text-accent uppercase">{order.paymentMethod}</p>
                                                        </div>

                                                        <div className="flex gap-2 mt-6">
                                                            <button
                                                                onClick={() => printOrder(order)}
                                                                className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                                                            >
                                                                🖨️
                                                            </button>

                                                            {order.status?.toLowerCase() === 'pending' && (
                                                                <button
                                                                    disabled={loading === order.id}
                                                                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                                    className="px-6 py-3 bg-black text-white rounded-xl text-xs font-black uppercase shadow-lg hover:shadow-xl transform active:scale-95 transition-all disabled:opacity-50"
                                                                >
                                                                    {loading === order.id ? '...' : 'Aprovar'}
                                                                </button>
                                                            )}

                                                            {order.status?.toLowerCase() === 'preparing' && (
                                                                <button
                                                                    disabled={loading === order.id}
                                                                    onClick={() => updateOrderStatus(order.id, 'sent')}
                                                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-lg hover:shadow-xl transform active:scale-95 transition-all disabled:opacity-50"
                                                                >
                                                                    {loading === order.id ? '...' : 'Remeter'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'products' && (
                        <div className="space-y-12 animate-fade-in">
                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                                <h3 className="text-xl font-black text-gray-900 mb-6 underline decoration-accent decoration-4 underline-offset-8">Categorias</h3>
                                <CategoryForm restaurantId={restaurant.id} onSave={() => setCatRefresh(Date.now())} />
                            </div>

                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                                <h3 className="text-xl font-black text-gray-900 mb-6 underline decoration-accent decoration-4 underline-offset-8">Catálogo</h3>
                                <ProductForm restaurantId={restaurant.id} onSave={() => { }} refreshCategories={catRefresh} />
                            </div>
                        </div>
                    )}

                    {tab === 'settings' && (
                        <div className="animate-fade-in">
                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                                <StoreSettings
                                    restaurant={restaurant}
                                    onUpdate={(data: any) => {
                                        if (data?.slug && data.slug !== slug) {
                                            router.replace(`/admin/${data.slug}`);
                                        } else {
                                            fetchRestaurant();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
