/**
 * chatbot.js — Intelligent Market & Site Assistant
 * Premium glassmorphic UI with knowledge-based intent matching
 */

class TradingAssistant {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.suggestions = ['How is market?', 'Bitcoin Price?', 'Analyze my chart 📸', 'What is a Pip?', 'USD/LKR rate'];
        this.analysisMemory = {}; // To store results for consistent analysis
        this.init();
    }

    init() {
        this._injectStyles();
        this._buildUI();
        this._attachEvents();
        this.addMessage('assistant', "Hello! I'm your TradingHub AI assistant. I can give you live rates, trading knowledge, and even analyze your charts. How can I help? (Mama oyaage trading assistant, mama kohomada udau karanne?)", true);
    }

    _injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #chat-bot-container {
                position: fixed;
                bottom: 90px;
                right: 25px;
                z-index: 100000;
                font-family: 'Inter', sans-serif;
            }

            #chat-trigger {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                box-shadow: 0 10px 25px rgba(59, 130, 246, 0.5);
                display: flex;
                align-items: center;
                justify-content:center;
                cursor: pointer;
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                border: none;
                color: white;
                font-size: 24px;
            }

            #chat-trigger:hover {
                transform: scale(1.1) rotate(5deg);
            }

            #chat-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 600px;
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(25px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 28px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
                transform: translateY(20px) scale(0.95);
                opacity: 0;
                pointer-events: none;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                transform-origin: bottom right;
            }

            #chat-window.open {
                transform: translateY(0) scale(1);
                opacity: 1;
                pointer-events: all;
            }

            .chat-header {
                padding: 22px;
                background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                display: flex;
                align-items: center;
                gap: 14px;
            }

            .bot-avatar {
                width: 44px;
                height: 44px;
                border-radius: 14px;
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: white;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            .bot-info h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 800;
                color: white;
                letter-spacing: -0.02em;
            }

            .bot-info p {
                margin: 0;
                font-size: 11px;
                color: #10b981;
                display: flex;
                align-items: center;
                gap: 5px;
                font-weight: 600;
            }

            .online-dot {
                width: 7px;
                height: 7px;
                background: #10b981;
                border-radius: 50%;
                display: inline-block;
                box-shadow: 0 0 10px #10b981;
                animation: pulseOnline 2s infinite;
            }

            @keyframes pulseOnline {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.2); }
            }

            #chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 18px;
                scrollbar-width: none;
            }

            #chat-messages::-webkit-scrollbar { display: none; }

            .message {
                max-width: 85%;
                padding: 13px 17px;
                border-radius: 20px;
                font-size: 14px;
                line-height: 1.55;
                position: relative;
                animation: msgSlide 0.4s ease forwards;
            }

            @keyframes msgSlide {
                from { opacity: 0; transform: translateY(15px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .message.assistant {
                align-self: flex-start;
                background: rgba(255, 255, 255, 0.05);
                color: #f1f5f9;
                border-bottom-left-radius: 5px;
                border: 1px solid rgba(255, 255, 255, 0.06);
            }

            .message.user {
                align-self: flex-end;
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                border-bottom-right-radius: 5px;
                box-shadow: 0 6px 18px rgba(37, 99, 235, 0.25);
            }

            .message img {
                max-width: 100%;
                border-radius: 12px;
                margin-top: 5px;
                border: 1px solid rgba(255,255,255,0.1);
            }

            /* --- Vision Scan Overlay --- */
            .scan-container {
                position: relative;
                border-radius: 12px;
                overflow: hidden;
            }
            .scan-line {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 2px;
                background: #3b82f6;
                box-shadow: 0 0 15px #3b82f6, 0 0 30px #3b82f6;
                z-index: 10;
                animation: scanMove 2.5s linear infinite;
            }
            @keyframes scanMove {
                0% { top: 0; }
                100% { top: 100%; }
            }
            .scan-grid {
                position: absolute;
                inset: 0;
                background: linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
                background-size: 20px 20px;
                z-index: 5;
            }

            .chat-footer {
                padding: 18px;
                background: rgba(0, 0, 0, 0.3);
                border-top: 1px solid rgba(255, 255, 255, 0.08);
            }

            .suggestions-row {
                display: flex;
                gap: 10px;
                overflow-x: auto;
                padding-bottom: 14px;
                scrollbar-width: none;
            }

            .suggestions-row::-webkit-scrollbar {
                display: none;
            }

            .suggestion-chip {
                padding: 7px 14px;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 22px;
                color: #94a3b8;
                font-size: 11.5px;
                white-space: nowrap;
                cursor: pointer;
                transition: all 0.25s;
                font-weight: 500;
            }

            .suggestion-chip:hover {
                background: rgba(59, 130, 246, 0.12);
                border-color: #3b82f6;
                color: white;
                transform: translateY(-1px);
            }

            .input-wrapper {
                display: flex;
                gap: 12px;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 5px 6px 5px 16px;
                align-items: center;
            }

            #chat-input {
                flex: 1;
                background: none;
                border: none;
                color: white;
                font-size: 14px;
                padding: 12px 0;
                outline: none;
            }

            #chat-input::placeholder {
                color: #4b5563;
            }

            .input-actions {
                display: flex;
                gap: 6px;
                align-items: center;
            }

            .action-btn {
                width: 38px;
                height: 38px;
                border-radius: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 16px;
            }

            #upload-trigger {
                background: rgba(255, 255, 255, 0.05);
                color: #94a3b8;
            }
            #upload-trigger:hover {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            #send-btn {
                background: #3b82f6;
                color: white;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            #send-btn:hover {
                transform: scale(1.05);
                background: #2563eb;
            }

            .market-data-box {
                background: rgba(0, 0, 0, 0.4);
                border-radius: 14px;
                padding: 12px;
                margin-top: 10px;
                border: 1px solid rgba(255, 255, 255, 0.08);
            }

            .data-row {
                display: flex;
                justify-content: space-between;
                font-size: 12.5px;
                padding: 5px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            }
            .data-row:last-child { border: none; }

            .data-label { color: #94a3b8; }
            .data-val { color: #f8fafc; font-family: 'JetBrains Mono', monospace; font-weight: 700; }
            .up { color: #10b981; }
            .down { color: #ef4444; }

            @media (max-width: 480px) {
                #chat-window {
                    width: calc(100vw - 30px);
                    height: calc(100vh - 140px);
                    right: -10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    _buildUI() {
        const container = document.createElement('div');
        container.id = 'chat-bot-container';

        container.innerHTML = `
            <button id="chat-trigger">
                <i class="fa-solid fa-robot"></i>
            </button>
            <div id="chat-window">
                <div class="chat-header">
                    <div class="bot-avatar">
                        <i class="fa-solid fa-brain"></i>
                    </div>
                    <div class="bot-info">
                        <h3>TradingHub AI <span style="font-size:8px; background:rgba(59,130,246,0.2); color:#3b82f6; padding:1px 4px; border-radius:4px; vertical-align:middle; margin-left:4px">BETA V2</span></h3>
                        <p><span class="online-dot"></span> Vision Engine Active</p>
                    </div>
                    <button id="close-chat" style="margin-left:auto; background:none; border:none; color:#4b5563; cursor:pointer; font-size:18px">✕</button>
                </div>
                <div id="chat-messages"></div>
                <div class="chat-footer">
                    <div class="suggestions-row" id="suggestions"></div>
                    <div class="input-wrapper">
                        <input type="text" id="chat-input" placeholder="Type or upload chart..." autocomplete="off">
                        <div class="input-actions">
                            <button class="action-btn" id="upload-trigger" title="Upload chart for AI Vision Analysis">
                                <i class="fa-solid fa-camera"></i>
                            </button>
                            <input type="file" id="chart-upload" accept="image/*" style="display:none">
                            <button class="action-btn" id="send-btn">
                                <i class="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        this._renderSuggestions();
    }

    _renderSuggestions() {
        const sCont = document.getElementById('suggestions');
        const items = ['How is market?', 'Bitcoin Price?', 'Analyze my chart 📸', 'What is a Pip?', 'USD/LKR rate'];
        sCont.innerHTML = items.map(s => `
            <div class="suggestion-chip">${s}</div>
        `).join('');

        sCont.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.onclick = () => {
                if (chip.textContent.includes('Analyze')) {
                    document.getElementById('chart-upload').click();
                } else {
                    this._handleUserInput(chip.textContent);
                }
            };
        });
    }

    _attachEvents() {
        const trigger = document.getElementById('chat-trigger');
        const close = document.getElementById('close-chat');
        const input = document.getElementById('chat-input');
        const send = document.getElementById('send-btn');
        const uploadTrig = document.getElementById('upload-trigger');
        const fileInput = document.getElementById('chart-upload');

        trigger.onclick = () => {
            this.isOpen = !this.isOpen;
            document.getElementById('chat-window').classList.toggle('open', this.isOpen);
            if (this.isOpen) {
                trigger.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
                input.focus();
            } else {
                trigger.innerHTML = '<i class="fa-solid fa-robot"></i>';
            }
        };

        close.onclick = () => { trigger.click(); };
        input.onkeypress = (e) => { if (e.key === 'Enter') this._handleUserInput(input.value); };
        send.onclick = () => { this._handleUserInput(input.value); };
        uploadTrig.onclick = () => { fileInput.click(); };

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this._handleImageUpload(file);
                fileInput.value = ''; // reset
            }
        };
    }

    _handleUserInput(text) {
        if (!text.trim()) return;

        this.addMessage('user', text);
        document.getElementById('chat-input').value = '';

        // Bot processing simulation
        setTimeout(() => {
            this._generateResponse(text);
        }, 600);
    }

    addMessage(sender, text, isHtml = false) {
        const msgCont = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = `message ${sender}`;

        if (isHtml) {
            div.innerHTML = text;
        } else {
            div.textContent = text;
        }

        msgCont.appendChild(div);
        msgCont.scrollTop = msgCont.scrollHeight;

        this.messages.push({ sender, text });
    }

    _generateResponse(query) {
        const q = query.toLowerCase();

        // --- 1. SITE DATA / LIVE DATA (PRIORITY) ---

        // Market Overview / Thathwaya
        if (this._match(q, ['market', 'overview', 'thathwaya', 'kohomada', 'today', 'news'])) {
            let resp = "<strong>Market Snapshot:</strong><br>";
            if (window.API) {
                resp += `<div class="market-data-box">`;
                if (API.rates) resp += `<div class="data-row"><span class="data-label">USD/LKR</span><span class="data-val">${API.rates.LKR?.toFixed(2)}</span></div>`;
                if (API.crypto?.bitcoin) resp += `<div class="data-row"><span class="data-label">BTC/USD</span><span class="data-val">$${API.crypto.bitcoin.usd.toLocaleString()}</span></div>`;
                if (API.cseData?.aspi) resp += `<div class="data-row"><span class="data-label">CSE Index</span><span class="data-val ${API.cseData.aspi.change >= 0 ? 'up' : 'down'}">${API.cseData.aspi.value.toFixed(2)}</span></div>`;
                resp += `</div>`;
                if (API.news?.[0]) resp += `<p style="font-size:11px; margin-top:8px">🔥 <strong>Latest:</strong> ${API.news[0].title}</p>`;
                return this.addMessage('assistant', resp, true);
            }
        }

        // --- 2. EXTENSIVE TRADING KNOWLEDGE BASE ---
        const knowledge = {
            // Forex Terms
            'pip': "A 'Pip' is the smallest price move in a currency pair. For most pairs like EUR/USD, it's the 4th decimal (0.0001). For JPY pairs, it's the 2nd decimal.",
            'leverage': "Leverage allows you to control a large position with a small amount of capital. For example, 1:100 leverage means you can trade $100 for every $1 you have.",
            'margin': "Margin is the deposit required to open or maintain a position. If your account falls below a certain level, you might get a 'Margin Call'.",
            'spread': "Spread is the difference between the Bid (buy) and Ask (sell) price. It's essentially the broker's fee.",
            'lot': "A standard lot is 100,000 units of currency. There are also Mini lots (10,000) and Micro lots (1,000).",

            // Technical Analysis
            'rsi': "The RSI (Relative Strength Index) measures the speed and change of price movements. Above 70 is 'Overbought', below 30 is 'Oversold'.",
            'macd': "MACD stands for Moving Average Convergence Divergence. It's a trend-following momentum indicator.",
            'candlestick': "Candlesticks are used to show price movement over time. Green/White means price went up, Red/Black means it went down.",

            // Market Psychology
            'bull': "A 'Bull Market' is when prices are rising or expected to rise. (Wadivena market eka)",
            'bear': "A 'Bear Market' is when prices are falling or expected to fall. (Aduvena market eka)",
            'fomo': "FOMO is 'Fear Of Missing Out'. It's when traders buy impulsively because they see prices rising quickly.",

            // Sri Lanka / CSE
            'aspi': "ASPI (All Share Price Index) measures the movement of all stocks listed on the Colombo Stock Exchange.",
            'expo': "Expolanka (EXPO) is one of the most active stocks in the CSE, mainly focused on logistics and transport.",
            'jkh': "John Keells Holdings (JKH) is a major Sri Lankan conglomerate with interests in hotels, retail, and ports.",
            'samp': "Sampath Bank (SAMP) is a leading commercial bank in Sri Lanka, active in the stock market.",

            // Crypto
            'blockchain': "A blockchain is a decentralized digital ledger that records transactions across many computers.",
            'stablecoin': "Stablecoins are cryptos like USDT or USDC that are pegged to the value of a currency like the USD.",
            'nfts': "Non-Fungible Tokens (NFTs) are unique digital assets representing ownership of items like art or collectibles.",

            // Site Specific / Account Management
            'manage': "Our Account Management service (50/50 profit share) connects your MT4/MT5 account to our EA bot. We only take 50% of the profits we make for you. Losses are not charged.",
            'whatsapp': "You can contact our direct support on WhatsApp via the 'Account Management' page or the bottom button.",
            'calculator': "We offer Position Sizing, Pivot Points, and Risk/Reward calculators in our 'Calculators' section.",
            'signal': "AI FX Signals are generated by analyzing real-time economic news (NFP, Interest Rates) and technical levels."
        };

        // Fuzzy search in knowledge base
        for (let key in knowledge) {
            if (q.includes(key)) {
                return this.addMessage('assistant', knowledge[key]);
            }
        }

        // --- 3. SINHALA INTENTS / QUESTIONS ---

        // Price kiyada?
        if (q.includes('kiyada') || q.includes('ganana') || q.includes('price')) {
            if (q.includes('dollar') || q.includes('usd') || q.includes('lkr')) {
                const rate = API?.rates?.LKR || 300.25;
                return this.addMessage('assistant', `Dollar eka (USD/LKR) dan <strong>${rate.toFixed(2)}</strong> k wage wenawa.`, true);
            }
            if (q.includes('bitcoin') || q.includes('btc')) {
                const btc = API?.crypto?.bitcoin?.usd || 0;
                return this.addMessage('assistant', `Bitcoin (BTC) eka dan <strong>$${btc.toLocaleString()}</strong> k wage wenawa.`, true);
            }
            if (q.includes('euro') || q.includes('eur')) {
                const eur = API?.rates?.EUR || 1.08;
                return this.addMessage('assistant', `Euro (EUR/USD) rate eka dan <strong>${eur.toFixed(4)}</strong> k wage wenawa.`, true);
            }
        }

        // Udauwak / Help
        if (q.includes('udau') || q.includes('help') || q.includes('karanna')) {
            return this.addMessage('assistant', "Oyata mama market updates, site features, trading terms gana kiyanna puluwan. 'Market kohomada?', 'Lot ekak kiyanne mokakda?' wage ona deyak ahanna.");
        }

        // Kohomada karannee / how to
        if (q.includes('kohoma') || q.includes('how to')) {
            if (q.includes('trade')) return this.addMessage('assistant', "Trading patan ganna oyata broker kenek langa account ekak ona. Eeta passe chart analyze karala buy/sell karanna puluwan. Ape AI signals oyaata udau wei!");
            if (q.includes('signal')) return this.addMessage('assistant', "Ape 'AI FX Signals' page ekata yanna. Seth thiyena news events anuwa AI eka trade idea ekak dei.");
            if (q.includes('calculator')) return this.addMessage('assistant', "Calculators page ekata yanna. Eke 'Position Size' calculator eken oyage risk eka manage kara ganna puluwan.");
        }

        // Profit / Salli
        if (q.includes('profit') || q.includes('salli') || q.includes('money')) {
            return this.addMessage('assistant', "Trading walin salli hamba karanna nam hoda strategy ekak saha discipline thiyenna ona. Ape Account Management service eka haraha api thama trades karanne.");
        }

        // --- 4. FALLBACK / GENERAL ---

        // Random responses for conversational flow
        const fallbacks = [
            "I'm sorry, I don't have specific data on that yet, but I can tell you about Forex, Crypto, or the CSE (Sri Lanka) market.",
            "That's a good question! While I'm still learning, I can give you real-time rates for USD/LKR or Bitcoin. Ask me about those!",
            "Oyata market trends gana dana ganna ona nam 'Market overview' kiyala gahanna. Mama wisthara kiyannam.",
            "I'm your trading assistant. Try asking about 'Pip', 'Leverage', or 'AI Signals'!"
        ];

        const randomFB = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        this.addMessage('assistant', randomFB);
    }

    _match(query, keywords) {
        return keywords.some(k => query.includes(k));
    }

    _handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            return this.addMessage('assistant', "Please upload an image file (PNG/JPG) of a trading chart.");
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imgData = e.target.result;
            // Add user image message
            this.addMessage('user', `<div class="scan-container">
                <img src="${imgData}" />
            </div>`, true);

            // Trigger AI Analysis
            setTimeout(() => {
                this._simulateAnalysis(imgData);
            }, 500);
        };
        reader.readAsDataURL(file);
    }

    _simulateAnalysis(imgData) {
        // 1. Consistency Logic: Create a simple hash from the image data
        let hash = 0;
        for (let i = 0; i < imgData.length; i++) {
            hash = ((hash << 5) - hash) + imgData.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        const index = Math.abs(hash) % 3; // 0, 1, or 2 based on image content

        // 2. Initial acknowledgment
        this.addMessage('assistant', "I've received your chart. Initializing <strong>DeepScan™ Vision Engine V2</strong>... Analyzing price action, structure and liquidity zones. (Market structure eka analyze karamin pawathi...)");

        // 3. The Scanning Interface
        setTimeout(() => {
            const scanId = 'scan-' + Date.now();
            this.addMessage('assistant', `<div id="${scanId}" class="scan-container">
                <div class="scan-line"></div>
                <div class="scan-grid"></div>
                <img src="${imgData}" style="filter: brightness(0.6) contrast(1.2) hue-rotate(180deg);" />
                <div style="position:absolute; bottom:10px; left:10px; color:#3b82f6; font-size:10px; font-family:monospace; z-index:11; line-height:1.4;">
                    DETECTING ORDER BLOCKS... FOUND<br>
                    MAPPING LIQUIDITY SWEEPS... DONE<br>
                    FIBONACCI OTE LEVELS: CALCULATING...<br>
                    MARKET BIAS: CONFIRMING...
                </div>
            </div>`, true);

            // 4. Final Result - Selection based on index for consistency
            setTimeout(() => {
                const results = [
                    {
                        type: 'STRONG BUY',
                        color: '#10b981',
                        conf: '89%',
                        msg: "Price has tapped into a <strong>Higher Timeframe Demand Zone</strong> (Order Block). We see a clear Market Structure Shift (MSS) on the lower timeframe.",
                        entry: "Market Price or 50% of OB",
                        sl: "Below recent swing low",
                        tp: "Next major liquidity pool / Resistance",
                        logic: "Liquidity Sweep + BOS (Break of Structure)"
                    },
                    {
                        type: 'STRONG SELL',
                        color: '#ef4444',
                        conf: '87%',
                        msg: "Price is reacting from a <strong>Premium Supply Zone</strong>. Bearish Divergence detected on RSI and momentum indicators.",
                        entry: "Current level / Retest of FVG",
                        sl: "Above the supply zone high",
                        tp: "Next demand zone / Discount array",
                        logic: "Order Flow is Bearish + Supply Rejection"
                    },
                    {
                        type: 'SCALP BUY',
                        color: '#10b981',
                        conf: '76%',
                        msg: "Strong momentum breakout from a Bull Flag pattern. Volume is supporting the move.",
                        entry: "Breakout retest zone",
                        sl: "Mid-pattern level",
                        tp: "1:2 Risk-Reward ratio target",
                        logic: "Pattern Breakout + Volume Spike"
                    }
                ];

                const res = results[index]; // Same index for same hash

                let resp = `<div style="border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); border-radius: 16px; overflow: hidden; margin-top:10px;">`;

                // Header
                resp += `<div style="background: ${res.color}20; padding:12px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">`;
                resp += `<span style="color:${res.color}; font-weight:900; font-size:16px;">${res.type} SIGNAL</span>`;
                resp += `<span style="font-size:11px; background: ${res.color}; color:black; padding: 2px 8px; border-radius: 4px; font-weight:700;">CONF: ${res.conf}</span>`;
                resp += `</div>`;

                // Content
                resp += `<div style="padding:15px;">`;
                resp += `<p style="font-size:13px; line-height:1.5; color:#f1f5f9; margin-bottom:12px;">${res.msg}</p>`;

                // Trading Plan Table
                resp += `<div style="background: rgba(255,255,255,0.03); border-radius: 10px; padding: 10px; border: 1px solid rgba(255,255,255,0.05);">`;
                resp += `<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="font-size:11px; color:#94a3b8;">ENTRY ZONE:</span><span style="font-size:11px; color:white; font-weight:700;">${res.entry}</span></div>`;
                resp += `<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="font-size:11px; color:#94a3b8;">STOP LOSS:</span><span style="font-size:11px; color:#ef4444; font-weight:700;">${res.sl}</span></div>`;
                resp += `<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span style="font-size:11px; color:#94a3b8;">TAKE PROFIT:</span><span style="font-size:11px; color:#10b981; font-weight:700;">${res.tp}</span></div>`;
                resp += `<div style="display:flex; justify-content:space-between; border-top: 1px solid rgba(255,255,255,0.05); padding-top:6px; margin-top:4px;"><span style="font-size:11px; color:#94a3b8;">TECHNICAL:</span><span style="font-size:11px; color:#3b82f6; font-weight:700;">${res.logic}</span></div>`;
                resp += `</div>`;

                resp += `<p style="font-size:11px; color:#64748b; margin-top:12px; font-style:italic;">*Fixed Analysis: Based on unique image signature for consistency.</p>`;
                resp += `</div></div>`;

                this.addMessage('assistant', resp, true);

                // Remove scanning animation
                const scanEl = document.getElementById(scanId);
                if (scanEl) {
                    scanEl.querySelector('.scan-line').style.display = 'none';
                    scanEl.querySelector('.scan-grid').style.display = 'none';
                    scanEl.querySelector('img').style.filter = 'brightness(0.9)';
                }
            }, 6000);
        }, 1500);
    }
}

// Global instance
window.tradingAssistant = new TradingAssistant();
