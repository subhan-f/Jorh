export function buildWhatsAppLink(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const base = `https://wa.me/${cleaned}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function buildTelegramLink(username: string, message?: string): string {
  const base = `https://t.me/${username.replace(/^@/, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function buildTweetIntent(text: string, url?: string, via?: string): string {
  const params = new URLSearchParams({ text });
  if (url) params.set("url", url);
  if (via) params.set("via", via);
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function buildLinkedInShare(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

export function buildFacebookShare(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function buildMailtoLink(opts: {
  to?: string;
  subject?: string;
  body?: string;
  cc?: string;
}): string {
  const params = new URLSearchParams();
  if (opts.subject) params.set("subject", opts.subject);
  if (opts.body) params.set("body", opts.body);
  if (opts.cc) params.set("cc", opts.cc);
  const query = params.toString();
  return `mailto:${opts.to ?? ""}${query ? `?${query}` : ""}`;
}

export function buildSmsLink(phone: string, body?: string): string {
  const base = `sms:${phone}`;
  return body ? `${base}?body=${encodeURIComponent(body)}` : base;
}

export function buildYouTubeTimestamp(videoId: string, seconds: number): string {
  return `https://youtu.be/${videoId}?t=${seconds}`;
}

export function buildGoogleMapsLink(query: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
}
