"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SelectLocation() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [mainStore, setMainStore] = useState<any>(null);
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLocations();
    }, [slug]);

    const fetchLocations = async () => {
        try {
            // Fetch the main store
            const res = await fetch(`/api/stores?slug=${slug}`);
            if (!res.ok) {
                router.push('/');
                return;
            }

            const store = await res.json();
            setMainStore(store);

            // If multistore is enabled and has an email, fetch sibling stores
            if (store.multistoreEnabled && store.email) {
                const siblingRes = await fetch(`/api/stores/siblings?email=${encodeURIComponent(store.email)}`);
                if (siblingRes.ok) {
                    const siblings = await siblingRes.json();
                    // Include the main store in the list
                    const allStores = [store, ...siblings.filter((s: any) => s.id !== store.id)];
                    setLocations(allStores.filter((s: any) => s.approved));
                } else {
                    // Fallback: just show the main store
                    setLocations([store]);
                }
            } else {
                // Not multistore, redirect directly to the store
                router.push(`/loja/${slug}`);
                return;
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
            router.push('/');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-gray-500 font-bold">Carregando lojas...</div>
            </div>
        );
    }

    if (!mainStore || locations.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-gray-500 font-bold mb-4">Nenhuma loja encontrada</p>
                    <Link href="/" className="text-accent underline">Voltar ao início</Link>
                </div>
            </div>
        );
    }

    // If only one location, redirect directly
    if (locations.length === 1) {
        router.push(`/loja/${locations[0].slug}`);
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
                        {mainStore.image ? (
                            <img src={mainStore.image} alt={mainStore.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl">🏪</span>
                        )}
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">{mainStore.name}</h1>
                    <p className="text-gray-600 font-bold">
                        {locations.length} {locations.length === 1 ? 'loja disponível' : 'lojas disponíveis'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Escolha a loja mais próxima de você</p>
                </div>

                {/* Location Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {locations.map((location) => (
                        <Link
                            key={location.id}
                            href={`/loja/${location.slug}?from=selector`}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-accent group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-110 transition-transform">
                                    {location.image ? (
                                        <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl">📍</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-accent transition-colors mb-2">
                                        {location.name}
                                    </h3>
                                    {location.address && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            📍 {location.address}
                                        </p>
                                    )}
                                    {location.whatsapp && (
                                        <p className="text-sm text-gray-500 mb-2">
                                            📱 {location.whatsapp}
                                        </p>
                                    )}
                                    {location.hours && (
                                        <p className="text-xs text-gray-400">
                                            🕐 {location.hours}
                                        </p>
                                    )}
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${location.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {location.isOpen ? '🟢 Aberto' : '🔴 Fechado'}
                                        </span>
                                        <span className="text-accent font-bold group-hover:translate-x-2 transition-transform">
                                            Visitar →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Back Button */}
                <div className="text-center mt-8">
                    <Link href="/" className="text-gray-400 hover:text-gray-600 font-bold text-sm">
                        ← Voltar para lojas
                    </Link>
                </div>
            </div>
        </div>
    );
}
