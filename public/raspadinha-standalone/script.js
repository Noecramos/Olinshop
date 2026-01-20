document.addEventListener('DOMContentLoaded', () => {
    // --- Constants ---
    const PRIZES = [
        { value: 50, symbol: '☂️', label: '50% OFF' }, // Frevo Umbrella (Rare)
        { value: 20, symbol: '🎭', label: '20% OFF' }, // Mask
        { value: 10, symbol: '🥁', label: '10% OFF' }, // Drum
        { value: 5, symbol: '🥥', label: '5% OFF' },   // Coconut
    ];

    const FILLERS = ['☀️', '🌴', '💃', '🎺', '🦀', '🌊'];

    // --- State ---
    const state = {
        ticketId: '',
        items: [],     // Array of { id, symbol, isWinner }
        isRevealed: false,
        result: null,  // { type: 'win' | 'lose', prize? }
        scratchProgress: 0,
        // No longer storing a random validation code. We adhere to the global hourly code.
    };

    // --- Elements ---
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    const gridContainer = document.getElementById('grid-container');
    const ticketLabel = document.getElementById('ticket-label');
    const timestamp = document.getElementById('timestamp');
    const fingerHint = document.getElementById('finger-hint');
    const btnOverlay = document.getElementById('btn-overlay');
    const revealBtn = document.getElementById('reveal-btn');

    const resultModal = document.getElementById('result-modal');

    // Steps
    const claimStep = document.getElementById('claim-step');
    const validateStep = document.getElementById('validate-step');
    const successStep = document.getElementById('success-step');
    const loseContent = document.getElementById('lose-content');

    // Inputs & Labels
    const prizeLabelClaim = document.getElementById('prize-label-claim');
    const prizeLabelFinal = document.getElementById('prize-label-final');
    const couponCode = document.getElementById('coupon-code');
    const userNameInput = document.getElementById('user-name-input');
    const validationPasswordInput = document.getElementById('validation-password-input');
    const validationError = document.getElementById('validation-error');

    // Buttons
    const claimBtn = document.getElementById('claim-btn');
    const validateBtn = document.getElementById('validate-btn');
    const newTicketBtnWin = document.getElementById('new-ticket-btn-win');
    const newTicketBtnLose = document.getElementById('new-ticket-btn-lose');

    // --- Time-Based Code Generator (Shared with Admin) ---
    function getHourlyCode() {
        const now = new Date();
        const seed = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;

        // Simple hash function to generate 4 digits
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        // Absolute value and mod 10000 to get 4 digits
        return Math.abs(hash % 10000).toString().padStart(4, '0');
    }

    // --- Initialization ---
    function init() {
        generateTicket();
        setupEventListeners();
        setupCanvas();
    }

    function generateTicket() {
        // Generate distinct ID
        const randomId = Math.floor(100000 + Math.random() * 900000);
        state.ticketId = `${randomId}`;

        // Update basic text
        ticketLabel.innerText = `OlindAki • #${state.ticketId}`;
        const now = new Date();
        timestamp.innerText = `${now.toLocaleDateString('pt-BR')} • ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

        // Reset Logic
        state.scratchProgress = 0;
        state.isRevealed = false;
        state.result = null;

        // Reset UI
        resultModal.style.display = 'none';
        btnOverlay.style.display = 'none';
        canvas.style.display = 'block';
        canvas.style.opacity = '1';
        fingerHint.style.display = 'block';

        // Reset Steps
        claimStep.style.display = 'none';
        validateStep.style.display = 'none';
        successStep.style.display = 'none';
        loseContent.style.display = 'none';

        // Reset Inputs
        userNameInput.value = '';
        validationPasswordInput.value = '';
        validationError.style.display = 'none';

        // Determine Outcome (3% chance)
        const isWinner = Math.random() < 0.03;
        let selectedPrize = null;
        let gridItems = [];

        if (isWinner) {
            // Determine Prize Level
            // 50% prize is approx 1% of the 3% wins (0.01 prob within winner pool)
            const isGrandPrize = Math.random() < 0.01;

            if (isGrandPrize) {
                selectedPrize = PRIZES[0]; // 50%
            } else {
                // Weighted random for others
                const r = Math.random();
                if (r < 0.2) selectedPrize = PRIZES[1]; // 20%
                else if (r < 0.5) selectedPrize = PRIZES[2]; // 10%
                else selectedPrize = PRIZES[3]; // 5%
            }

            state.result = { type: 'win', prize: selectedPrize };

            // Match 3
            gridItems = [selectedPrize.symbol, selectedPrize.symbol, selectedPrize.symbol];
            // Fill rest
            for (let i = 0; i < 6; i++) {
                gridItems.push(FILLERS[Math.floor(Math.random() * FILLERS.length)]);
            }
        } else {
            state.result = { type: 'lose' };
            const pool = [...FILLERS, ...PRIZES.map(p => p.symbol)];
            for (let i = 0; i < 9; i++) {
                gridItems.push(pool[Math.floor(Math.random() * pool.length)]);
            }
        }

        // Shuffle
        gridItems.sort(() => Math.random() - 0.5);

        state.items = gridItems.map((symbol, index) => ({
            id: index,
            symbol: symbol,
            isWinner: isWinner && selectedPrize ? symbol === selectedPrize.symbol : false
        }));

        renderGrid(); // Draw HTML grid
        initCanvasCover(); // Draw scratch layer
    }

    function renderGrid() {
        gridContainer.innerHTML = '';
        state.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'grid-item';
            div.innerText = item.symbol;
            div.dataset.isWinner = item.isWinner;
            gridContainer.appendChild(div);
        });
    }

    // --- Canvas Logic ---
    function setupCanvas() {
        const resize = () => {
            // Check if parent exists
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
                initCanvasCover();
            }
        };

        window.addEventListener('resize', resize);
    }

    function initCanvasCover() {
        if (!canvas.parentElement) return;

        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#9E9E9E');
        gradient.addColorStop(0.5, '#F5F5F5');
        gradient.addColorStop(1, '#9E9E9E');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#C0C0C0';
        for (let i = 0; i < 300; i++) {
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
        }

        ctx.fillStyle = '#555';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 12);
        ctx.fillText('RASPE AQUI', 0, 0);
        ctx.restore();
    }

    // --- Interactions ---
    function setupEventListeners() {
        let isDrawing = false;

        const startScratch = (e) => { isDrawing = true; handleScratch(e); };
        const stopScratch = () => { isDrawing = false; };
        const moveScratch = (e) => { if (!isDrawing) return; handleScratch(e); };

        canvas.addEventListener('mousedown', startScratch);
        canvas.addEventListener('touchstart', (e) => { isDrawing = true; handleScratch(e); });

        window.addEventListener('mouseup', stopScratch);
        window.addEventListener('touchend', stopScratch);

        canvas.addEventListener('mousemove', moveScratch);
        canvas.addEventListener('touchmove', (e) => {
            if (isDrawing) handleScratch(e);
        }, { passive: false });

        revealBtn.addEventListener('click', finishReveal);
        newTicketBtnWin.addEventListener('click', generateTicket);
        newTicketBtnLose.addEventListener('click', generateTicket);

        // Validation Flow Buttons
        claimBtn.addEventListener('click', handleClaim);
        validateBtn.addEventListener('click', handleValidation);
    }

    function handleScratch(e) {
        if (state.isRevealed) return;

        const rect = canvas.getBoundingClientRect();
        let x, y;

        if (e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();

        if (fingerHint.style.display !== 'none') {
            fingerHint.style.display = 'none';
        }

        if (Math.random() < 0.1) checkProgress();
    }

    function checkProgress() {
        const w = canvas.width;
        const h = canvas.height;
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        let transparent = 0;
        const jump = 4 * 40;

        for (let i = 0; i < data.length; i += jump) {
            if (data[i + 3] < 128) transparent++;
        }

        const totalChecked = data.length / jump;
        const pct = (transparent / totalChecked) * 100;

        state.scratchProgress = pct;

        if (pct > 40 && !state.isRevealed) {
            state.isRevealed = true;
            showRevealButton();
        }
    }

    function showRevealButton() {
        btnOverlay.style.display = 'flex';
    }

    function finishReveal() {
        canvas.style.transition = 'opacity 0.5s';
        canvas.style.opacity = '0';
        setTimeout(() => {
            canvas.style.display = 'none';
            btnOverlay.style.display = 'none';
            highlightWinners();
            showResultModal();
        }, 500);
    }

    function highlightWinners() {
        if (state.result.type === 'win') {
            const items = gridContainer.children;
            for (let div of items) {
                if (div.dataset.isWinner === 'true') {
                    div.classList.add('winner-item');
                }
            }
        }
    }

    function showResultModal() {
        setTimeout(() => {
            if (state.result.type === 'win') {
                prizeLabelClaim.innerText = state.result.prize.label;
                claimStep.style.display = 'block';
                loseContent.style.display = 'none';
            } else {
                claimStep.style.display = 'none';
                loseContent.style.display = 'block';
            }
            resultModal.style.display = 'flex';
        }, 1000);
    }

    // --- Validation Logic ---

    function handleClaim() {
        const name = userNameInput.value.trim();
        if (!name) {
            alert('Por favor, digite seu nome!');
            return;
        }

        // Prepare WhatsApp Message
        const phone = '558183920320';
        const msg = `Olá! Acabei de ganhar na Raspadinha da Sorte da OlindAki! 🎉\n\nNome: *${name}*\nTicket: *${state.ticketId}*\nPrêmio: *${state.result.prize.label}*\nData: ${new Date().toLocaleString()}\n\nPor favor, valide meu prêmio!`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

        // Open WhatsApp
        window.open(url, '_blank');

        // Move to next step
        claimStep.style.display = 'none';
        validateStep.style.display = 'block';
    }

    function handleValidation() {
        const inputCode = validationPasswordInput.value.trim();
        const validCode = getHourlyCode(); // Calculate Code
        const MASTER_CODE = '9999'; // Fallback

        if (inputCode === validCode || inputCode === MASTER_CODE) {
            // Success!
            validateStep.style.display = 'none';
            successStep.style.display = 'block';

            prizeLabelFinal.innerText = state.result.prize.label;
            couponCode.innerText = `${state.ticketId}-VIP`;
        } else {
            console.log("Expected:", validCode, "Got:", inputCode);
            validationError.style.display = 'block';
            validationPasswordInput.value = '';
        }
    }

    // Start
    init();
});
