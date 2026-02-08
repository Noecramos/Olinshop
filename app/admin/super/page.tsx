"use client";

import { useEffect, useState } from "react";
import StoreSettings from "../../components/admin/StoreSettings";
import GlobalConfigForm from "../../components/admin/GlobalConfigForm";
import SaaSPlansForm from "../../components/admin/SaaSPlansForm";
import RaspadinhaValidator from "../../components/admin/RaspadinhaValidator";

export default function SuperAdmin() {
    const [auth, setAuth] = useState(false);
    const [password, setPassword] = useState("");
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [groupedRestaurants, setGroupedRestaurants] = useState<{ [key: string]: any[] }>({});
    const [users, setUsers] = useState<any[]>([]);
    const [editingRestaurant, setEditingRestaurant] = useState<any>(null);
    const [tab, setTab] = useState<'restaurants' | 'users' | 'config' | 'raspadinha'>('restaurants');
    const [config, setConfig] = useState({ footerText: '' });
    const [stats, setStats] = useState({ mrr: 0, totalStores: 0, activeStores: 0, growth: [] as any[] });

    // Check localStorage for existing session
    useEffect(() => {
        const savedAuth = localStorage.getItem('super_admin_auth');
        if (savedAuth === 'true') {
            setAuth(true);
        }
    }, []);

    useEffect(() => {
        if (auth) {
            fetchRestaurants();
            fetchUsers();
        }
    }, [auth]);

    // Fetch global config
    useEffect(() => {
        fetch('/api/config')
            .then(res => res.ok ? res.json() : {})
            .then((data: any) => setConfig(prev => ({ ...prev, footerText: data.footerText || '' })))
            .catch(() => { });
    }, []);

    const fetchRestaurants = async () => {
        try {
            const res = await fetch(`/api/restaurants?all=true&t=${Date.now()}`, { cache: 'no-store' });
            const data = await res.json();
            setRestaurants(data);
        } catch (e) {
            console.error(e);
        }
    };

    // Auto-group restaurants when state updates (Fixes UI sync)
    useEffect(() => {
        const grouped: { [key: string]: any[] } = {};
        restaurants.forEach((restaurant: any) => {
            const ownerEmail = restaurant.email || 'sem-email';
            if (!grouped[ownerEmail]) {
                grouped[ownerEmail] = [];
            }
            grouped[ownerEmail].push(restaurant);
        });
        setGroupedRestaurants(grouped);

        // Calculate stats
        const active = restaurants.filter(r => r.subscription_status === 'active');
        const mrr = active.reduce((sum, r) => {
            const price = parseFloat(r.saasMonthlyPrice || r.saas_monthly_price) || 0;
            return sum + price;
        }, 0);

        // Calculate growth (last 30 days)
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        }).reverse();

        const growthData = last30Days.map(dayStr => {
            const count = restaurants.filter(r => {
                if (!r.createdAt) return false;
                const d = new Date(r.createdAt);
                return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) === dayStr;
            }).length;
            return { label: dayStr, count };
        });

        setStats({
            mrr,
            totalStores: restaurants.length,
            activeStores: active.length,
            growth: growthData
        });
    }, [restaurants]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/admin/users?t=${Date.now()}`, { cache: 'no-store' });
            const data = await res.json();
            setUsers(data);
        } catch (e) {
            console.error(e);
        }
    };

    const toggleApproval = async (restaurant: any) => {
        const newStatus = !restaurant.approved;
        try {
            const res = await fetch('/api/restaurants', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: restaurant.id, approved: newStatus })
            });

            const data = await res.json();
            console.log('API Response:', data);
            const finalPassword = data.password || restaurant.password;

            if (newStatus) {
                console.log('Approving restaurant:', restaurant.id);
                // Update local state to show password immediately
                setRestaurants(prev => {
                    const updated = prev.map(r => r.id === restaurant.id ? { ...r, approved: true, password: finalPassword } : r);
                    console.log('Updated State length:', updated.length);
                    return updated;
                });

                // Send WhatsApp
                const phone = restaurant.whatsapp || restaurant.phone;
                if (phone) {
                    let cleanPhone = phone.replace(/\D/g, '');
                    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);

                    // Brazilian "extra nine" correction if 12 digits and looks like AA 9 9...
                    if (cleanPhone.length === 12 && !cleanPhone.startsWith('55') && cleanPhone.substring(2, 4) === '99') {
                        cleanPhone = cleanPhone.substring(0, 2) + cleanPhone.substring(3);
                    }

                    // Add 55 only if it's a domestic number (10-11 digits)
                    if (!cleanPhone.startsWith('55') && cleanPhone.length >= 10 && cleanPhone.length <= 11) {
                        cleanPhone = '55' + cleanPhone;
                    }
                    const message = `Olá, ${restaurant.responsibleName || 'Parceiro'}! \n\nSua loja *${restaurant.name}* foi aprovada no LojaKy! 🚀\n\nAcesse seu painel administrativo:\nLink: https://lojaky.noviapp.com.br/admin/${restaurant.slug}\n\n*Suas Credenciais:*\nLogin: ${restaurant.slug}\nSenha: ${finalPassword}\n\nBoas vendas!`;
                    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
                } else {
                    alert('Loja aprovada! Senha gerada: ' + finalPassword);
                }
            } else {
                setRestaurants(prev => prev.map(r => r.id === restaurant.id ? { ...r, approved: false } : r));
            }
        } catch (e) {
            alert('Erro ao atualizar');
        }
    };

    const toggleMultistore = async (restaurant: any) => {
        const newStatus = !restaurant.multistoreEnabled;
        const confirmMsg = newStatus
            ? `Ativar MULTILOJA para "${restaurant.name}"?\n\nIsso permitirá que o proprietário registre lojas adicionais.`
            : `Desativar MULTILOJA para "${restaurant.name}"?`;

        if (!confirm(confirmMsg)) return;

        try {
            const res = await fetch('/api/stores', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: restaurant.id,
                    multistoreEnabled: newStatus
                })
            });

            if (res.ok) {
                setRestaurants(prev => prev.map(r =>
                    r.id === restaurant.id
                        ? { ...r, multistoreEnabled: newStatus }
                        : r
                ));
                alert(newStatus ? '✅ Multiloja ATIVADA!' : '⏸️ Multiloja desativada');
            } else {
                alert('Erro ao atualizar');
            }
        } catch (e) {
            alert('Erro de conexão');
        }
    };


    const resetPassword = async (restaurant: any) => {
        if (!confirm(`Deseja realmente resetar a senha da loja ${restaurant.name}?`)) return;
        try {
            const res = await fetch('/api/restaurants', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: restaurant.id, resetPassword: true })
            });

            const data = await res.json();
            if (res.ok) {
                setRestaurants(prev => prev.map(r => r.id === restaurant.id ? { ...r, password: data.password } : r));

                const phone = restaurant.whatsapp || restaurant.phone;
                if (phone) {
                    let cleanPhone = phone.replace(/\D/g, '');
                    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);

                    if (cleanPhone.length === 12 && !cleanPhone.startsWith('55') && cleanPhone.substring(2, 4) === '99') {
                        cleanPhone = cleanPhone.substring(0, 2) + cleanPhone.substring(3);
                    }

                    if (!cleanPhone.startsWith('55') && cleanPhone.length >= 10 && cleanPhone.length <= 11) {
                        cleanPhone = '55' + cleanPhone;
                    }
                    const message = `Olá, ${restaurant.responsibleName || 'Parceiro'}! \n\nSua senha de acesso ao painel do LojaKy foi resetada. \n\n🔑 Nova Senha: *${data.password}*\n\nLink: https://lojaky.noviapp.com.br/admin/${restaurant.slug}`;

                    if (confirm(`A nova senha é ${data.password}. Deseja enviá-la agora via WhatsApp para o parceiro?`)) {
                        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
                    }
                } else {
                    alert(`Nova senha da loja ${restaurant.name}: ${data.password}`);
                }
            }
        } catch (e) {
            alert('Erro ao resetar senha');
        }
    };

    const deleteRestaurant = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta loja? Essa ação não pode ser desfeita.')) return;

        try {
            const res = await fetch(`/api/restaurants?id=${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Erro ao excluir loja');
            }

            const data = await res.json();
            if (data.success) {
                alert('Loja excluída com sucesso!');
                fetchRestaurants();
            }
        } catch (e: any) {
            console.error('Delete error:', e);
            alert(e.message || 'Erro ao excluir loja');
        }
    };

    const resetUserPassword = async (user: any) => {
        if (!confirm(`Deseja realmente resetar a senha de ${user.name}?`)) return;
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: user.id, resetPassword: true })
            });

            const data = await res.json();
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === user.id ? { ...u, password: data.password } : u));

                const phone = user.whatsapp || user.phone;
                if (phone) {
                    let cleanPhone = phone.replace(/\D/g, '');
                    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);

                    if (cleanPhone.length === 12 && !cleanPhone.startsWith('55') && cleanPhone.substring(2, 4) === '99') {
                        cleanPhone = cleanPhone.substring(0, 2) + cleanPhone.substring(3);
                    }

                    if (!cleanPhone.startsWith('55') && cleanPhone.length >= 10 && cleanPhone.length <= 11) {
                        cleanPhone = '55' + cleanPhone;
                    }
                    const message = `Olá, ${user.name}! \n\nSua senha de acesso ao LojaKy foi resetada. \n\n🔑 Nova Senha: *${data.password}*\n\nLink: https://lojaky.noviapp.com.br`;

                    if (confirm(`A nova senha é ${data.password}. Deseja enviá-la agora via WhatsApp para o usuário?`)) {
                        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
                    }
                } else {
                    alert(`Nova senha de ${user.name}: ${data.password}`);
                }
            }
        } catch (e) {
            alert('Erro ao resetar senha do usuário');
        }
    };

    const deleteUser = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este usuário? Essa ação não pode ser desfeita.')) return;

        try {
            const res = await fetch('/api/admin/users?id=' + id, { method: 'DELETE' });
            if (res.ok) {
                alert("Usuário excluído com sucesso!");
                fetchUsers();
            }
        } catch (e) {
            alert("Erro ao excluir usuário");
        }
    };

    const handleLogin = async () => {
        try {
            const res = await fetch('/api/admin/verify-super', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            if (res.ok) {
                setAuth(true);
                // Save to localStorage
                localStorage.setItem('super_admin_auth', 'true');
            } else {
                alert('Senha inválida');
            }
        } catch (e) {
            alert('Erro ao verificar senha');
        }
    };

    const handleLogout = () => {
        setAuth(false);
        localStorage.removeItem('super_admin_auth');
        setPassword("");
    };

    const handleResetPassword = async () => {
        if (!confirm('Deseja resetar a senha mestra? Uma nova senha será enviada para o e-mail cadastrado.')) return;

        try {
            const res = await fetch('/api/admin/super-reset', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                if (data.tempPassword) {
                    alert(`${data.message}\n\nCOMO O E-MAIL NÃO FOI CONFIGURADO, SUA NOVA SENHA É: ${data.tempPassword}\n\nPor favor, anote-a agora.`);
                } else {
                    alert(data.message);
                }
            } else {
                alert(data.error || 'Erro ao resetar senha');
            }
        } catch (e) {
            alert('Erro de conexão');
        }
    };

    if (!auth) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F5F5F7] to-[#E8E8EA] flex flex-col items-center justify-center py-8 px-4">
                <div className="w-full max-w-lg">
                    {/* Header Banner - Same width as card */}
                    <div className="h-32 md:h-40 w-full bg-cover bg-center relative rounded-t-3xl overflow-hidden shadow-lg" style={{ backgroundImage: "url('/header-lojaky.png')" }}>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
                    </div>

                    {/* Content Card */}
                    <div className="bg-white rounded-b-3xl shadow-2xl p-8 md:p-10 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Super Admin</h1>
                            <p className="text-gray-500 font-medium">Gestão Global da Plataforma</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="master-password" className="block text-sm font-bold text-gray-700 mb-2">Senha Mestra</label>
                                <input
                                    id="master-password"
                                    name="password"
                                    type="password"
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleLogin()}
                                />
                                <div className="mt-2 text-right">
                                    <button
                                        onClick={handleResetPassword}
                                        className="text-xs text-gray-400 hover:text-accent transition-colors font-medium"
                                    >
                                        Esqueci minha senha
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handleLogin}
                                className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
                            >
                                Acessar Gerenciamento →
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="w-full text-center text-gray-500 text-xs py-6 mt-4">
                        {config.footerText || '© Noviapp Mobile Apps • LojAky®'}
                    </footer>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5F5F7] to-[#E8E8EA] flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-7xl">
                {/* Header Banner - Same width as card */}
                <div className="h-32 md:h-40 w-full bg-cover bg-center relative rounded-t-3xl overflow-hidden shadow-xl" style={{ backgroundImage: "url('/header-lojaky.png')" }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-6 md:left-8 text-white z-10">
                        <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Gestão Global</h1>
                        <p className="text-xs md:text-sm font-medium opacity-90">Controle total de Lojas LojaKy</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="absolute bottom-4 right-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg font-bold hover:bg-white hover:text-accent transition-all text-sm border border-white/30"
                    >
                        Sair
                    </button>
                </div>

                {editingRestaurant && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                            <button
                                onClick={() => setEditingRestaurant(null)}
                                className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors z-10 font-bold"
                            >
                                ✕
                            </button>
                            <div className="p-8">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar: {editingRestaurant.name}</h2>
                                <StoreSettings
                                    restaurant={editingRestaurant}
                                    onUpdate={async (updatedData) => {
                                        console.log('🔄 Update callback received:', updatedData);

                                        // Update local state immediately with the new data
                                        if (updatedData) {
                                            console.log('✅ Updating local state with new slug:', updatedData.slug);
                                            setRestaurants(prev => {
                                                const updated = prev.map(r =>
                                                    r.id === updatedData.id ? updatedData : r
                                                );
                                                console.log('📋 Updated restaurants list:', updated);
                                                return updated;
                                            });

                                            // Show success message with new slug
                                            if (updatedData.slug !== editingRestaurant.slug) {
                                                alert(`✅ Slug atualizado com sucesso!\n\nNovo slug: ${updatedData.slug}\n\nO link da loja agora é:\nlojaky.noviapp.com.br/loja/${updatedData.slug}`);
                                            }
                                        }

                                        // Fetch fresh data from server to ensure consistency
                                        console.log('🔄 Fetching fresh data from server...');
                                        await fetchRestaurants();
                                        console.log('✅ Data refreshed');

                                        setEditingRestaurant(null);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}



                {/* 📊 GRÁFICOS E METRICAS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-8 animate-fade-in-up">
                    {/* MRR Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Receita Mensal (MRR)</h3>
                            <div className="text-3xl font-black text-gray-900">R$ {stats.mrr.toFixed(2)}</div>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
                            💹 +{stats.activeStores} Assinantes
                        </div>
                    </div>

                    {/* Total Stores */}
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total de Lojas</h3>
                            <div className="text-3xl font-black text-gray-900">{stats.totalStores}</div>
                        </div>
                        <div className="mt-4 text-xs text-gray-400 font-medium">
                            {stats.activeStores} lojas ativas (pagantes)
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 md:col-span-2 flex flex-col">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Crescimento (Últimos 30 dias)</h3>
                        <div className="flex-1 flex items-end justify-between gap-1 h-24">
                            {stats.growth.map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center justify-end h-full w-full group">
                                    <div
                                        className="w-full bg-blue-100 rounded-t-[2px] transition-all group-hover:bg-blue-500 relative"
                                        style={{ height: `${Math.max(5, (item.count / (stats.totalStores > 0 ? stats.totalStores : 1)) * 100 * 2)}%` }} // Scaling factor for better visibility
                                    >
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            {item.count}
                                        </div>
                                    </div>
                                    {/* Show label only for every 5th item to avoid clutter */}
                                    <span className="text-[8px] font-bold text-gray-400 mt-2 whitespace-nowrap hidden sm:block" style={{ opacity: idx % 5 === 0 ? 1 : 0 }}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Card Content */}
                <div className="bg-white rounded-[32px] shadow-2xl p-6 md:p-8 animate-fade-in-up min-h-[500px]">

                    <div className="flex gap-6 mb-8 border-b border-gray-100 pb-px">
                        <button
                            onClick={() => setTab('restaurants')}
                            className={`pb-4 px-2 font-bold transition-all relative ${tab === 'restaurants' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Lojas
                        </button>
                        <button
                            onClick={() => setTab('users')}
                            className={`pb-4 px-2 font-bold transition-all relative ${tab === 'users' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Usuários
                        </button>
                        <button
                            onClick={() => setTab('config')}
                            className={`pb-4 px-2 font-bold transition-all relative ${tab === 'config' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Customização do App
                        </button>
                        <button
                            onClick={() => setTab('raspadinha')}
                            className={`pb-4 px-2 font-bold transition-all relative ${tab === 'raspadinha' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-400 hover:text-amber-600'}`}
                        >
                            🎲 Raspadinha
                        </button>
                    </div>

                    {tab === 'restaurants' ? (
                        <div className="space-y-6 animate-fade-in">
                            {Object.entries(groupedRestaurants).map(([ownerEmail, stores]) => (
                                <div key={ownerEmail} className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden">
                                    {/* Owner Header */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                    👤 {stores[0]?.responsibleName || 'Proprietário'}
                                                    {stores.length > 1 && (
                                                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                                            {stores.length} lojas
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">📧 {ownerEmail}</p>
                                            </div>
                                            {stores.some((s: any) => s.multistoreEnabled) && (
                                                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                                                    🏪 Multiloja Ativa
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stores Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 border-b border-gray-100">
                                                <tr>

                                                    <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Loja</th>
                                                    <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Slug</th>
                                                    <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Senha</th>
                                                    <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Cadastro</th>
                                                    <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-center">Status</th>
                                                    <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-center">Assinatura</th>
                                                    <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Ações</th>
                                                </tr >
                                            </thead >
                                            <tbody className="divide-y divide-gray-100">
                                                {stores.map((r: any) => (
                                                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors group">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                {r.image ? (
                                                                    <img
                                                                        src={r.image}
                                                                        alt={r.name}
                                                                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                                                                    />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs border-2 border-white shadow-md">
                                                                        {r.name?.charAt(0)?.toUpperCase()}
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <div className="font-bold text-gray-900 group-hover:text-accent transition-colors text-sm">{r.name}</div>
                                                                    <div className="text-xs text-gray-400">{r.type}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <code className="bg-blue-50 px-2 py-1 rounded-lg text-xs font-bold text-blue-700">{r.slug}</code>
                                                        </td>
                                                        <td className="p-4">
                                                            <code className="bg-gray-100 px-2 py-1 rounded-lg text-xs font-bold text-gray-600">{r.password}</code>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-xs font-bold text-gray-500">
                                                                {(() => {
                                                                    const d = r.createdAt || r.created_at;
                                                                    return d && !isNaN(new Date(d).getTime()) ? new Date(d).toLocaleDateString() : '-';
                                                                })()}
                                                            </div>
                                                            <div className="text-[10px] text-gray-400">
                                                                {(() => {
                                                                    const d = r.createdAt || r.created_at;
                                                                    return d && !isNaN(new Date(d).getTime()) ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                                                                })()}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${r.approved ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                                                                {r.approved ? 'ATIVO' : 'PENDENTE'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${r.subscription_status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                                                    r.subscription_status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                                                                    }`}>
                                                                    {r.subscription_status === 'active' ? 'Assinante' :
                                                                        r.subscription_status === 'overdue' ? 'Vencido' : 'Gratuito'}
                                                                </span>
                                                                {r.subscription_expires_at && (
                                                                    <span className="text-[9px] text-gray-400">
                                                                        Exp: {new Date(r.subscription_expires_at).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end gap-2 translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                                                                <button
                                                                    onClick={() => toggleMultistore(r)}
                                                                    className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${r.multistoreEnabled ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-purple-100'}`}
                                                                    title={r.multistoreEnabled ? 'Multiloja ATIVA' : 'Ativar Multiloja'}
                                                                >
                                                                    🏪 {r.multistoreEnabled ? 'Multi' : '+'}
                                                                </button>
                                                                <button onClick={() => setEditingRestaurant(r)} className="p-1.5 text-gray-400 hover:text-accent hover:bg-blue-50 rounded-lg transition-all text-sm">✏️</button>
                                                                <button onClick={() => toggleApproval(r)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${r.approved ? 'bg-amber-500' : 'bg-accent'} text-white`}>{r.approved ? 'Pausar' : 'Aprovar'}</button>
                                                                <button onClick={() => resetPassword(r)} className="p-1.5 text-gray-400 hover:text-accent hover:bg-blue-50 rounded-lg transition-all text-sm">🔑</button>
                                                                <button onClick={() => deleteRestaurant(r.id)} className="p-1.5 text-gray-400 hover:text-accent hover:bg-red-50 rounded-lg transition-all text-sm">🗑️</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table >
                                    </div >
                                </div >
                            ))
                            }
                        </div >
                    ) : tab === 'users' ? (
                        <div className="overflow-x-auto overflow-hidden rounded-2xl border border-gray-100 shadow-lg animate-fade-in">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-6 font-bold text-gray-500 text-xs uppercase tracking-wider">Cliente</th>
                                        <th className="p-6 font-bold text-gray-500 text-xs uppercase tracking-wider">Contato</th>
                                        <th className="p-6 font-bold text-gray-500 text-xs uppercase tracking-wider">Endereço</th>
                                        <th className="p-6 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((u: any) => (
                                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="p-6">
                                                <div className="font-bold text-gray-900">{u.name}</div>
                                                <div className="text-xs text-gray-500">{u.email}</div>
                                                <div className="text-[10px] text-accent font-bold uppercase mt-1">CPF: {u.cpf || '---'}</div>
                                            </td>
                                            <td className="p-6 font-medium text-gray-600 text-sm">
                                                <div>📞 {u.phone}</div>
                                                <div className="text-xs text-green-600">📱 {u.whatsapp || '---'}</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="text-xs text-gray-600 max-w-xs truncate">{u.address}</div>
                                                <div className="text-xs text-gray-400 font-bold">{u.zipCode}</div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => resetUserPassword(u)} className="p-2.5 text-gray-400 hover:text-accent hover:bg-blue-50 rounded-xl transition-all" title="Resetar Senha">🔑</button>
                                                    <button onClick={() => deleteUser(u.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Excluir Usuário">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr><td colSpan={4} className="p-20 text-center text-gray-400">Nenhum usuário cadastrado.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : tab === 'config' ? (
                        <div className="space-y-8 animate-fade-in">
                            <GlobalConfigForm />
                            <SaaSPlansForm />
                        </div>
                    ) : (
                        <div className="flex justify-center py-10 animate-fade-in">
                            <RaspadinhaValidator />
                        </div>
                    )}
                </div >

                {/* Footer outside the card */}
                < footer className="footer text-center text-gray-600 text-xs py-10 mt-2" >
                    {config.footerText || '© Noviapp Mobile Apps • LojAky®'} v1.3
                </footer >
            </div >
        </div >
    );
}
