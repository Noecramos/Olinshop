"use client";

import { useState, useEffect } from "react";

export default function RaspadinhaAdmin() {
    const [code, setCode] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        // Function to generate the daily code
        // This MUST match the client-side logic in the raspadinha validation
        const generateCode = () => {
            const now = new Date();
            // Create a seed based on the current hour (e.g. 2023-10-27-14)
            // This rotates the code every hour for security
            // Or use getDay() for daily rotation. Let's do Hourly for better security/testing.
            const seed = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;

            // Simple hash function to generate 4 digits
            let hash = 0;
            for (let i = 0; i < seed.length; i++) {
                const char = seed.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }

            // Absolute value and mod 10000 to get 4 digits
            const fourDigitCode = Math.abs(hash % 10000).toString().padStart(4, '0');
            setCode(fourDigitCode);

            // Calculate time until next rotation (next hour)
            const nextHour = new Date(now);
            nextHour.setHours(now.getHours() + 1, 0, 0, 0);
            setTimeLeft(Math.floor((nextHour.getTime() - now.getTime()) / 1000));
        };

        generateCode();
        const interval = setInterval(generateCode, 1000); // Update every second to check rotation/timer
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-r from-purple-700 to-indigo-600 p-6 text-center text-white">
                    <h1 className="text-2xl font-bold uppercase tracking-wider">Validador OlindAki</h1>
                    <p className="text-sm opacity-80 mt-1">Raspadinha da Sorte</p>
                </div>

                <div className="p-8 flex flex-col items-center text-center">
                    <p className="text-gray-500 font-medium mb-4">CÓDIGO ATUAL</p>

                    <div className="bg-gray-50 border-4 border-dashed border-gray-200 rounded-xl p-8 mb-6 w-full">
                        <span className="text-6xl font-mono font-bold text-gray-800 tracking-[0.2em]">
                            {code}
                        </span>
                    </div>

                    <div className="text-sm text-gray-400 font-medium mb-8">
                        Expira em: <span className="text-orange-500">{formatTime(timeLeft)}</span>
                    </div>

                    <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-left text-sm w-full">
                        <p className="font-bold mb-1">Como usar:</p>
                        <ol className="list-decimal pl-4 space-y-1">
                            <li>Quando o cliente ganhar, ele mostrará a tela de validação.</li>
                            <li>Digite este código de 4 dígitos no celular do cliente.</li>
                            <li>O prêmio será liberado instantaneamente.</li>
                        </ol>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-gray-400 text-xs">Sistema de validação segura OlindAki • 2025</p>
        </div>
    );
}
