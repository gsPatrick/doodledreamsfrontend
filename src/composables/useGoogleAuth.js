import { ref, onMounted } from 'vue';

const SCRIPT_ID = 'google-identity-services-script';
const GOOGLE_CLIENT_ID = process.env.VUE_APP_GOOGLE_CLIENT_ID || 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com';

let googleAuth = null;
const isScriptLoaded = ref(false);

const loadGoogleScript = () => {
    return new Promise((resolve, reject) => {
        if (document.getElementById(SCRIPT_ID)) {
            isScriptLoaded.value = true;
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            isScriptLoaded.value = true;
            resolve();
        };
        script.onerror = () => {
            reject(new Error('Falha ao carregar o script do Google.'));
        };
        document.head.appendChild(script);
    });
};

const initializeGoogleAuth = () => {
    return new Promise((resolve) => {
        if (window.google && window.google.accounts) {
            googleAuth = window.google.accounts.id;
            googleAuth.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response) => {
                    // Este callback será tratado no componente que o chama
                },
            });
            resolve(googleAuth);
        } else {
            // Tenta novamente em um instante se o script acabou de carregar
            setTimeout(() => resolve(initializeGoogleAuth()), 100);
        }
    });
};

export function useGoogleAuth() {
    onMounted(async () => {
        try {
            await loadGoogleScript();
            await initializeGoogleAuth();
        } catch (error) {
            console.error(error);
        }
    });

    const triggerGoogleLogin = (callback) => {
        if (!googleAuth) {
            console.error('Google Auth não inicializado.');
            return;
        }
        // Atualiza o callback para a instância atual
        googleAuth.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback,
        });

        // Dispara o prompt de login
        googleAuth.prompt();
    };

    return {
        isGoogleAuthReady: isScriptLoaded,
        triggerGoogleLogin,
    };
} 