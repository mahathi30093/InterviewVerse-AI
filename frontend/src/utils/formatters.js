export function formatScore(score) {
  if (score === null || score === undefined) return '0.0';
  const num = Number(score);
  return isNaN(num) ? '0.0' : num.toFixed(1);
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
}

export function getReadinessBadge(score) {
  const s = Number(score) || 0;
  if (s >= 80) return { label: 'JOB READY', className: 'badge-job-ready' };
  if (s >= 60) return { label: 'INTERVIEW READY', className: 'badge-interview-ready' };
  if (s >= 40) return { label: 'BEGINNER READY', className: 'badge-beginner-ready' };
  return { label: 'NOT READY', className: 'badge-not-ready' };
}
