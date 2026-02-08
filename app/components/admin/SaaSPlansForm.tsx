
"use client";
import { useState, useEffect } from "react";

export default function SaaSPlansForm() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/saas-plans')
            .then(res => res.json())
            .then(data => setPlans(data))
            .catch(err => console.error("Error loading plans", err));
    }, []);

    const handleChange = (id: number, field: string, value: any) => {
        setPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/saas-plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plans })
            });
            if (res.ok) {
                alert('Planos atualizados com sucesso!');
            } else {
                alert('Erro ao salvar planos');
            }
        } catch (e) {
            alert('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mt-8">
            <h3 className="text-xl font-black text-gray-900 mb-6">Configuração de Planos (SaaS)</h3>

            <div className="space-y-6">
                {plans.map(plan => (
                    <div key={plan.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl items-end">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome do Plano</label>
                            <input
                                type="text"
                                value={plan.name}
                                onChange={e => handleChange(plan.id, 'name', e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-accent font-bold text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Duração (Meses)</label>
                            <input
                                type="number"
                                readOnly
                                value={plan.duration_months}
                                className="w-full p-3 bg-gray-100 border border-gray-100 rounded-xl outline-none text-gray-400 font-bold text-sm cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Desconto (%)</label>
                            <input
                                type="number"
                                value={plan.discount_percent}
                                onChange={e => handleChange(plan.id, 'discount_percent', parseFloat(e.target.value))}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-accent font-bold text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2 pb-3">
                            <input
                                type="checkbox"
                                id={`active-${plan.id}`}
                                checked={plan.active}
                                onChange={e => handleChange(plan.id, 'active', e.target.checked)}
                                className="w-5 h-5 accent-accent"
                            />
                            <label htmlFor={`active-${plan.id}`} className="text-xs font-bold text-gray-600 cursor-pointer">Ativo</label>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSave}
                disabled={loading}
                className="mt-8 w-full md:w-auto px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all disabled:opacity-50"
            >
                {loading ? 'Salvando...' : 'Salvar Configuração de Planos'}
            </button>
        </div>
    );
}
