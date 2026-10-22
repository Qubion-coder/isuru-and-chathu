// Couple names used across the invitation and the admin link generator
export const GROOM_NAME = 'Isuru';
export const BRIDE_NAME = 'Chathu';

export const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;

// "Dear" is a greeting style, not part of the name, so it is left out here
export function getDisplayName(prefix: string | null, guestName: string): string {
  const name = guestName.trim();
  if (!name) return '';
  if (prefix === 'Family') return `${name} and Family`;
  if (!prefix || prefix === 'Dear') return name;
  return `${prefix} ${name}`;
}

export function buildInvitationLink(baseUrl: string, prefix: string, guestName: string): string {
  const path = `${baseUrl}/${encodeURIComponent(guestName.trim())}`;
  return prefix === 'Dear' ? path : `${path}?prefix=${encodeURIComponent(prefix)}`;
}

// Reads the guest from a link like /Sanjaya?prefix=Mr. (old ?name= links still work)
export function getGuestFromUrl(): string {
  const params = new URLSearchParams(window.location.search);
  const segment = window.location.pathname.replace(/^\/+|\/+$/g, '');
  let guestName = params.get('name') || '';
  if (!guestName && segment) {
    try {
      guestName = decodeURIComponent(segment);
    } catch {
      guestName = segment;
    }
  }
  return getDisplayName(params.get('prefix'), guestName);
}

export function buildInvitationMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${GROOM_NAME} & ${BRIDE_NAME}`;
}
