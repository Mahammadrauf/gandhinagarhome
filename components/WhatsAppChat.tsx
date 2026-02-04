"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, MessageSquare, Clock, ShieldCheck } from "lucide-react";

/** ============ Config ============ */
const WHATSAPP_NUMBER = "919998274454";
const FIRST_NUDGE_DELAY_MS = 3000;
const NUDGE_INTERVAL_MS = 30000; 
const NUDGE_AUTOHIDE_MS = 2600;
const SNOOZE_AFTER_CLOSE_MS = 180000; 
const STORAGE_KEYS = {
  lastSnooze: "gh_wa_last_snooze",
};

/** Rotate among these light nudges */
const NUDGES = [
  "Need help finding the right property?",
  "Questions about 2/3/4 BHK, plots, or bungalows?",
  "Get quick answers on WhatsApp!",
  "Confused between areas like Kudasan or Sargasan?",
];

/** Quick replies -> one tap prefilled messages */
const QUICK_REPLIES: { label: string; text: string }[] = [
  { label: "2 BHK options", text: "Hi! I'm exploring 2 BHK options in Gandhinagar." },
  { label: "3 BHK options", text: "Hi! I want to check 3 BHK availability and pricing." },
  { label: "Bungalow", text: "Hi! I’m interested in bungalows—please share options." },
  { label: "Plot details", text: "Hi! Could you share residential plot details in good areas?" },
  { label: "List my property", text: "Hi! I want to list my property as Featured/Exclusive." },
];

/** Utility */
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const encode = (s: string) => encodeURIComponent(s);

const openWhatsApp = (msg: string) => {
  const page = typeof window !== "undefined" ? window.location.href : "";
  const final = `${msg}\n\n(Page: ${page})`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encode(final)}`;
  window.open(url, "_blank");
};

/** Greeting by local time */
const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const WhatsAppChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgeIndex, setNudgeIndex] = useState(0);
  const [unread, setUnread] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInteraction = useRef<number>(0);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const nudgeText = useMemo(() => NUDGES[nudgeIndex % NUDGES.length], [nudgeIndex]);

  const toggleOpen = (next?: boolean) => {
    const willOpen = typeof next === "boolean" ? next : !isOpen;
    setIsOpen(willOpen);
    if (!willOpen) {
      localStorage.setItem(STORAGE_KEYS.lastSnooze, String(Date.now()));
    } else {
      setUnread(false);
    }
  };

  const handleOpenWA = (text?: string) => {
    const msg = text ?? "Hello, I'd like to ask a query.";
    openWhatsApp(msg);
    setIsOpen(false);
  };

  useEffect(() => {
    const clearTimers = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (hideRef.current) clearTimeout(hideRef.current);
      if (firstRef.current) clearTimeout(firstRef.current);
    };

    clearTimers();

    if (isOpen) return;

    const now = Date.now();
    const last = Number(localStorage.getItem(STORAGE_KEYS.lastSnooze) || "0");
    const snoozed = last && now - last < SNOOZE_AFTER_CLOSE_MS;

    const show = () => {
      setShowNudge(true);
      setUnread(true);
      hideRef.current = setTimeout(() => setShowNudge(false), NUDGE_AUTOHIDE_MS);
      setNudgeIndex((i) => i + 1);
    };

    if (!snoozed) {
      firstRef.current = setTimeout(show, FIRST_NUDGE_DELAY_MS);
    }

    intervalRef.current = setInterval(() => {
      if (Date.now() - lastInteraction.current < 10000) return;
      const lastS = Number(localStorage.getItem(STORAGE_KEYS.lastSnooze) || "0");
      if (lastS && Date.now() - lastS < SNOOZE_AFTER_CLOSE_MS) return;
      show();
    }, NUDGE_INTERVAL_MS);

    return clearTimers;
  }, [isOpen]);

  useEffect(() => {
    const onUserAction = () => {
      lastInteraction.current = Date.now();
    };
    window.addEventListener("scroll", onUserAction, { passive: true });
    window.addEventListener("pointerdown", onUserAction, { passive: true });
    return () => {
      window.removeEventListener("scroll", onUserAction);
      window.removeEventListener("pointerdown", onUserAction);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const el = popupRef.current;
    el?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const motionSafe = !prefersReducedMotion();

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
        {showNudge && (
          <div
            className={[
              "mb-2 bg-white text-gray-800 text-sm px-3 py-2 rounded-xl shadow-lg border border-gray-200",
              motionSafe ? "animate-[fadeIn_.2s_ease,slideUp_.25s_ease]" : "",
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            {nudgeText}
          </div>
        )}

        <button
          onClick={() => toggleOpen()}
          onMouseEnter={() => (lastInteraction.current = Date.now())}
          className={[
            "relative bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-5 shadow-2xl transition-all transform w-20 h-20 md:w-24 md:h-24 flex items-center justify-center",
            motionSafe && showNudge ? "animate-[pulseSoft_0.7s_ease]" : "",
          ].join(" ")}
          aria-label="Chat on WhatsApp"
        >
          {unread && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 ring-2 ring-white z-10" aria-hidden />
          )}

          <svg
            viewBox="0 0 24 24"
            className="w-10 h-10 md:w-12 md:h-12 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[55] backdrop-blur-sm"
            onClick={() => toggleOpen(false)}
          />
          <div
            ref={popupRef}
            tabIndex={-1}
            className={[
              "fixed bottom-24 right-6 z-[60] w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden outline-none",
              motionSafe ? "animate-[slideUp_.18s_ease]" : "",
            ].join(" ")}
            role="dialog"
            aria-modal="true"
            aria-label="Chat on WhatsApp"
          >
            <div className="bg-gradient-to-r from-[#25D366] to-[#20BA5A] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full grid place-items-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{greeting()}, we’re online</h3>
                  <div className="flex items-center gap-2 text-[11px] text-white/90">
                    <Clock className="w-3.5 h-3.5" />
                    Typically replies within 5 minutes
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleOpen(false)}
                className="text-white/95 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-gray-700 mb-4">
                Tell us what you’re looking for, or tap a quick question below:
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => handleOpenWA(q.text)}
                    className="px-3 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/15 transition"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleOpenWA("Hello! I'd like to ask a query.")}
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-3.5 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"
                    fill="currentColor"
                  />
                </svg>
                Chat on WhatsApp
              </button>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4" />
                Secure & private — opens official WhatsApp
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulseSoft {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
};

export default WhatsAppChat;