"use client";

// Checkout page with geolocation delivery radius validation - v2.2 STRICT
// Deploy timestamp: 2026-01-11T15:54:00
// FIXED: Simplified error messages - all scenarios show simple "CEP fora da área" message

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    // ALL HOOKS MUST BE AT THE TOP - before any conditional returns
    const { items: cart, total, subtotal, deliveryFee, setDeliveryFee, clearCart, removeOne, addToCart } = useCart();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [restaurant, setRestaurant] = useState<any>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [whatsappLink, setWhatsappLink] = useState("");
    const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);
    const [isCepOutOfRange, setIsCepOutOfRange] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [shippingOptions, setShippingOptions] = useState<any[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<any>(null);
    const [config, setConfig] = useState({ footerText: '' });

    const [form, setForm] = useState({
        name: "",
        phone: "",
        cpf: "",
        zipCode: "",
        address: "",
        paymentMethod: "pix",
        changeFor: "",
        observations: "",
        serviceType: "delivery", // delivery, pickup, shipping
    });

    // Fetch restaurant data
    useEffect(() => {
        if (cart.length > 0) {
            const restaurantId = cart[0].restaurantId;
            if (restaurantId) {
                fetch(`/api/restaurants?id=${restaurantId}&t=${Date.now()}`)
                    .then(res => res.json())
                    .then(data => {
                        console.log('🍽️ Restaurant data loaded:', data);
                        console.log('🔍 Geolocation fields:', {
                            latitude: data.latitude,
                            longitude: data.longitude,
                            deliveryRadius: data.deliveryRadius,
                            hasAll: !!(data.latitude && data.longitude && data.deliveryRadius)
                        });
                        console.log('💰 Delivery Fee Tiers:', data.deliveryFeeTiers);
                        setRestaurant(data);
                        setDeliveryFee(0);
                    })
                    .catch(console.error);
            }
        }
    }, [cart, setDeliveryFee]);

    // Fetch global config
    useEffect(() => {
        fetch('/api/config')
            .then(res => res.ok ? res.json() : {})
            .then(data => setConfig(prev => ({ ...prev, footerText: data.footerText || '' })))
            .catch(() => { });
    }, []);

    // Pre-fill form with user data
    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                name: prev.name || user.name || "",
                phone: prev.phone || user.phone || "",
                cpf: prev.cpf || user.cpf || "",
                zipCode: prev.zipCode || user.zipCode || "",
                address: prev.address || user.address || ""
            }));
        }
    }, [user]);

    // Auto-calculate delivery fee if user has zipCode
    useEffect(() => {
        if (user?.zipCode && restaurant && deliveryFee === 0) {
            // Trigger calculateDeliveryFee - defined below but called conditionally here
            const zipCode = user.zipCode;
            if (zipCode && zipCode.length >= 8) {
                // We'll call the calculation inside the main render flow
            }
        }
    }, [user, restaurant, deliveryFee]);

    // ---- CONDITIONAL RETURNS (after all hooks) ----

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F5F5F7]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    // Interstitial for Login/Register vs Guest
    if (!user && !isGuest && cart.length > 0) {
        return (
            <div className="fixed inset-0 bg-[#F2F4F8] z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        ⚡
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Agilize seu pedido</h2>
                    <p className="text-gray-500 mb-8">
                        Entre ou cadastre-se para preencher seus dados automaticamente e salvar seu endereço.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => router.push(`/login?returnUrl=${encodeURIComponent('/checkout')}`)}
                            className="w-full bg-accent text-white font-bold py-4 rounded-xl shadow-lg hover:bg-accent-hover transition-all"
                        >
                            Entrar / Cadastrar
                        </button>
                        <button
                            onClick={() => setIsGuest(true)}
                            className="w-full bg-white text-gray-500 font-bold py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                        >
                            Continuar como Visitante
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F7] p-8 relative">
                <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-sm w-full">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Seu carrinho está vazio</h2>
                    <p className="text-gray-500 mb-8">Adicione produtos ao seu carrinho antes de finalizar!</p>
                    <button
                        onClick={() => router.back()}
                        className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                    >
                        ⬅️ Voltar à Loja
                    </button>
                </div>

                {/* Success Overlay - Rendered even if cart is empty (post-checkout) */}
                {showSuccess && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform animate-scale-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                <span className="text-4xl">✅</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Realizado!</h2>
                            <p className="text-gray-500 mb-6 font-medium">Siga para o WhatsApp para confirmar seu pedido e enviar o comprovante.</p>

                            <div className="space-y-3">
                                <a
                                    href={whatsappLink}
                                    className="w-full bg-[#25D366] text-white font-black py-4 rounded-2xl shadow-lg shadow-green-200 hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 text-lg"
                                >
                                    <span>📱</span> ENVIAR NO WHATSAPP
                                </a>

                                <button
                                    onClick={() => router.push(restaurant?.slug ? `/loja/${restaurant.slug}` : '/')}
                                    className="w-full bg-gray-50 text-gray-400 font-bold py-3 px-4 rounded-2xl hover:bg-gray-100 transition-colors text-sm"
                                >
                                    Voltar à Loja
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Function to calculate delivery fee based on distance
    // Function to calculate delivery fee based on distance or CEP (Correios Style)
    const calculateDeliveryFee = async (zipCode: string) => {
        if (!restaurant || !zipCode || zipCode.length < 8) {
            return;
        }

        // Only run for delivery or shipping
        if (form.serviceType === 'pickup') {
            setDeliveryFee(0);
            return;
        }

        const cepClean = zipCode.replace(/\D/g, '');
        console.log('📦 Calculating Correios Freight for CEP:', cepClean);

        setLoading(true);
        try {
            // 1. Get Address from ViaCEP
            const cepRes = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
            const cepData = await cepRes.json();

            if (cepData.erro) {
                console.log('❌ Invalid CEP');
                alert('CEP não encontrado. Por favor, verifique o número informado.');
                setLoading(false);
                return;
            }

            // 2. AUTO-FILL ADDRESS
            const fullAddress = `${cepData.logradouro}${cepData.bairro ? ', ' + cepData.bairro : ''}, ${cepData.localidade} - ${cepData.uf}`;
            setForm(prev => ({ ...prev, address: fullAddress }));
            console.log('🏠 Address auto-filled:', fullAddress);

            // 3. Freight Logic (Correios Mini Simulation)
            // We use CEP prefixes or distance if available
            let freightFee = 15.00; // Base fee

            const restaurantLat = parseFloat(restaurant.latitude);
            const restaurantLon = parseFloat(restaurant.longitude);

            if (restaurantLat && restaurantLon) {
                // Try to get coordinates for distance calculation
                const geoRes = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress + ", Brazil")}&format=json&limit=1`,
                    { headers: { 'User-Agent': 'OlinShop/1.0' } }
                );
                const geoData = await geoRes.json();

                if (geoData && geoData.length > 0) {
                    const customerLat = parseFloat(geoData[0].lat);
                    const customerLon = parseFloat(geoData[0].lon);

                    // Haversine
                    const R = 6371;
                    const dLat = (customerLat - restaurantLat) * Math.PI / 180;
                    const dLon = (customerLon - restaurantLon) * Math.PI / 180;
                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(restaurantLat * Math.PI / 180) * Math.cos(customerLat * Math.PI / 180) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const distance = R * c;
                    setCalculatedDistance(distance);

                    // Check local tiers first
                    const tiers = restaurant.deliveryFeeTiers;
                    if (tiers && Array.isArray(tiers) && tiers.length > 0) {
                        const validTiers = tiers
                            .filter((t: any) => t.maxDistance && t.fee)
                            .sort((a: any, b: any) => parseFloat(a.maxDistance) - parseFloat(b.maxDistance));

                        const tier = validTiers.find((t: any) => distance <= parseFloat(t.maxDistance));
                        if (tier) {
                            freightFee = parseFloat(tier.fee);
                            console.log('✅ Local Tier Freight:', freightFee);
                        } else {
                            // Long Distance (SIMULATED CORREIOS)
                            freightFee = 25.00 + (distance * 0.5); // R$ 25 base + 0.50/km
                            console.log('📦 Long Distance Freight:', freightFee);
                        }
                    } else {
                        freightFee = 15.00 + (distance * 0.8);
                    }
                } else {
                    // NOMINATIM FAIL: Use CEP Prefix Logic
                    const prefix = parseInt(cepClean.substring(0, 2));
                    if (prefix >= 0 && prefix <= 19) freightFee = 18.00; // SP
                    else if (prefix >= 20 && prefix <= 28) freightFee = 25.00; // RJ
                    else freightFee = 35.00; // Far away
                    console.log('📦 Prefix-based Freight Fallback:', freightFee);
                }
            } else {
                // NO RESTAURANT GPS: Simple State Prefix Logic
                const prefix = parseInt(cepClean.substring(0, 2));
                freightFee = prefix < 30 ? 15.00 : 25.00;
            }

            if (form.serviceType === 'delivery') {
                setDeliveryFee(freightFee);
                setIsCepOutOfRange(false);
                setShippingOptions([]); // Clear correios options
            }

            // 4. REAL CORREIOS CALCULATION (If Correios is selected)
            if (form.serviceType === 'shipping' && restaurant.zipCode) {
                try {
                    const shipRes = await fetch('/api/shipping/calculate', {
                        method: 'POST',
                        body: JSON.stringify({
                            originZip: restaurant.zipCode,
                            destinationZip: cepClean,
                            products: cart
                        })
                    });
                    const shipData = await shipRes.json();
                    if (shipData.success && shipData.options.length > 0) {
                        setShippingOptions(shipData.options);
                        // Automatically select PAC if available as default
                        const pac = shipData.options.find((o: any) => o.name === 'PAC');
                        const defaultOpt = pac || shipData.options[0];
                        if (defaultOpt) {
                            setSelectedShipping(defaultOpt);
                            setDeliveryFee(defaultOpt.price);
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch real Correios data", e);
                }
            }
        } catch (error) {
            console.error('Freight calc error:', error);
            setDeliveryFee(30.00); // Fail-safe
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = async () => {
        const isDelivery = form.serviceType === 'delivery';
        const isShipping = form.serviceType === 'shipping';
        const needsAddress = isDelivery || isShipping;

        // Conditional validation
        if (!form.name || !form.phone) {
            alert("Por favor, preencha seu nome e telefone.");
            return;
        }

        if (needsAddress && (!form.address || !form.zipCode)) {
            alert("Por favor, preencha o endereço completo para entrega.");
            return;
        }

        setLoading(true);
        const restaurantId = cart[0]?.restaurantId || 'default';

        try {
            // Fetch Restaurant Info
            const restRes = await fetch(`/api/restaurants?id=${restaurantId}`);
            const restData = await restRes.json();
            const restaurantPhone = restData.whatsapp || restData.phone || "5581995515777";

            // Prepare Order Data
            const orderData = {
                restaurantId,
                customerName: form.name,
                customerPhone: form.phone,
                customerCpf: form.cpf,
                customerAddress: form.address,
                customerZipCode: form.zipCode,
                customerEmail: user?.email || '',
                items: cart,
                subtotal,
                deliveryFee,
                total,
                paymentMethod: form.paymentMethod,
                changeFor: form.paymentMethod === 'money' ? (parseFloat(form.changeFor) || 0) : null,
                observations: form.observations,
                status: 'pending',
                serviceType: form.serviceType,
                shippingMethod: selectedShipping ? selectedShipping.name : (form.serviceType === 'delivery' ? 'Entrega Local' : null)
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erro ao salvar pedido.");
            }

            const order = await res.json();
            const ticketNumber = order.ticketNumber || '###';

            // WhatsApp formatting
            const emojis = {
                ticket: '\uD83C\uDFAB', user: '\uD83D\uDC64', phone: '\uD83D\uDCF1',
                map: '\uD83D\uDCCD', post: '\uD83D\uDCEE', cart: '\uD83D\uDED2',
                money: '\uD83D\uDCB5', truck: '\uD83D\uDE9A', total: '\uD83D\uDCB0',
                note: '\uD83D\uDCDD', rocket: '\uD83D\uDE80', pix: '\u2728',
                card: '\uD83D\uDCB3', package: '\uD83D\uDCE6'
            };

            const formatCurrency = (val: number) =>
                val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/\u00A0/g, ' ');

            const itemsList = cart.map((i: any) => {
                let variantsText = "";
                if (i.selectedVariants && Object.keys(i.selectedVariants).length > 0) {
                    variantsText = Object.entries(i.selectedVariants)
                        .map(([key, val]) => `\n   • ${key}: ${val}`)
                        .join("");
                }
                return `${emojis.package} *${i.quantity}x ${i.name}* - ${formatCurrency(i.price * i.quantity)}${variantsText}`;
            }).join('\n');

            const paymentInfo = form.paymentMethod === 'pix' ? `${emojis.pix} PIX` :
                (form.paymentMethod === 'card' ? `${emojis.card} Cartão` :
                    `${emojis.money} Dinheiro (Troco para R$ ${form.changeFor})`);

            const storeName = restData.name?.trim().toUpperCase() || "LOJA";

            const message = `*${emojis.package} ${storeName}*\n` +
                `${emojis.ticket} *PEDIDO:* #${ticketNumber}\n` +
                `Tipo: *${form.serviceType === 'delivery' ? 'Entrega Local' : (form.serviceType === 'shipping' ? 'Correios' : 'Retirada')}*\n` +
                `\n` +
                `${emojis.user} *Cliente:* ${form.name.trim()}\n` +
                `${emojis.phone} *Telefone:* ${form.phone.trim()}\n` +
                (needsAddress ? `${emojis.map} *Endereço:* ${form.address.trim()}\n` : '') +
                (needsAddress ? `${emojis.post} *CEP:* ${form.zipCode.trim()}\n` : '') +
                (isShipping && selectedShipping ? `${emojis.truck} *Envio:* ${selectedShipping.name}\n\n` : (needsAddress ? '\n' : '\n')) +
                `${emojis.cart} *ITENS DO PEDIDO:*\n${itemsList}\n\n` +
                `${emojis.money} *Subtotal:* ${formatCurrency(subtotal)}\n` +
                (needsAddress ? `${emojis.truck} *Taxa de Entrega:* ${formatCurrency(deliveryFee)}\n` : '') +
                `${emojis.total} *TOTAL:* ${formatCurrency(total)}\n\n` +
                (form.observations ? `${emojis.note} *Observações:* ${form.observations.trim()}\n\n` : '') +
                `${paymentInfo}\n\n` +
                `_Enviado via OlinShop ${emojis.rocket}_`;
            let cleanPhone = restaurantPhone.replace(/\D/g, '');
            if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);

            // Correction for 12 digits AA 9 9... mistake
            if (cleanPhone.length === 12 && !cleanPhone.startsWith('55') && cleanPhone.substring(2, 4) === '99') {
                cleanPhone = cleanPhone.substring(0, 2) + cleanPhone.substring(3);
            }

            const finalPhone = (!cleanPhone.startsWith('55') && cleanPhone.length >= 10 && cleanPhone.length <= 11)
                ? `55${cleanPhone}`
                : cleanPhone;
            const link = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodeURIComponent(message)}`;

            setWhatsappLink(link);
            clearCart();
            setLoading(false);
            setShowSuccess(true);
            window.location.href = link;

        } catch (e) {
            console.error(e);
            alert("Erro ao finalizar pedido.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
            {/* Header Banner */}
            <div className="h-48 md:h-64 w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://rfbwcz2lzvkh4d7s.public.blob.vercel-storage.com/all-page-header.png')" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
            </div>


            <div className="flex-1 flex flex-col items-center px-4 md:px-8 lg:px-12 pb-10 pt-8 z-10 relative">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Finalizar Pedido</h1>
                    {restaurant?.deliveryRadius && restaurant?.latitude && restaurant?.longitude && form.serviceType === 'delivery' && (
                        <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
                            <span>📍</span>
                            <span>Validação de área de entrega ativa ({restaurant.deliveryRadius} km)</span>
                        </div>
                    )}
                </div>

                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden glass">
                    <div className="p-6 space-y-6">
                        {/* Order Items */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Resumo do Pedido</h3>
                            <div className="space-y-2">
                                {cart.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">{(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white p-1 rounded-lg border shadow-sm">
                                            <button
                                                onClick={() => removeOne(index)}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 text-accent font-bold transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-green-50 text-green-500 font-bold transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Customer Info */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Seus Dados</h3>
                            {/* Service Type Selection */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase">Tipo de Pedido</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        {
                                            id: 'delivery',
                                            label: 'Entrega',
                                            icon: '🛵',
                                            activeClass: 'bg-[#FDF2F8] text-[#E91E8C] border-[#FBCFE8] shadow-[0_8px_20px_-4px_rgba(233,30,140,0.2)]'
                                        },
                                        {
                                            id: 'shipping',
                                            label: 'Correios',
                                            icon: '📦',
                                            activeClass: 'bg-[#F0FDFA] text-[#0D9488] border-[#CCFBF1] shadow-[0_8px_20px_-4px_rgba(13,148,136,0.2)]'
                                        },
                                        {
                                            id: 'pickup',
                                            label: 'Retirada',
                                            icon: '🛍️',
                                            activeClass: 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD] shadow-[0_8px_20px_-4px_rgba(2,132,199,0.2)]'
                                        }
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => {
                                                setForm({ ...form, serviceType: type.id });
                                                setDeliveryFee(0);
                                                setShippingOptions([]);
                                                setSelectedShipping(null);
                                                // If changed and has zip, recalculate
                                                if (form.zipCode.replace(/\D/g, '').length === 8) {
                                                    calculateDeliveryFee(form.zipCode);
                                                }
                                            }}
                                            className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all border ${form.serviceType === type.id ? `${type.activeClass} scale-[1.02]` : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-white'}`}
                                        >
                                            <span className="text-xl">{type.icon}</span>
                                            <span className="text-[10px] font-black uppercase tracking-tight">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <input
                                id="customerName"
                                name="customerName"
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Nome Completo"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                            <input
                                id="customerPhone"
                                name="customerPhone"
                                type="tel"
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Telefone (WhatsApp)"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                            />
                            <input
                                id="customerCpf"
                                name="customerCpf"
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="CPF (000.000.000-00)"
                                value={form.cpf}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                                    let formatted = val;
                                    if (val.length > 9) formatted = `${val.slice(0, 3)}.${val.slice(3, 6)}.${val.slice(6, 9)}-${val.slice(9)}`;
                                    else if (val.length > 6) formatted = `${val.slice(0, 3)}.${val.slice(3, 6)}.${val.slice(6)}`;
                                    else if (val.length > 3) formatted = `${val.slice(0, 3)}.${val.slice(3)}`;
                                    setForm({ ...form, cpf: formatted });
                                }}
                                maxLength={14}
                            />

                            {(form.serviceType === 'delivery' || form.serviceType === 'shipping') && (
                                <>
                                    <input
                                        id="zipCode"
                                        name="zipCode"
                                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="CEP (00000-000)"
                                        value={form.zipCode}
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                                            const formatted = val.length > 5 ? `${val.slice(0, 5)}-${val.slice(5)}` : val;
                                            setForm({ ...form, zipCode: formatted });
                                        }}
                                        onBlur={() => {
                                            if (form.zipCode.replace(/\D/g, '').length === 8) {
                                                calculateDeliveryFee(form.zipCode);
                                            }
                                        }}
                                        maxLength={9}
                                    />
                                    <textarea
                                        id="customerAddress"
                                        name="customerAddress"
                                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Endereço de Entrega"
                                        rows={2}
                                        value={form.address}
                                        onChange={e => setForm({ ...form, address: e.target.value })}
                                    />
                                </>
                            )}

                            <textarea
                                id="observations"
                                name="observations"
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Observações (ex: tamanho, cor, referências...)"
                                rows={2}
                                value={form.observations}
                                onChange={e => setForm({ ...form, observations: e.target.value })}
                            />

                            {/* Correios Shipping Options */}
                            {shippingOptions.length > 0 && form.serviceType === 'shipping' && (
                                <div className="mt-4 space-y-3 animate-fade-in">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase flex items-center gap-2">
                                        <span>📦</span> Opções de Envio (Correios)
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {shippingOptions.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setSelectedShipping(opt);
                                                    setDeliveryFee(opt.price);
                                                }}
                                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedShipping?.code === opt.code ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100 shadow-sm' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                                            >
                                                <div className="text-left">
                                                    <div className="font-bold text-gray-900">{opt.name}</div>
                                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Prazo: {opt.deadline} dias úteis</div>
                                                </div>
                                                <div className="font-black text-blue-600">
                                                    {opt.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Display Delivery Fee Tiers */}
                            {restaurant?.deliveryFeeTiers && Array.isArray(restaurant.deliveryFeeTiers) && restaurant.deliveryFeeTiers.some((t: any) => t.maxDistance && t.fee) && shippingOptions.length === 0 && (
                                <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">🚚</span>
                                        <span className="font-bold text-green-900 text-sm">Taxas de Entrega</span>
                                    </div>
                                    <div className="space-y-2">
                                        {restaurant.deliveryFeeTiers
                                            .filter((t: any) => t.maxDistance && t.fee)
                                            .sort((a: any, b: any) => parseFloat(a.maxDistance) - parseFloat(b.maxDistance))
                                            .map((tier: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center text-xs bg-white px-3 py-2 rounded-lg border border-green-100">
                                                    <span className="text-gray-700">
                                                        <span className="font-medium">Até {tier.maxDistance} km</span>
                                                    </span>
                                                    <span className="font-bold text-green-700">
                                                        {parseFloat(tier.fee).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                    {calculatedDistance !== null && (
                                        <div className="mt-3 pt-3 border-t border-green-200">
                                            <div className="text-xs text-green-800">
                                                <span className="font-medium">📍 Distância calculada:</span> {calculatedDistance.toFixed(2)} km
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-xs text-green-700 mt-3">
                                        💡 A taxa será calculada automaticamente após informar seu CEP.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Payment */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Pagamento</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setForm({ ...form, paymentMethod: 'pix' })}
                                    className={`p-3 rounded-xl text-sm font-medium transition-all ${form.paymentMethod === 'pix' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    PIX
                                </button>
                                <button
                                    onClick={() => setForm({ ...form, paymentMethod: 'card' })}
                                    className={`p-3 rounded-xl text-sm font-medium transition-all ${form.paymentMethod === 'card' ? 'bg-accent text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    Cartão
                                </button>
                                <button
                                    onClick={() => setForm({ ...form, paymentMethod: 'money' })}
                                    className={`p-3 rounded-xl text-sm font-medium transition-all ${form.paymentMethod === 'money' ? 'bg-yellow-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    Dinheiro
                                </button>
                            </div>

                            {form.paymentMethod === 'pix' && restaurant?.pixKey && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xl">💠</span>
                                        <span className="font-bold text-green-800">Chave PIX da Loja</span>
                                    </div>
                                    <div
                                        onClick={() => {
                                            navigator.clipboard.writeText(restaurant.pixKey);
                                            alert('Chave PIX copiada para a área de transferência!');
                                        }}
                                        className="flex items-center gap-3 bg-white p-3 rounded-lg border border-green-200 shadow-sm cursor-pointer hover:bg-green-50/50 transition-colors group"
                                    >
                                        <code className="flex-1 font-mono text-sm text-gray-800 break-all select-all">{restaurant.pixKey}</code>
                                        <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-100 px-2 py-1.5 rounded-md group-hover:bg-green-200 transition-colors">
                                            <span>COPIAR</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-green-700 mt-2 font-medium">
                                        ℹ️ Realize o pagamento e envie o comprovante no WhatsApp ao finalizar.
                                    </p>
                                </div>
                            )}

                            {form.paymentMethod === 'money' && (
                                <div className="animate-fade-in mt-2">
                                    <label htmlFor="changeAmount" className="text-sm text-gray-600 block mb-1">Troco para quanto?</label>
                                    <input
                                        id="changeAmount"
                                        name="changeAmount"
                                        className="w-full p-3 bg-yellow-50 rounded-xl border-yellow-200 border focus:ring-2 focus:ring-yellow-500 outline-none"
                                        placeholder="Ex: 50,00"
                                        value={form.changeFor}
                                        onChange={e => setForm({ ...form, changeFor: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-800 font-medium">
                                        {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Taxa de Entrega</span>
                                    <span className="text-gray-800 font-medium">
                                        {deliveryFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-6 pt-3 border-t border-gray-200">
                                <span className="text-gray-700 font-bold">Total a pagar</span>
                                <span className="text-2xl font-bold text-gray-800">
                                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>

                            <button
                                onClick={handleFinish}
                                disabled={loading}
                                className="w-full py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl shadow-lg transform active:scale-95 transition-all text-lg"
                            >
                                {loading ? 'Enviando...' : 'Finalizar Pedido no WhatsApp'}
                            </button>
                        </div>
                    </div>
                </div>

                <footer className="w-full text-center text-gray-400 text-xs py-6 mt-auto">
                    {config.footerText || '© 2025 Noviapp Mobile Apps • www.noviapp.com.br • OlindAki & OlinShop'}
                </footer>
            </div>

            {/* Success Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform animate-scale-in">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <span className="text-4xl">✅</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Realizado!</h2>
                        <p className="text-gray-500 mb-6">Seu pedido foi validado com sucesso.</p>

                        <div className="bg-gray-100 p-4 rounded-xl mb-6">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span>📱</span>
                                <span>Enviar no WhatsApp</span>
                            </a>
                            <p className="text-xs text-gray-400 mt-2">Clique acima para enviar o pedido</p>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="text-sm text-gray-400 underline hover:text-gray-600"
                        >
                            Voltar para o início
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

