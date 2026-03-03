/**
 * auth.js — Firebase Auth Guard + Sidebar user profile
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ── App Loading Overlay ──────────────────────────────────────────────────────
const _injectLoader = () => {
    if (document.getElementById('authLoader')) return;
    const loader = document.createElement('div');
    loader.id = 'authLoader';
    loader.style.cssText = `
        position: fixed; inset: 0; z-index: 99999;
        background: #050b14; display: flex; flex-direction: column;
        align-items: center; justify-content: center; gap: 20px;
        transition: opacity 0.5s ease-out;
    `;
    loader.innerHTML = `
        <div class="loader-ring"></div>
        <div class="flex items-center gap-3 animate-pulse">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                <i class="fa-solid fa-chart-line text-white text-sm"></i>
            </div>
            <span class="text-white font-black tracking-widest uppercase text-xs">TradingHub</span>
        </div>
        <style>
            .loader-ring {
                width: 48px; height: 48px; border: 3px solid rgba(255,255,255,0.05);
                border-top-color: #3b82f6; border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
        </style>
    `;
    document.body.appendChild(loader);
};

if (!window.location.pathname.endsWith('login.html')) {
    _injectLoader();
}

// ── Auth State Listener ───────────────────────────────────────────────────────
onAuthStateChanged(auth, user => {
    const isLoginPage = window.location.pathname.endsWith('login.html');
    const loader = document.getElementById('authLoader');

    if (!user) {
        if (!isLoginPage) {
            window.location.replace('login.html');
        } else if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
        return;
    }

    if (isLoginPage) {
        window.location.replace('index.html');
        return;
    }

    // Render profile & Clear loader
    _renderUserProfile(user);

    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
});

// ── Render User Profile ───────────────────────────────────────────────────────
function _renderUserProfile(user) {
    const slot = document.getElementById('userProfileSlot');
    if (!slot) return;

    const name = user.displayName || user.email.split('@')[0];
    const email = user.email;
    const photo = user.photoURL;
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);

    slot.innerHTML = `
        <div class="group relative px-2 py-2">
            <div class="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.06] group-hover:border-white/10 transition-all duration-300">
                <div class="relative shrink-0">
                    ${photo
            ? `<img src="${photo}" alt="User" class="w-10 h-10 rounded-xl object-cover ring-2 ring-white/5 ring-offset-2 ring-offset-[#050b14]">`
            : `<div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-sm font-black shadow-lg shadow-primary/20">${initials}</div>`
        }
                    <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050b14]"></div>
                </div>
                
                <div class="flex-1 min-w-0">
                    <p class="text-[11px] font-black text-white truncate leading-tight uppercase tracking-wide">${name}</p>
                    <p class="text-[9px] text-gray-500 truncate mt-0.5 font-medium">${email}</p>
                </div>

                <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button id="logoutBtn" title="Sign Out"
                        class="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20">
                        <i class="fa-solid fa-power-off text-[10px]"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        if (confirm('Are you sure you want to sign out?')) {
            await signOut(auth);
            window.location.replace('login.html');
        }
    });
}

// ── Global Helper ─────────────────────────────────────────────────────────────
window.thLogout = async () => {
    await signOut(auth);
    window.location.replace('login.html');
};

