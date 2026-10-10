"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getLiveChatConfig } from "@/lib/live-chat";
import "./live-chat.css";

type ChatStatus = "online" | "away" | "offline";
type LoadState = "idle" | "loading" | "ready" | "error";
type TawkAPI = {
  onLoad?: () => void;
  onStatusChange?: (status: ChatStatus) => void;
  onChatMaximized?: () => void;
  onChatMinimized?: () => void;
  onChatHidden?: () => void;
  onChatMessageAgent?: () => void;
  maximize?: () => void;
  showWidget?: () => void;
  hideWidget?: () => void;
  getStatus?: () => ChatStatus;
};

declare global {
  interface Window {
    Tawk_API?: TawkAPI;
    Tawk_LoadStart?: Date;
  }
}

type ChatContextValue = {
  loading: boolean;
  open: boolean;
  start: (trigger: HTMLButtonElement) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);
const SCRIPT_ID = "huamei-live-chat";
const LOAD_TIMEOUT_MS = 20_000;

export function LiveChatProvider({ children }: { children: ReactNode }) {
  const config = getLiveChatConfig();
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [status, setStatus] = useState<ChatStatus | null>(null);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const mounted = useRef(false);
  const loading = useRef(false);
  const opened = useRef(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const floatingTrigger = useRef<HTMLButtonElement | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      loading.current = false;
      if (timeout.current) clearTimeout(timeout.current);
      // The public-site layout persists across its routes. On exit (e.g.
      // Studio), keep the session but remove the widget from the screen.
      window.Tawk_API?.hideWidget?.();
    };
  }, []);

  function start(button: HTMLButtonElement) {
    if (!config || loading.current) return;
    trigger.current = button;
    setErrorDismissed(false);
    const api = (window.Tawk_API = window.Tawk_API || {});

    const restoreFocus = () => {
      if (!mounted.current) return;
      opened.current = false;
      setOpen(false);
      // The floating launcher is remounted when the provider closes. Wait
      // for that render; contact-page buttons can retain their original node.
      requestAnimationFrame(() => {
        if (!mounted.current || opened.current) return;
        const target = trigger.current?.isConnected ? trigger.current : floatingTrigger.current;
        target?.focus({ preventScroll: true });
      });
    };

    const showChat = () => {
      if (timeout.current) clearTimeout(timeout.current);
      loading.current = false;
      if (!mounted.current) {
        api.hideWidget?.();
        return;
      }
      if (!api.maximize || !api.showWidget) {
        setLoadState("error");
        return;
      }
      setLoadState("ready");
      setStatus(api.getStatus?.() ?? null);
      setUnread(false);
      api.showWidget();
      api.maximize();
      opened.current = true;
      setOpen(true);
    };

    api.onLoad = showChat;
    api.onStatusChange = (nextStatus) => {
      if (mounted.current) setStatus(nextStatus);
    };
    api.onChatMaximized = () => {
      if (!mounted.current) return;
      opened.current = true;
      setOpen(true);
      setUnread(false);
    };
    api.onChatMinimized = () => {
      api.hideWidget?.();
      restoreFocus();
    };
    api.onChatHidden = restoreFocus;
    api.onChatMessageAgent = () => {
      if (mounted.current && !opened.current) setUnread(true);
    };

    if (api.getStatus && api.maximize && api.showWidget) {
      showChat();
      return;
    }

    setLoadState("loading");
    loading.current = true;
    const failed = () => {
      if (timeout.current) clearTimeout(timeout.current);
      loading.current = false;
      if (mounted.current) setLoadState("error");
    };
    timeout.current = setTimeout(failed, LOAD_TIMEOUT_MS);

    // A slow provider may still finish after the timeout. Keep that single
    // request; a retry waits for it instead of installing a second widget.
    if (document.getElementById(SCRIPT_ID)) return;
    window.Tawk_LoadStart = new Date();
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = config.scriptSrc;
    script.charset = "UTF-8";
    script.crossOrigin = "anonymous";
    script.onerror = () => {
      script.remove();
      failed();
    };
    document.head.appendChild(script);
  }

  const statusText = unread
    ? "New reply"
    : status === "online"
      ? "Team online"
      : status === "away"
        ? "Team away"
        : status === "offline"
          ? "Team offline"
          : "Packaging enquiries";

  return (
    <ChatContext.Provider value={config ? { loading: loadState === "loading", open, start } : null}>
      {children}
      {config && !open && (
        <div className="hm-chat-float">
          {loadState === "error" && !errorDismissed && (
            <div className="hm-chat-error" role="alert">
              <button
                type="button"
                className="hm-chat-dismiss"
                aria-label="Dismiss chat connection error"
                onClick={() => setErrorDismissed(true)}
              >
                ×
              </button>
              <strong>Chat couldn’t connect.</strong>
              <p>Please try again, or send your project details.</p>
              <Link href="/begin">Send project details <span aria-hidden="true">↗</span></Link>
            </div>
          )}
          <button
            ref={floatingTrigger}
            type="button"
            className="hm-chat-launcher"
            aria-label={unread ? "Open live chat — new reply" : "Open live chat"}
            aria-busy={loadState === "loading"}
            aria-disabled={loadState === "loading"}
            aria-haspopup="dialog"
            onClick={(event) => start(event.currentTarget)}
          >
            <ChatIcon />
            <span className="hm-chat-launcher-copy">
              <span>{loadState === "loading" ? "Connecting…" : loadState === "error" ? "Retry live chat" : "Chat with us"}</span>
              <span className="hm-chat-status" aria-live="polite">{statusText}</span>
            </span>
            {unread && <span className="hm-chat-unread" aria-hidden="true" />}
          </button>
        </div>
      )}
    </ChatContext.Provider>
  );
}

/** Opens the same chat/session as the floating launcher. */
export function LiveChatButton({
  children = "Start a live chat",
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  const chat = useContext(ChatContext);
  if (!chat) return null;
  return (
    <button
      type="button"
      className={`hm-chat-button ${className}`.trim()}
      aria-busy={chat.loading}
      aria-disabled={chat.loading}
      aria-haspopup="dialog"
      aria-expanded={chat.open}
      onClick={(event) => chat.start(event.currentTarget)}
    >
      {chat.loading ? "Connecting…" : children}
      <span aria-hidden="true">↗</span>
    </button>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 10h8M7 14h5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
