"use client";

import { useState, useEffect } from "react";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    restaurant: any;
    selectedServices: Array<{
        id: string;
        name: string;
        price: number;
        duration?: number;
    }>;
}

export default function BookingModal({ isOpen, onClose, restaurant, selectedServices }: BookingModalProps) {
    const [step, setStep] = useState(1); // 1: Form, 2: Payment, 3: Confirmation
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        notes: ''
    });
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [bookingResult, setBookingResult] = useState<any>(null);

    // Calculate total duration and price
    const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration || restaurant?.booking_duration || 30), 0);
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const depositPercent = restaurant?.booking_deposit_percent || 50;
    const depositAmount = (totalPrice * depositPercent) / 100;

    // Fetch available slots when date changes
    useEffect(() => {
        if (formData.date && restaurant?.id) {
            fetchAvailableSlots();
        }
    }, [formData.date]);

    const fetchAvailableSlots = async () => {
        try {
            const res = await fetch(`/api/bookings/available-slots?restaurantId=${restaurant.id}&date=${formData.date}&duration=${totalDuration}`);
            const data = await res.json();
            setAvailableSlots(data.available || []);
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId: restaurant.id,
                    customerName: formData.name,
                    customerPhone: formData.phone,
                    customerEmail: formData.email,
                    bookingDate: formData.date,
                    bookingTime: formData.time,
                    duration: totalDuration,
                    notes: formData.notes,
                    items: selectedServices.map(s => ({
                        productId: s.id,
                        productName: s.name,
                        productPrice: s.price,
                        quantity: 1
                    }))
                })
            });

            const data = await res.json();

            if (res.ok) {
                setBookingResult(data);
                setStep(2); // Go to payment step
            } else {
                alert(data.error || 'Erro ao criar agendamento');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Erro ao criar agendamento');
        } finally {
            setLoading(false);
        }
    };

    const copyPixCode = () => {
        if (bookingResult?.payment?.pixCode) {
            navigator.clipboard.writeText(bookingResult.payment.pixCode);
            alert('Código PIX copiado!');
        }
    };

    const confirmPayment = () => {
        setStep(3);
        // Send WhatsApp confirmation
        const message = `Olá! Confirmei o pagamento do agendamento:\n\n📅 Data: ${formData.date}\n🕐 Horário: ${formData.time}\n💰 Valor: R$ ${depositAmount.toFixed(2)}\n\nAguardo confirmação!`;
        const phone = restaurant.whatsapp?.replace(/\D/g, '') || '';
        window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (!isOpen) return null;

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-accent to-purple-600 text-white p-6 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black">📅 Agendar Horário</h2>
                            <p className="text-sm opacity-90 mt-1">{restaurant?.name}</p>
                        </div>
                        <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-all">
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Step 1: Form */}
                    {step === 1 && (
                        <div className="space-y-6">
                            {/* Selected Services */}
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <h3 className="font-bold text-gray-900 mb-3">Serviços Selecionados:</h3>
                                {selectedServices.map((service, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                                        <div>
                                            <p className="font-bold text-sm">{service.name}</p>
                                            <p className="text-xs text-gray-500">{service.duration || restaurant?.booking_duration || 30} min</p>
                                        </div>
                                        <p className="font-bold text-accent">R$ {service.price.toFixed(2)}</p>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-3 mt-3 border-t-2 border-gray-300">
                                    <p className="font-black text-gray-900">Total:</p>
                                    <p className="font-black text-xl text-accent">R$ {totalPrice.toFixed(2)}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    💳 Sinal de {depositPercent}%: <span className="font-bold">R$ {depositAmount.toFixed(2)}</span>
                                </p>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-accent outline-none"
                                        placeholder="Seu nome"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp *</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-accent outline-none"
                                        placeholder="(81) 99999-9999"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">E-mail (opcional)</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-accent outline-none"
                                        placeholder="seu@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Data *</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
                                        min={today}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-accent outline-none"
                                        required
                                    />
                                </div>

                                {formData.date && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Horário *</label>
                                        {availableSlots.length > 0 ? (
                                            <div className="grid grid-cols-4 gap-2">
                                                {availableSlots.map((slot) => (
                                                    <button
                                                        key={slot}
                                                        onClick={() => setFormData({ ...formData, time: slot })}
                                                        className={`p-3 rounded-xl font-bold text-sm transition-all ${formData.time === slot
                                                                ? 'bg-accent text-white'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">Nenhum horário disponível nesta data</p>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Observações</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-accent outline-none"
                                        rows={3}
                                        placeholder="Alguma observação?"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!formData.name || !formData.phone || !formData.date || !formData.time || loading}
                                className="w-full bg-gradient-to-r from-accent to-purple-600 text-white font-black py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processando...' : 'Continuar para Pagamento →'}
                            </button>
                        </div>
                    )}

                    {/* Step 2: Payment */}
                    {step === 2 && bookingResult && (
                        <div className="space-y-6 text-center">
                            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                                <div className="text-6xl mb-4">✅</div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Agendamento Criado!</h3>
                                <p className="text-gray-600">Agora finalize o pagamento do sinal</p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h4 className="font-bold text-gray-900 mb-4">💳 Pagamento via PIX</h4>
                                <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 mb-4">
                                    <p className="text-sm text-gray-500 mb-2">Código PIX:</p>
                                    <code className="text-xs bg-gray-100 p-2 rounded block break-all">{bookingResult.payment.pixCode}</code>
                                </div>
                                <button
                                    onClick={copyPixCode}
                                    className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-accent/90 transition-all mb-4"
                                >
                                    📋 Copiar Código PIX
                                </button>
                                <div className="text-left space-y-2 text-sm">
                                    <p><strong>Valor do Sinal:</strong> R$ {bookingResult.payment.amount.toFixed(2)}</p>
                                    <p><strong>Valor Total:</strong> R$ {bookingResult.payment.totalPrice.toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">O restante será pago no local</p>
                                </div>
                            </div>

                            <button
                                onClick={confirmPayment}
                                className="w-full bg-green-500 text-white font-black py-4 rounded-xl hover:bg-green-600 transition-all"
                            >
                                ✅ Já Paguei - Confirmar via WhatsApp
                            </button>
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                        <div className="space-y-6 text-center">
                            <div className="text-6xl mb-4">🎉</div>
                            <h3 className="text-2xl font-black text-gray-900">Tudo Certo!</h3>
                            <p className="text-gray-600">
                                Seu agendamento foi enviado para confirmação.<br />
                                Aguarde o retorno da loja via WhatsApp.
                            </p>
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-sm text-left">
                                <p className="font-bold mb-2">📋 Resumo do Agendamento:</p>
                                <p>📅 Data: {formData.date}</p>
                                <p>🕐 Horário: {formData.time}</p>
                                <p>💰 Sinal Pago: R$ {depositAmount.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full bg-accent text-white font-bold py-4 rounded-xl hover:bg-accent/90 transition-all"
                            >
                                Fechar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
