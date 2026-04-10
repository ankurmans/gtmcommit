'use client';

import { useState, useRef, useEffect } from 'react';
import { LuFileText, LuCopy, LuCheck, LuLinkedin, LuMail, LuMessageSquare } from 'react-icons/lu';
import { FaXTwitter } from 'react-icons/fa6';
import { analytics } from '@/lib/analytics';

interface CopySummaryProps {
  username: string;
}

const FORMAT_OPTIONS = [
  { key: 'full', label: 'Full Summary', icon: LuFileText, description: 'For job apps & bios' },
  { key: 'linkedin', label: 'LinkedIn Bio', icon: LuLinkedin, description: 'One-line credential' },
  { key: 'twitter', label: 'Tweet', icon: FaXTwitter, description: 'Share on X' },
  { key: 'signature', label: 'Email Signature', icon: LuMail, description: 'Name | Score | URL' },
] as const;

export default function CopySummary({ username }: CopySummaryProps) {
  const [open, setOpen] = useState(false);
  const [summaries, setSummaries] = useState<Record<string, string> | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const fetchSummaries = async () => {
    if (summaries) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/profiles/${username}/summary`);
      if (res.ok) {
        const data = await res.json();
        setSummaries(data.formats);
      }
    } catch {
      // Silently fail — button just won't work
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(!open);
    if (!open) fetchSummaries();
  };

  const handleCopy = async (format: string) => {
    if (!summaries?.[format]) return;
    await navigator.clipboard.writeText(summaries[format]);
    setCopiedFormat(format);
    analytics.track('summary_copied', { username, format });
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-secondary border border-surface-border text-xs font-medium text-fg-secondary hover:border-brand/30 hover:text-brand transition-colors"
      >
        <LuFileText size={12} /> Summary
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-surface-border rounded-xl shadow-lg p-3 min-w-[280px]">
          <p className="text-xs font-semibold text-fg-primary mb-2">Copy your credential</p>
          {loading ? (
            <div className="py-4 text-center text-xs text-fg-muted">Loading...</div>
          ) : summaries ? (
            <div className="space-y-1">
              {FORMAT_OPTIONS.map(({ key, label, icon: Icon, description }) => (
                <button
                  key={key}
                  onClick={() => handleCopy(key)}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left hover:bg-surface-secondary transition-colors group"
                >
                  <Icon size={14} className="text-fg-muted group-hover:text-brand shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-fg-primary">{label}</div>
                    <div className="text-[10px] text-fg-muted truncate">{description}</div>
                  </div>
                  {copiedFormat === key ? (
                    <LuCheck size={14} className="text-green-600 shrink-0" />
                  ) : (
                    <LuCopy size={14} className="text-fg-faint group-hover:text-fg-muted shrink-0" />
                  )}
                </button>
              ))}
              {summaries.full && (
                <div className="mt-2 pt-2 border-t border-surface-border">
                  <p className="text-[10px] text-fg-muted leading-relaxed px-1">{summaries.full}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-fg-muted">Failed to load</div>
          )}
        </div>
      )}
    </div>
  );
}
