/**
 * GA4 Event Tracking Helper
 * 
 * Sends custom events to Google Analytics 4 via the gtag() function
 * injected by @next/third-parties/google.
 * 
 * Events are silently dropped if:
 * - Code runs on server (SSR)
 * - gtag is not loaded (e.g. cookie consent not given)
 */

// Extend Window interface for gtag
declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

type EventParams = Record<string, string | number | boolean>;

export function trackEvent(eventName: string, params?: EventParams): void {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", eventName, params);
    }
}

// Pre-defined event helpers for type safety and consistency

export function trackPhoneCall(label: string, phoneNumber: string): void {
    trackEvent("phone_call", {
        event_category: "contact",
        event_label: label,
        value: phoneNumber.replace(/\s/g, ""),
    });
}

export function trackSmsSend(label: string, phoneNumber: string): void {
    trackEvent("sms_send", {
        event_category: "contact",
        event_label: label,
        value: phoneNumber.replace(/\s/g, ""),
    });
}

export function trackEmailClick(label: string, email: string): void {
    trackEvent("email_click", {
        event_category: "contact",
        event_label: label,
        value: email,
    });
}
