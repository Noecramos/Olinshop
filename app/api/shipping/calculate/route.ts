import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { originZip, destinationZip, products } = await req.json();

        if (!originZip || !destinationZip || !products || products.length === 0) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Clean CEPs
        const sCepOrigem = originZip.replace(/\D/g, "");
        const sCepDestino = destinationZip.replace(/\D/g, "");

        // Sum weights and find max dimensions (simplified box logic)
        let totalWeight = 0;
        let maxHeight = 0;
        let maxWidth = 0;
        let maxLength = 0;

        products.forEach((p: any) => {
            totalWeight += (parseFloat(p.weight) || 0.5) * (parseInt(p.quantity) || 1);
            maxHeight = Math.max(maxHeight, parseFloat(p.height) || 15);
            maxWidth = Math.max(maxWidth, parseFloat(p.width) || 15);
            maxLength = Math.max(maxLength, parseFloat(p.length) || 15);
        });

        // Cap values to Correios limits if needed, but for calculation we use real ones
        // Correios limits: Weight <= 30kg, sum dimensions <= 200cm
        const weight = Math.min(totalWeight, 30);
        const height = Math.min(maxHeight, 100);
        const width = Math.min(maxWidth, 100);
        const length = Math.min(maxLength, 100);

        // nCdServico: 04014 (SEDEX), 04510 (PAC)
        const url = `http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo?nCdServico=04014,04510&sCepOrigem=${sCepOrigem}&sCepDestino=${sCepDestino}&nVlPeso=${weight}&nCdFormato=1&nVlComprimento=${length}&nVlAltura=${height}&nVlLargura=${width}&nVlDiametro=0&sCdMaoPropria=n&nVlValorDeclarado=0&sCdAvisoRecebimento=n`;

        const response = await fetch(url);
        const xmlText = await response.text();

        // Simple XML parsing (since we can't use complex parser easily without new dependencies)
        const parseTag = (xml: string, tag: string) => {
            const regex = new RegExp(`<${tag}>([^<]*)<\/${tag}>`, 'g');
            const matches = [];
            let match;
            while ((match = regex.exec(xml)) !== null) {
                matches.push(match[1]);
            }
            return matches;
        };

        const codes = parseTag(xmlText, "Codigo");
        const values = parseTag(xmlText, "Valor");
        const terms = parseTag(xmlText, "PrazoEntrega");
        const errors = parseTag(xmlText, "Erro");

        const options = codes.map((code, i) => ({
            code,
            name: code === "04014" ? "SEDEX" : "PAC",
            price: parseFloat(values[i].replace(",", ".")),
            deadline: terms[i],
            error: errors[i] !== "0" ? errors[i] : null
        })).filter(opt => opt.price > 0);

        return NextResponse.json({
            success: true,
            options,
            details: { weight, length, width, height }
        });

    } catch (error) {
        console.error("Shipping Calculation Error:", error);
        return NextResponse.json({ error: "Failed to calculate shipping" }, { status: 500 });
    }
}
