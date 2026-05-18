'use client';

import { useEffect, useRef, useState } from 'react';
import { analytics } from '@/lib/analytics';

type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

type SyncJob = {
  id: string;
  status: JobStatus;
  repos_scanned: number;
  commits_analyzed: number;
  ai_commits_found: number;
  error_message: string | null;
};

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

export default function SyncButton() {
  const [job, setJob] = useState<SyncJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollStartedAt = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, []);

  const isActive = job?.status === 'pending' || job?.status === 'running';

  const pollOnce = async (jobId: string) => {
    try {
      const res = await fetch(`/api/github/sync/status?jobId=${jobId}`);
      if (!res.ok) throw new Error('status fetch failed');
      const data = await res.json();
      const latest: SyncJob | null = data.job;
      if (!latest) return;
      setJob(latest);

      if (latest.status === 'completed') {
        analytics.githubSyncCompleted(latest.repos_scanned, latest.ai_commits_found);
        return;
      }
      if (latest.status === 'failed') {
        analytics.githubSyncFailed(latest.error_message || 'unknown');
        return;
      }

      if (Date.now() - pollStartedAt.current > POLL_TIMEOUT_MS) {
        setError('Sync is taking longer than expected. Check back later.');
        return;
      }

      pollTimer.current = setTimeout(() => pollOnce(jobId), POLL_INTERVAL_MS);
    } catch {
      pollTimer.current = setTimeout(() => pollOnce(jobId), POLL_INTERVAL_MS);
    }
  };

  const handleSync = async () => {
    setError(null);
    setJob({ id: '', status: 'pending', repos_scanned: 0, commits_analyzed: 0, ai_commits_found: 0, error_message: null });
    analytics.githubSyncStarted();
    try {
      const res = await fetch('/api/github/sync', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        analytics.githubSyncFailed(data.error || 'unknown');
        setJob(null);
        setError(data.error || 'Sync failed');
        return;
      }

      const jobId: string | undefined = data.jobId;
      if (!jobId) {
        setJob(null);
        setError('Sync did not start');
        return;
      }

      pollStartedAt.current = Date.now();
      pollOnce(jobId);
    } catch {
      analytics.githubSyncFailed('network_error');
      setJob(null);
      setError('Sync failed. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={handleSync} disabled={isActive} className="btn-brand btn-sm">
        {isActive ? (
          <>
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Syncing...
          </>
        ) : (
          'Sync Now'
        )}
      </button>

      {isActive && job && (
        <p className="text-sm mt-2 text-fg-secondary">
          {job.repos_scanned} {job.repos_scanned === 1 ? 'repo' : 'repos'} scanned ·{' '}
          {job.commits_analyzed} commits · {job.ai_commits_found} AI
        </p>
      )}

      {job?.status === 'completed' && (
        <p className="text-sm mt-2 text-fg-secondary">
          Sync complete: {job.repos_scanned} repos, {job.ai_commits_found} AI commits.{' '}
          <button onClick={() => window.location.reload()} className="underline">Refresh</button>
        </p>
      )}

      {job?.status === 'failed' && (
        <p className="text-sm mt-2 text-red-600">Sync failed: {job.error_message || 'unknown error'}</p>
      )}

      {error && <p className="text-sm mt-2 text-red-600">{error}</p>}
    </div>
  );
}
