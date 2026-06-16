"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cloud,
  Cpu,
  KeyRound,
  List,
  LoaderCircle,
  MessageSquare,
  Plus,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ChatRole = "user" | "assistant";

type ProviderId = "local" | "openai" | "claude" | "gemini";

type ChatMessage = {
  role: ChatRole;
  content: string;
  provider?: ProviderId;
};

type BridgeState = {
  connected: boolean;
  ollama: boolean;
  models: string[];
  projects: string[];
  error?: string;
};

type Provider = {
  id: ProviderId;
  label: string;
  description: string;
  models: string[];
  status: "connected" | "setup" | "offline";
};

type CloudProvider = Omit<Provider, "id" | "status"> & {
  id: Exclude<ProviderId, "local">;
};

type Conversation = {
  id: string;
  title: string;
  provider: ProviderId;
  model: string;
  project: string;
  messages: ChatMessage[];
  updatedAt: number;
};

type ProviderKeyState = Partial<Record<Exclude<ProviderId, "local">, string>>;

const bridgeUrl = "http://127.0.0.1:43120";
const storageKey = "locality.chat.history.v1";
const keyStorageKey = "locality.chat.providerKeys.v1";

const cloudProviders: Record<Exclude<ProviderId, "local">, CloudProvider> = {
  openai: {
    id: "openai",
    label: "ChatGPT",
    description: "Use OpenAI chat models with your API key.",
    models: ["ChatGPT primary", "ChatGPT fast", "ChatGPT reasoning"],
  },
  gemini: {
    id: "gemini",
    label: "Gemini",
    description: "Use Google Gemini models with your API key.",
    models: ["Gemini primary", "Gemini fast"],
  },
  claude: {
    id: "claude",
    label: "Claude",
    description: "Use Anthropic Claude models with your API key.",
    models: ["Claude primary", "Claude fast", "Claude compact"],
  },
};

function createConversation(provider: ProviderId, model: string, project = "All projects"): Conversation {
  return {
    id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: "New memory chat",
    provider,
    model,
    project,
    messages: [],
    updatedAt: Date.now(),
  };
}

function loadConversations() {
  if (typeof window === "undefined") return [createConversation("local", "Local model")];

  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return [createConversation("local", "Local model")];

  try {
    const parsed = JSON.parse(saved) as Conversation[];
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    window.localStorage.removeItem(storageKey);
  }

  return [createConversation("local", "Local model")];
}

function loadProviderKeys(): ProviderKeyState {
  if (typeof window === "undefined") return {};

  const saved = window.localStorage.getItem(keyStorageKey);
  if (!saved) return {};

  try {
    return JSON.parse(saved) as ProviderKeyState;
  } catch {
    window.localStorage.removeItem(keyStorageKey);
    return {};
  }
}

function titleFromPrompt(prompt: string) {
  const trimmed = prompt.replace(/\s+/g, " ").trim();
  if (!trimmed) return "New memory chat";
  return trimmed.length > 42 ? `${trimmed.slice(0, 42)}...` : trimmed;
}

function isCloudProvider(provider: ProviderId): provider is Exclude<ProviderId, "local"> {
  return provider !== "local";
}

