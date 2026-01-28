export type CategoryStyle = {
    icon: string;
    bg: string;
    border: string;
    text: string;
};

const defaultStyle: CategoryStyle = { icon: '📦', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' };

const categoryStyles: Record<string, CategoryStyle> = {
    // --- FASHION & CLOTHING ---
    'bermuda': { icon: '🩳', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    'short': { icon: '🩳', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    'calça': { icon: '👖', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'jeans': { icon: '👖', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'vestido': { icon: '👗', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'saia': { icon: '👗', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'biquini': { icon: '👙', bg: '#ECFEFF', border: '#CFFAFE', text: '#0E7490' },
    'maiô': { icon: '👙', bg: '#ECFEFF', border: '#CFFAFE', text: '#0E7490' },
    'praia': { icon: '👙', bg: '#ECFEFF', border: '#CFFAFE', text: '#0E7490' },
    'banho': { icon: '👙', bg: '#ECFEFF', border: '#CFFAFE', text: '#0E7490' },
    'casaco': { icon: '🧥', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    'jaqueta': { icon: '🧥', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    'moletom': { icon: '🧥', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    'frio': { icon: '🧥', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    'social': { icon: '👔', bg: '#F8FAFC', border: '#E2E8F0', text: '#475569' },
    'gola': { icon: '👔', bg: '#F8FAFC', border: '#E2E8F0', text: '#475569' },
    'camisa': { icon: '👔', bg: '#F8FAFC', border: '#E2E8F0', text: '#475569' },
    'polo': { icon: '👕', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'camiseta': { icon: '👕', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    'blusa': { icon: '👕', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    't-shirt': { icon: '👕', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    'roupa': { icon: '👕', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    'moda': { icon: '👕', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    'vestuário': { icon: '👕', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    'infantil': { icon: '👶', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'bebê': { icon: '👶', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'intima': { icon: '🩲', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'langerie': { icon: '👙', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },

    // --- FOOTWEAR ---
    'tênis': { icon: '👟', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'tenis': { icon: '👟', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'sapato': { icon: '👞', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'sandália': { icon: '👡', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },
    'sandalia': { icon: '👡', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },
    'chinelo': { icon: '🩴', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'salto': { icon: '👠', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'scarpin': { icon: '👠', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'bota': { icon: '👢', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'coturno': { icon: '👢', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'calçado': { icon: '👟', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },

    // --- ACCESSORIES ---
    'boné': { icon: '🧢', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'bone': { icon: '🧢', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'chapéu': { icon: '👒', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'óculos': { icon: '🕶️', bg: '#F9FAFB', border: '#E5E7EB', text: '#111827' },
    'oculos': { icon: '🕶️', bg: '#F9FAFB', border: '#E5E7EB', text: '#111827' },
    'bolsa': { icon: '👜', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'mochila': { icon: '🎒', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'mala': { icon: '🧳', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'carteira': { icon: '👛', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'relógio': { icon: '⌚', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'relogio': { icon: '⌚', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'joia': { icon: '💎', bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' },
    'anel': { icon: '💍', bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' },
    'colar': { icon: '📿', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'acessório': { icon: '🧢', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },

    // --- TECH & ELECTRONICS ---
    'celular': { icon: '📱', bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' },
    'iphone': { icon: '📱', bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' },
    'smartphone': { icon: '📱', bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' },
    'fone': { icon: '🎧', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    'audio': { icon: '🎧', bg: '#F5F3FF', border: '#DDD6FE', text: '#6D28D9' },
    'computador': { icon: '💻', bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
    'notebook': { icon: '💻', bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
    'laptop': { icon: '💻', bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
    'mouse': { icon: '🖱️', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'teclado': { icon: '⌨️', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'game': { icon: '🎮', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'jogo': { icon: '🎮', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'câmera': { icon: '📷', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'eletrônico': { icon: '🔌', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'carregador': { icon: '🔌', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'capa': { icon: '📱', bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' },
    'película': { icon: '📱', bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' },

    // --- FOOD & DRINK ---
    'pizza': { icon: '🍕', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'hambúrguer': { icon: '🍔', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'burger': { icon: '🍔', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'lanche': { icon: '🍔', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'batata': { icon: '🍟', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },
    'frita': { icon: '🍟', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },
    'hot dog': { icon: '🌭', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'quente': { icon: '🌭', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'pipoca': { icon: '🍿', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },
    'sushi': { icon: '🍣', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'oriental': { icon: '🥢', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'pastel': { icon: '🥟', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'salgado': { icon: '🥟', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'coxinha': { icon: '🍗', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'churrasco': { icon: '🥩', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'carne': { icon: '🥩', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'taco': { icon: '🌮', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },
    'burrito': { icon: '🌯', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },
    'salada': { icon: '🥗', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'saudável': { icon: '🥗', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'vegetariano': { icon: '🥦', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'vegano': { icon: '🥦', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'fruta': { icon: '🍎', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'açaí': { icon: '🍧', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'acai': { icon: '🍧', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'sorvete': { icon: '🍦', bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' },
    'doce': { icon: '🍬', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'bolo': { icon: '🍰', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'torta': { icon: '🥧', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'chocolate': { icon: '🍫', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'sobremesa': { icon: '🍮', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },
    'café': { icon: '☕', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },
    'bebida': { icon: '🥤', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'refrigerante': { icon: '🥤', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'suco': { icon: '🧃', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'cerveja': { icon: '🍺', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },
    'vinho': { icon: '🍷', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'drink': { icon: '🍸', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'álcool': { icon: '🍾', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },
    'combo': { icon: '🍽️', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'prato': { icon: '🍛', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'almoço': { icon: '🥘', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'jantar': { icon: '🍲', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'padaria': { icon: '🥖', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'pão': { icon: '🍞', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'mercado': { icon: '🛒', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'grão': { icon: '🌾', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },

    // --- HOME & DECOR ---
    'casa': { icon: '🏠', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'decoração': { icon: '🖼️', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'móvel': { icon: '🪑', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'cama': { icon: '🛏️', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'banheiro': { icon: '🛁', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'cozinha': { icon: '🍳', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'utensílio': { icon: '🍴', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'lâmpada': { icon: '💡', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },
    'ferramenta': { icon: '🔧', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'jardim': { icon: '🌻', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'planta': { icon: '🪴', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'limpeza': { icon: '🧹', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },

    // --- BEAUTY & HEALTH ---
    'beleza': { icon: '💄', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'boca': { icon: '👄', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'rosto': { icon: '👩', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'cabelo': { icon: '💇', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'maquiagem': { icon: '💄', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'perfume': { icon: '🧴', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'creme': { icon: '🧴', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'esmalte': { icon: '💅', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'barba': { icon: '🧔', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'saúde': { icon: '🏥', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'remédio': { icon: '💊', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'medicamento': { icon: '💊', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'farmácia': { icon: '🏥', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'vitamina': { icon: '💊', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },

    // --- SPORTS & LEISURE ---
    'esporte': { icon: '⚽', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'futebol': { icon: '⚽', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'academia': { icon: '🏋️', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'fitness': { icon: '💪', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'suplemento': { icon: '🥤', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'bicicleta': { icon: '🚲', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'skate': { icon: '🛹', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'surf': { icon: '🏄', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'natação': { icon: '🏊', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    'camping': { icon: '⛺', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },

    // --- PETS ---
    'pet': { icon: '🐾', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'cachorro': { icon: '🐕', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'gato': { icon: '🐈', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'ração': { icon: '🦴', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },

    // --- SERVICES & LOGISTICS ---
    'entrega': { icon: '🛵', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'frete': { icon: '🚚', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'delivery': { icon: '🛵', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'motoboy': { icon: '🛵', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    'serviço': { icon: '🛠️', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'conserto': { icon: '🔧', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'manutenção': { icon: '🔧', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'faxina': { icon: '🧹', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },

    // --- MISC ---
    'papelaria': { icon: '✏️', bg: '#FFFBEB', border: '#FEF3C7', text: '#B45309' },
    'livro': { icon: '📚', bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C' },
    'revista': { icon: '📰', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'presente': { icon: '🎁', bg: '#FDF2F8', border: '#FCE7F3', text: '#BE185D' },
    'brinquedo': { icon: '🧸', bg: '#FEF2F2', border: '#FEE2E2', text: '#B91C1C' },
    'automotivo': { icon: '🚗', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'carro': { icon: '🚗', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
    'peça': { icon: '⚙️', bg: '#F3F4F6', border: '#E5E7EB', text: '#374151' },
};

export function getCategoryStyleFromName(name: string): CategoryStyle {
    const lowerName = name.toLowerCase();

    // 1. Direct match
    if (categoryStyles[lowerName]) {
        return categoryStyles[lowerName];
    }

    // 2. Partial match (search for keys inside the name)
    // We sort keys by length descending to match specific terms (e.g. "t-shirt") before generic ones (e.g. "shirt") if existed.
    // However, the object iteration order isn't guaranteed, but it usually helps to find the most specific one.
    // For a large dict, this O(N) scan per item is acceptable for front-end usage (< 100 cats).
    const keys = Object.keys(categoryStyles);
    for (const key of keys) {
        if (lowerName.includes(key)) {
            return categoryStyles[key];
        }
    }

    // 3. Fallback
    return defaultStyle;
}
