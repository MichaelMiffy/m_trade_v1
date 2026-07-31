const REDIRECT_LOCK_KEY = 'oauth_redirect_in_progress';
const LOCK_TTL_MS = 5000; // safety expiry, in case a redirect never actually happens

export const tryAcquireOAuthRedirectLock = (): boolean => {
    const existing = sessionStorage.getItem(REDIRECT_LOCK_KEY);
    if (existing) {
        const timestamp = parseInt(existing, 10);
        if (!isNaN(timestamp) && Date.now() - timestamp < LOCK_TTL_MS) {
            return false; // another redirect is already in progress
        }
    }
    sessionStorage.setItem(REDIRECT_LOCK_KEY, Date.now().toString());
    return true;
};