export function LocalAiChat() {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const initialConversation = conversations[0];
  const [providerKeys, setProviderKeys] = useState<ProviderKeyState>(loadProviderKeys);
  const [bridge, setBridge] = useState<BridgeState>({
    connected: false,
    ollama: false,
    models: [],
    projects: [],
  });
  const [provider, setProvider] = useState<ProviderId>(initialConversation.provider);
  const [model, setModel] = useState(initialConversation.model);
  const [project, setProject] = useState(initialConversation.project);
  const [question, setQuestion] = useState("");
  const [activeId, setActiveId] = useState(initialConversation.id);
  const [loading, setLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [keyModalProvider, setKeyModalProvider] = useState<Exclude<ProviderId, "local"> | null>(null);
  const [keyDraft, setKeyDraft] = useState("");
  const [bridgeCommandOpen, setBridgeCommandOpen] = useState(false);

  const providers: Provider[] = useMemo(() => {
    const localModels = bridge.models.length ? bridge.models : ["Local model"];

    return [
      {
        id: "local",
        label: "Local AI",
        description: "Private loopback bridge to Ollama and your imported memory.",
        models: localModels,
        status: bridge.connected && bridge.ollama ? "connected" : "offline",
      },
      ...Object.values(cloudProviders).map((item) => ({
        ...item,
        status: providerKeys[item.id] ? "connected" as const : "setup" as const,
      })),
    ];
  }, [bridge.connected, bridge.models, bridge.ollama, providerKeys]);

  const selectedProvider = providers.find((item) => item.id === provider) ?? providers[0];
  const activeConversation = conversations.find((chat) => chat.id === activeId);
  const messages = activeConversation?.messages ?? [];
  const selectedCloudKey = isCloudProvider(provider) ? providerKeys[provider] : undefined;
  const canUseProvider = provider === "local" ? bridge.connected && bridge.ollama : Boolean(selectedCloudKey);
  const canSend = Boolean(canUseProvider && model && question.trim() && !loading);

  const connectionText = useMemo(() => {
    if (provider === "local") {
      if (bridge.connected && bridge.ollama) return "Connected";
      if (bridge.connected) return "Ollama offline";
      return "Connect";
    }

    return selectedCloudKey ? "Connected" : "Add key";
  }, [bridge.connected, bridge.ollama, provider, selectedCloudKey]);

  const disabledReason = useMemo(() => {
    if (provider !== "local" && !selectedCloudKey) return `Add a ${selectedProvider.label} key before chatting.`;
    if (provider === "local" && !bridge.connected) return "Start the Locality bridge to chat with local memory.";
    if (provider === "local" && !bridge.ollama) return "Start Ollama and install a model before chatting.";
    if (!model) return "Select a model before chatting.";
    return "Ready to chat.";
  }, [bridge.connected, bridge.ollama, model, provider, selectedCloudKey, selectedProvider.label]);

  const connect = useCallback(async () => {
    if (isCloudProvider(provider)) {
      setKeyDraft(providerKeys[provider] || "");
      setKeyModalProvider(provider);
      return;
    }

    setBridge((current) => ({ ...current, error: undefined }));
    try {
      const response = await fetch(`${bridgeUrl}/status`, { cache: "no-store" });
      if (!response.ok) throw new Error("The Locality bridge did not respond.");
      const data = await response.json();
      const next = {
        connected: true,
        ollama: Boolean(data.ollama),
        models: Array.isArray(data.models) ? data.models : [],
        projects: Array.isArray(data.projects) ? data.projects : [],
        error: data.error ? String(data.error) : undefined,
      };
      setBridge(next);
      setModel((current) => (next.models.includes(current) ? current : next.models[0] || "Local model"));
    } catch {
      setBridge({
        connected: false,
        ollama: false,
        models: [],
        projects: [],
        error: "Start the local bridge, then reconnect.",
      });
    }
  }, [provider, providerKeys]);

  const handleConnectionClick = useCallback(() => {
    if (provider === "local" && !canUseProvider) {
      setBridgeCommandOpen(true);
      return;
    }

    void connect();
  }, [canUseProvider, connect, provider]);

  useEffect(() => {
    if (provider !== "local") return;

    const timer = window.setTimeout(() => {
      void connect();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [connect, provider]);

  useEffect(() => {
    if (conversations.length) {
      window.localStorage.setItem(storageKey, JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    window.localStorage.setItem(keyStorageKey, JSON.stringify(providerKeys));
  }, [providerKeys]);

  function updateActiveConversation(update: Partial<Conversation>) {
    setConversations((current) =>
      current.map((chat) =>
        chat.id === activeId
          ? { ...chat, ...update, updatedAt: Date.now() }
          : chat,
      ),
    );
  }

  function selectProvider(nextProvider: ProviderId) {
    const next = providers.find((item) => item.id === nextProvider) ?? providers[0];
    setProvider(nextProvider);
    setModel(next.models[0] || "");
    updateActiveConversation({
      provider: nextProvider,
      model: next.models[0] || "",
    });

    if (isCloudProvider(nextProvider) && !providerKeys[nextProvider]) {
      setKeyDraft("");
      setKeyModalProvider(nextProvider);
    }
  }

  function selectConversation(chat: Conversation) {
    setActiveId(chat.id);
    setProvider(chat.provider);
    setModel(chat.model);
    setProject(chat.project);
    setHistoryOpen(false);
  }

  function newConversation() {
    const next = createConversation(provider, selectedProvider.models[0] || model, project);
    setConversations((current) => [next, ...current]);
    setActiveId(next.id);
    setModel(next.model);
    setHistoryOpen(false);
  }

  function saveProviderKey(event: FormEvent) {
    event.preventDefault();
    if (!keyModalProvider) return;

    const value = keyDraft.trim();
    if (!value) return;

    setProviderKeys((current) => ({ ...current, [keyModalProvider]: value }));
    setKeyModalProvider(null);
    setKeyDraft("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!canSend || !activeConversation) {
      if (isCloudProvider(provider) && !providerKeys[provider]) {
        setKeyDraft("");
        setKeyModalProvider(provider);
      }
      return;
    }

    const prompt = question.trim();
    const nextMessages = [
      ...messages,
      { role: "user" as const, content: prompt, provider },
    ];

    setConversations((current) =>
      current.map((chat) =>
        chat.id === activeConversation.id
          ? {
              ...chat,
              title: chat.messages.length ? chat.title : titleFromPrompt(prompt),
              provider,
              model,
              project,
              messages: nextMessages,
              updatedAt: Date.now(),
            }
          : chat,
      ),
    );
    setQuestion("");
    setLoading(true);

    if (provider !== "local") {
      const assistantMessage = {
        role: "assistant" as const,
        content: `${selectedProvider.label} is connected in this UI. Server-side ${selectedProvider.label} chat routing is not enabled yet.`,
        provider,
      };
      setConversations((current) =>
        current.map((chat) =>
          chat.id === activeConversation.id
            ? {
                ...chat,
                messages: [...nextMessages, assistantMessage],
                updatedAt: Date.now(),
              }
            : chat,
        ),
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${bridgeUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          project: project === "All projects" ? "" : project,
          messages: nextMessages,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Local AI request failed.");
      const assistantMessage = {
        role: "assistant" as const,
        content: String(data.message || "No response returned."),
        provider,
      };
      setConversations((current) =>
        current.map((chat) =>
          chat.id === activeConversation.id
            ? {
                ...chat,
                messages: [...nextMessages, assistantMessage],
                updatedAt: Date.now(),
              }
            : chat,
        ),
      );
    } catch (error) {
      const assistantMessage = {
        role: "assistant" as const,
        content: error instanceof Error ? error.message : "Local AI request failed.",
        provider,
      };
      setConversations((current) =>
        current.map((chat) =>
          chat.id === activeConversation.id
            ? {
                ...chat,
                messages: [...nextMessages, assistantMessage],
                updatedAt: Date.now(),
              }
            : chat,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid w-full gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="relative flex h-[min(760px,calc(100dvh-8rem))] min-h-[620px] flex-col overflow-hidden rounded-[1.75rem] border bg-card shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="border-b bg-[linear-gradient(180deg,color-mix(in_oklch,var(--background),var(--muted)_44%),var(--background))] p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">AI chat</p>
              <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">
                Ask project memory.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Search saved sessions, switch models, and keep each chat thread available from one place.
              </p>
            </div>

            <div className="relative flex flex-wrap items-center gap-2">
              <DropdownMenu open={historyOpen} onOpenChange={setHistoryOpen}>
                <DropdownMenuTrigger
                  render={
                    <button
                      className="inline-flex h-10 min-w-0 items-center gap-2 rounded-full border bg-background px-3 text-sm font-medium shadow-sm transition hover:bg-muted"
                      type="button"
                    >
                      <MessageSquare className="size-4" />
                      <span className="max-w-[220px] truncate">{activeConversation?.title || "New memory chat"}</span>
                      <ChevronDown className="size-4" />
                    </button>
                  }
                />
                <DropdownMenuContent align="end" sideOffset={8} className="w-[min(380px,calc(100vw-3rem))]">
                  <DropdownMenuGroup>
                    {conversations.map((chat) => (
                      <DropdownMenuItem
                        className={`items-start gap-3 px-3 py-3 ${
                          chat.id === activeId ? "bg-muted text-foreground" : ""
                        }`}
                        key={chat.id}
                        onClick={() => selectConversation(chat)}
                      >
                        <MessageSquare className="mt-0.5 size-4 shrink-0" />
                        <span className="min-w-0">
                          <strong className="block truncate text-sm font-medium">{chat.title}</strong>
                          <small className="mt-1 block truncate text-xs text-muted-foreground">
                            {chat.messages.length} messages - {chat.model}
                          </small>
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                className="inline-flex size-10 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
                type="button"
                onClick={newConversation}
                aria-label="New chat"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="min-h-0 flex-1 overscroll-contain overflow-y-auto rounded-[1.25rem] border bg-muted/20 p-4">
            {messages.length === 0 ? (
              <div className="grid min-h-[310px] place-items-center rounded-2xl border border-dashed bg-background/70 p-6 text-center">
                <div className="max-w-md">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <MessageSquare className="size-5" />
                  </div>
                  <h2 className="mt-5 text-xl font-medium tracking-tight">Start with a project question</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Ask about sessions, decisions, commands, files, and why a previous implementation changed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((message, index) => (
                  <div
                    className={`max-w-[78%] rounded-2xl border px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "ml-auto border-primary bg-primary text-primary-foreground"
                        : "mr-auto bg-background text-foreground"
                    }`}
                    key={`${message.role}-${index}`}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] opacity-70">
                      {message.role === "user" ? "You" : selectedProvider.label}
                    </span>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Thinking...
              </div>
            )}
          </div>

          <form className="relative mt-3 rounded-[1.35rem] border bg-background px-5 pb-5 pt-9 shadow-[0_18px_55px_rgba(15,23,42,0.08)]" onSubmit={submit}>
            <button
              className={`absolute left-1/2 top-0 inline-flex h-10 -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(2,132,199,0.24)] transition hover:-translate-y-[calc(50%+1px)] ${
                canUseProvider ? "bg-[linear-gradient(to_bottom,#20b8f5,#079bdc)]" : "bg-[linear-gradient(to_bottom,#22282f,#11161c)]"
              }`}
              type="button"
              onClick={handleConnectionClick}
            >
              <CheckCircle2 className="size-4" />
              {connectionText}
            </button>

            <textarea
              className="min-h-16 w-full resize-none border-0 bg-transparent pt-3 text-[15px] leading-6 text-foreground outline-none placeholder:text-muted-foreground"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Why did we choose database sessions?"
              rows={2}
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                type="button"
                aria-label="Add context"
              >
                <Plus className="size-4" />
              </button>

              <Select value={provider} onValueChange={(value) => selectProvider(value as ProviderId)}>
                <SelectTrigger className="h-9 rounded-full bg-muted/30 px-3">
                  {selectedProvider.id === "local" ? <Cpu className="size-4" /> : <Cloud className="size-4" />}
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" sideOffset={8}>
                  <SelectGroup>
                    {providers.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={model}
                onValueChange={(value) => {
                  if (!value) return;
                  setModel(value);
                  updateActiveConversation({ model: value });
                }}
              >
                <SelectTrigger className="h-9 max-w-[220px] rounded-full bg-muted/30 px-3">
                  <List className="size-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" sideOffset={8}>
                  <SelectGroup>
                    {selectedProvider.models.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {provider === "local" && (
                <Select
                  value={project}
                  onValueChange={(value) => {
                    if (!value) return;
                    setProject(value);
                    updateActiveConversation({ project: value });
                  }}
                >
                  <SelectTrigger className="h-9 max-w-[220px] rounded-full bg-muted/30 px-3">
                    <span>{bridge.projects.length || 3} sources</span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" sideOffset={8}>
                    <SelectGroup>
                      <SelectItem value="All projects">All projects</SelectItem>
                      {bridge.projects.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}

              <button
                className="ml-auto inline-flex size-10 items-center justify-center rounded-full bg-[#08a9ee] text-white shadow-[0_10px_24px_rgba(8,169,238,0.24)] transition hover:bg-[#079bdc] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                type="submit"
                disabled={!canSend}
                aria-label="Send message"
              >
                <ChevronUp className="size-5" />
              </button>
            </div>
          </form>

          <p className="px-1 text-sm text-muted-foreground">
            {bridge.error && provider === "local" ? bridge.error : disabledReason}
          </p>
        </div>
      </section>

      <aside className="grid gap-5">
        <section className="overflow-hidden rounded-[1.75rem] border bg-[#07090c] p-2 text-white shadow-[0_30px_80px_rgba(2,6,23,0.18)]">
          <div className="rounded-[1.35rem] border border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(20,184,166,0.22),transparent_34%),radial-gradient(circle_at_88%_16%,rgba(59,130,246,0.24),transparent_36%),linear-gradient(135deg,#10151d,#050607_68%)] p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium">
                {selectedProvider.label}
              </span>
              <span className={`size-2.5 rounded-full ${canUseProvider ? "bg-emerald-400" : "bg-amber-300"}`} />
            </div>
            <h2 className="mt-12 text-3xl font-medium leading-none tracking-tight">
              {canUseProvider ? "Ready to answer." : "Connection needed."}
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/60">{disabledReason}</p>
          </div>
        </section>

        <section className="rounded-[1.5rem] border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-medium">Model</h2>
              <p className="mt-1 text-sm text-muted-foreground">{model}</p>
            </div>
            <Cpu className="size-5 text-muted-foreground" />
          </div>
          <div className="mt-5 grid gap-3">
            {providers.map((item) => (
              <button
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  item.id === provider ? "border-primary/20 bg-primary/5" : "bg-muted/20 hover:bg-muted/45"
                }`}
                key={item.id}
                type="button"
                onClick={() => selectProvider(item.id)}
              >
                <span>
                  <strong className="block font-medium">{item.label}</strong>
                  <small className="mt-1 block text-muted-foreground">
                    {item.status === "connected" ? "Connected" : item.status === "setup" ? "Key needed" : "Offline"}
                  </small>
                </span>
                {item.id === provider ? <CheckCircle2 className="size-4 text-primary" /> : null}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border bg-card p-5">
          <h2 className="text-base font-medium">Saved chats</h2>
          <p className="mt-1 text-sm text-muted-foreground">{conversations.length} saved locally in this browser.</p>
          <button
            className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border bg-secondary text-sm font-medium transition hover:bg-muted"
            type="button"
            onClick={() => setHistoryOpen(true)}
          >
            Open dropdown
            <ChevronDown className="size-4" />
          </button>
        </section>
      </aside>

      {bridgeCommandOpen && (
        <div className="fixed inset-0 z-80 grid place-items-center bg-black/35 p-5 backdrop-blur-sm" role="presentation">
          <div className="relative grid w-[min(460px,100%)] gap-4 rounded-[1.5rem] border bg-popover p-6 text-popover-foreground shadow-[0_28px_80px_rgba(15,23,42,0.24)]">
            <button
              className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:text-foreground"
              type="button"
              onClick={() => setBridgeCommandOpen(false)}
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Cpu className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-medium tracking-tight">Start Locality bridge</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Run this command in your terminal, then refresh the connection.
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/35 p-3">
              <code className="min-w-0 truncate font-mono text-sm text-foreground">locality web</code>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                className="inline-flex h-10 items-center justify-center rounded-full border bg-background px-4 text-sm font-medium transition hover:bg-muted"
                type="button"
                onClick={() => setBridgeCommandOpen(false)}
              >
                Close
              </button>
              <button
                className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/85"
                type="button"
                onClick={() => {
                  setBridgeCommandOpen(false);
                  void connect();
                }}
              >
                Refresh status
              </button>
            </div>
          </div>
        </div>
      )}

      {keyModalProvider && (
        <div className="fixed inset-0 z-80 grid place-items-center bg-black/35 p-5 backdrop-blur-sm" role="presentation">
          <form className="relative grid w-[min(430px,100%)] gap-4 rounded-[1.5rem] border bg-popover p-6 text-popover-foreground shadow-[0_28px_80px_rgba(15,23,42,0.24)]" onSubmit={saveProviderKey}>
            <button className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:text-foreground" type="button" onClick={() => setKeyModalProvider(null)} aria-label="Close">
              <X className="size-4" />
            </button>
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <KeyRound className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-medium tracking-tight">Add {cloudProviders[keyModalProvider].label} key</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {cloudProviders[keyModalProvider].description} The key is saved in this browser for now.
              </p>
            </div>
            <input
              autoFocus
              className="h-11 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-4 focus:ring-primary/10"
              value={keyDraft}
              onChange={(event) => setKeyDraft(event.target.value)}
              placeholder={`${cloudProviders[keyModalProvider].label} API key`}
              type="password"
            />
            <button className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-45" type="submit" disabled={!keyDraft.trim()}>
              Save key
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
