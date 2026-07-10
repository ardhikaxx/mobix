"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useChat, sendMessage, toggleLike, editMessage, deleteMessage, type ChatMessage } from "@/lib/hooks/useChat";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { usePublishedApps } from "@/lib/hooks/useApps";
import {
  Loader2, Send, ThumbsUp, MessageSquare, Reply,
  MessageCircle, BadgeCheck, Search, X,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LinkPreview } from "@/components/LinkPreview";
import { markChatSeen } from "@/lib/hooks/useUnreadChat";
import toast from "react-hot-toast";
import { filterBadWords } from "@/lib/utils/badWords";

export default function ChatClient() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const { messages, loading } = useChat();
  const { data: publishedApps } = usePublishedApps();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; userName: string; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const devUserIds = new Set(publishedApps?.map((a) => a.ownerId) ?? []);

  const chatUsers = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of messages) {
      if (!map.has(m.userId) && m.userId !== user?.uid) {
        map.set(m.userId, m.userName);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [messages, user?.uid]);

  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStart, setMentionStart] = useState(-1);
  const [mentionIndex, setMentionIndex] = useState(0);

  const extractUrl = (text: string): string | null => {
    const m = text.match(/https?:\/\/[^\s]+/);
    return m ? m[0] : null;
  };

  useEffect(() => {
    markChatSeen();
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [messages]);

  const extractMentions = (t: string): Record<string, string> => {
    const result: Record<string, string> = {};
    const ats = t.match(/@(\w+)/g);
    if (!ats) return result;
    for (const at of ats) {
      const name = at.slice(1);
      const found = chatUsers.find((u) => u.name.toLowerCase() === name.toLowerCase());
      if (found) {
        result[found.id] = found.name;
      }
    }
    return result;
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !user) return;

    const check = filterBadWords(trimmed);
    if (check.hasBadWords) {
      toast.error("Pesan mengandung kata tidak pantas!");
      return;
    }

    setSending(true);
    try {
      const mentions = extractMentions(trimmed);
      await sendMessage(
        user.uid,
        user.displayName || user.email || "User",
        user.photoURL,
        trimmed,
        replyTo,
        mentions
      );
      setText("");
      setReplyTo(null);
      inputRef.current?.focus();
    } catch {
      toast.error("Gagal mengirim pesan");
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);

    const pos = e.target.selectionStart ?? val.length;
    const before = val.slice(0, pos);
    const atIdx = before.lastIndexOf("@");

    if (atIdx !== -1 && (atIdx === 0 || before[atIdx - 1] === " ")) {
      const after = val.slice(atIdx + 1, pos);
      if (!after.includes(" ") && after.length <= 30) {
        setMentionQuery(after);
        setMentionStart(atIdx);
        setMentionIndex(0);
        return;
      }
    }
    setMentionQuery("");
    setMentionStart(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (mentionStart !== -1) {
      const filtered = chatUsers.filter((u) =>
        u.name.toLowerCase().includes(mentionQuery.toLowerCase()) && u.id !== user?.uid
      );
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex((i) => Math.min(i + 1, filtered.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        if (filtered.length > 0) {
          insertMention(filtered[mentionIndex]);
        }
        return;
      }
      if (e.key === "Escape") {
        setMentionQuery("");
        setMentionStart(-1);
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertMention = (u: { id: string; name: string }) => {
    const before = text.slice(0, mentionStart);
    const after = text.slice(mentionStart + mentionQuery.length + 1);
    const newText = `${before}@${u.name} ${after}`;
    setText(newText);
    setMentionQuery("");
    setMentionStart(-1);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleEdit = async (msgId: string) => {
    const trimmed = editText.trim();
    if (!trimmed) return;

    const check = filterBadWords(trimmed);
    if (check.hasBadWords) {
      toast.error("Pesan mengandung kata tidak pantas!");
      return;
    }

    try {
      await editMessage(msgId, trimmed);
      setEditingId(null);
      setEditText("");
      toast.success("Pesan diedit");
    } catch {
      toast.error("Gagal mengedit pesan");
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, msgId: string) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEdit(msgId);
    }
    if (e.key === "Escape") {
      setEditingId(null);
      setEditText("");
    }
  };

  const startEdit = (msg: ChatMessage) => {
    setEditingId(msg.id);
    setEditText(msg.text);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  if (authLoading) return null;

  const sortedMessages = [...messages].sort((a, b) => {
    const ta = a.createdAt?.seconds ?? 0;
    const tb = b.createdAt?.seconds ?? 0;
    return ta - tb;
  });

  const q = searchQuery.toLowerCase().trim();
  const filteredMessages = q
    ? sortedMessages.filter(
        (m) =>
          m.text.toLowerCase().includes(q) ||
          m.userName.toLowerCase().includes(q)
      )
    : sortedMessages;

  const renderText = (t: string) => {
    const parts = t.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith("@") && chatUsers.some((u) => u.name.toLowerCase() === part.slice(1).toLowerCase())) {
        return (
          <span key={i} className="font-semibold text-store">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="rounded bg-yellow-200 px-0.5 dark:bg-yellow-700">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col px-4 py-6" style={{ height: "calc(100vh - 64px)" }}>
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Komunitas" }]} />

      <div className="mb-3 flex items-center gap-2">
        <MessageCircle className="size-5 text-store" />
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Komunitas Developer</h1>
        {isSearchOpen ? (
          <span className="text-xs text-gray-400">
            {filteredMessages.length} dari {messages.length} pesan
          </span>
        ) : (
          <span className="text-xs text-gray-400">{messages.length} pesan</span>
        )}
        <button
          onClick={() => { setIsSearchOpen(!isSearchOpen); setSearchQuery(""); }}
          className="ml-auto text-gray-400 hover:text-store transition"
        >
          {isSearchOpen ? <X className="size-4" /> : <Search className="size-4" />}
        </button>
      </div>

      {isSearchOpen && (
        <div className="mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pesan atau pengguna..."
            autoFocus
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-store focus:ring-2 focus:ring-store/20 placeholder-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      )}

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-2 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-gray-300" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search className="mb-3 size-10 text-gray-200 dark:text-gray-700" />
            <p className="text-sm">Tidak ditemukan untuk &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isDev = devUserIds.has(msg.userId);
            const isOwner = user?.uid === msg.userId;
            const hasLiked = user ? !!msg.likes?.[user.uid] : false;

            return (
              <div
                key={msg.id}
                className="group rounded-xl px-3 py-2.5 transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div className="flex items-start gap-2.5">
                  {msg.userPhoto ? (
                    <img
                      src={msg.userPhoto}
                      alt=""
                      className="size-8 shrink-0 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      {msg.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {msg.userName}
                      </span>
                      {isDev && (
                        <BadgeCheck className="size-3.5 text-blue-500" aria-label="Developer" />
                      )}
                      <span className="text-[10px] text-gray-400">
                        {msg.createdAt?.seconds
                          ? new Date(msg.createdAt.seconds * 1000).toLocaleString("id-ID", {
                              day: "numeric", month: "short",
                              hour: "2-digit", minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>

                    {msg.replyTo && (
                      <div className="mb-1 flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                        <Reply className="size-3" />
                        <span className="truncate max-w-[200px]">
                          {msg.replyTo.userName}: {searchQuery ? highlightMatch(msg.replyTo.text, searchQuery) : renderText(msg.replyTo.text)}
                        </span>
                      </div>
                    )}

                    {editingId === msg.id ? (
                      <div className="flex gap-2">
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => handleEditKeyDown(e, msg.id)}
                          className="flex-1 rounded-lg border border-store bg-white px-3 py-1 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-store/20 dark:bg-gray-800 dark:text-gray-100"
                        />
                        <button
                          onClick={() => handleEdit(msg.id)}
                          disabled={!editText.trim()}
                          className="text-xs text-store hover:underline disabled:opacity-50"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditText(""); }}
                          className="text-xs text-gray-400 hover:text-gray-600"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <p className={`text-sm text-gray-700 dark:text-gray-300 ${msg.deleted ? "italic text-gray-400" : ""}`}>
                        {searchQuery ? highlightMatch(msg.text, searchQuery) : renderText(msg.text)}
                      </p>
                    )}

                    {msg.editedAt && !msg.deleted && (
                      <span className="mt-0.5 block text-[10px] text-gray-400">
                        diedit {new Date(msg.editedAt.seconds * 1000).toLocaleString("id-ID", {
                          day: "numeric", month: "short",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    )}

                    {!msg.deleted && extractUrl(msg.text) && (
                      <LinkPreview url={extractUrl(msg.text)!} />
                    )}

                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (!user) { toast.error("Login dulu"); return; }
                          toggleLike(msg.id, user.uid, hasLiked);
                        }}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] transition ${
                          hasLiked
                            ? "bg-store/10 text-store"
                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        }`}
                      >
                        <ThumbsUp className="size-3" />
                        {msg.likeCount > 0 && <span>{msg.likeCount}</span>}
                      </button>

                      {user && !msg.deleted && (
                        <button
                          onClick={() => setReplyTo({
                            id: msg.id,
                            userName: msg.userName,
                            text: msg.text.slice(0, 80),
                          })}
                          className="text-[11px] text-gray-400 hover:text-store transition"
                        >
                          Balas
                        </button>
                      )}

                      {isOwner && !msg.deleted && (
                        <>
                          <button
                            onClick={() => startEdit(msg)}
                            className="text-[11px] text-gray-400 hover:text-store transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(msg.id)}
                            className="text-[11px] text-gray-400 hover:text-red-500 transition"
                          >
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply indicator */}
      {replyTo && (
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-store/20 bg-store/5 px-4 py-2 text-xs text-gray-600 dark:text-gray-400">
          <Reply className="size-3 text-store" />
          <span className="flex-1 truncate">
            Membalas <strong>{replyTo.userName}</strong>: {replyTo.text}
          </span>
          <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      {user ? (
        <div className="relative mt-3">
          {mentionStart !== -1 && mentionQuery.length >= 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-1 max-h-40 overflow-y-auto rounded-xl border border-gray-100 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              {chatUsers
                .filter((u) => u.name.toLowerCase().includes(mentionQuery.toLowerCase()) && u.id !== user?.uid)
                .slice(0, 8)
                .map((u, i) => (
                  <button
                    key={u.id}
                    onClick={() => insertMention(u)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                      i === mentionIndex
                        ? "bg-store/10 text-store"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex size-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span>@{u.name}</span>
                  </button>
                ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan... (@ untuk mention)"
              disabled={sending}
              className="min-h-[44px] flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-store focus:ring-2 focus:ring-store/20 placeholder-gray-400 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-store text-white transition hover:bg-store-light disabled:opacity-50"
            >
              {sending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/30">
          <a href="/login" className="font-semibold text-store hover:underline">Login</a> untuk ikut ngobrol
        </div>
      )}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Hapus Pesan"
        message="Pesan akan dihapus dan tidak bisa dikembalikan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={() => {
          if (deleteTarget) {
            deleteMessage(deleteTarget);
            toast.success("Pesan dihapus");
          }
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
