"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "../components/PageHeader";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/';

    const handleForgotPassword = async () => {
        if (!email) {
            alert("Por favor, preencha o campo de email para recuperar sua senha.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            setLoading(false);

            if (res.ok && data.success) {
                const message = `Olá, ${data.userName}! Sua nova senha de acesso ao OlinShop foi gerada com sucesso: \n\n🔑 Senha: *${data.newPassword}*\n\nUtilize esta senha para fazer seu próximo login.`;
                const whatsappUrl = `https://wa.me/${data.phone}?text=${encodeURIComponent(message)}`;

                if (confirm("Sua nova senha foi gerada com sucesso! Deseja recebê-la agora via WhatsApp?")) {
                    window.open(whatsappUrl, '_blank');
                } else {
                    alert(`Sua nova senha é: ${data.newPassword}\n\nPor favor, anote-a.`);
                }
            } else {
                alert(data.error || "Erro ao processar solicitação");
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            alert("Erro de conexão");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(email, password);
        setLoading(false);
        if (success) {
            router.push(returnUrl);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 animate-fade-in-up">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Bem-vindo(a)</h1>
                <p className="text-gray-500 mt-2">Faça login para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="password" className="block text-sm font-bold text-gray-700">Senha</label>
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-xs text-accent font-bold hover:underline"
                        >
                            Perdeu sua senha?
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all pr-12"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2"
                        >
                            {showPassword ? (
                                <span title="Ocultar">👁️‍🗨️</span>
                            ) : (
                                <span title="Ver">👁️</span>
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all text-lg disabled:opacity-50"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-500">
                    Não tem uma conta?{" "}
                    <Link href={`/signup?returnUrl=${encodeURIComponent(returnUrl)}`} className="text-accent font-bold hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </div>

            <div className="mt-4 text-center">
                <Link href="/" className="text-gray-400 text-sm hover:text-gray-600">
                    Voltar ao início
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#FAF8FC] flex flex-col">
            <PageHeader />
            <div className="flex-1 flex items-center justify-center py-8 px-4">
                <Suspense fallback={<div className="text-center">Carregando...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
