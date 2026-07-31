import { generateOAuthURL } from '../config/config';
import { isStorageSupported } from '../storage/storage';

type TLoginUrl = {
    language: string;
};

/**
 * Builds a fallback login URL. Prefer `generateOAuthURL` for new call sites.
 */
export const loginUrl = ({ language }: TLoginUrl) => {
    void language;
    return window.location.origin;
};

export const redirectToLogin = (is_logged_in: boolean, language: string, has_params = true, redirect_delay = 0) => {
    if (!is_logged_in && isStorageSupported(sessionStorage)) {
        const l = window.location;
        const redirect_url = has_params ? window.location.href : `${l.protocol}//${l.host}${l.pathname}`;
        sessionStorage.setItem('redirect_url', redirect_url);
        setTimeout(() => {
            void (async () => {
                const url = await generateOAuthURL();
                window.location.href = url || loginUrl({ language });
            })();
        }, redirect_delay);
    }
};

export const redirectToSignUp = () => {
    void (async () => {
        const url = await generateOAuthURL('registration');
        if (url) window.open(url);
    })();
};
