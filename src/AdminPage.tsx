import React, { useState } from 'react';
import { Copy, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import {
  PREFIXES,
  GROOM_NAME,
  BRIDE_NAME,
  getDisplayName,
  buildInvitationLink,
  buildInvitationMessage,
} from './guest';

export function AdminPage() {
  const [prefix, setPrefix] = useState<string>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [message, setMessage] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleGenerate = () => {
    if (!guestName.trim()) return;

    const name = getDisplayName(prefix, guestName);
    const link = buildInvitationLink(window.location.origin, prefix, guestName);
    setDisplayName(name);
    setGeneratedLink(link);
    setMessage(buildInvitationMessage(name, link));
  };

  const copy = async (text: string, successText: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successText);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Could not copy. Please copy it manually.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800 flex items-center justify-center">
      <Toaster position="top-center" />
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-[0_8px_30px_rgba(176,137,104,0.15)] overflow-hidden border border-brand-beige/50">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display tracking-wide mb-2 text-stone-800">Link Generator</h2>
            <p className="text-stone-500 font-sans text-sm uppercase tracking-[0.2em]">
              {GROOM_NAME} & {BRIDE_NAME} · Personalized invitations
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="prefix" className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">
                Select Prefix
              </label>
              <select
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-beige focus:ring-2 focus:ring-brand-beige-deep focus:border-transparent outline-none transition-all bg-white font-sans"
              >
                {PREFIXES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-stone-700 mb-1 tracking-wide">
                Guest Name
              </label>
              <input
                type="text"
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Sanjaya"
                className="w-full px-4 py-3 rounded-lg border border-brand-beige focus:ring-2 focus:ring-brand-beige-deep focus:border-transparent outline-none transition-all bg-white font-sans"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!guestName.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-beige-deep text-white font-sans text-sm tracking-[0.2em] uppercase shadow-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              <LinkIcon className="w-5 h-5" />
              Generate Link
            </button>

            {generatedLink && (
              <div className="mt-8 space-y-4">
                <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50">
                  <p className="text-sm text-stone-600 mb-1 font-medium tracking-wide">Greeting</p>
                  <p className="font-serif text-xl text-stone-800">Dear {displayName} ❤️</p>
                </div>

                <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50">
                  <p className="text-sm text-stone-600 mb-2 font-medium tracking-wide">Generated Link</p>
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    onFocus={(e) => e.target.select()}
                    className="w-full px-3 py-2 text-sm bg-white border border-brand-beige/50 rounded-md focus:outline-none text-stone-600 font-sans"
                  />
                </div>

                <div className="p-4 bg-brand-ivory rounded-xl border border-brand-beige/50">
                  <p className="text-sm text-stone-600 mb-2 font-medium tracking-wide">Message Preview</p>
                  <pre className="whitespace-pre-wrap wrap-break-word text-sm text-stone-700 font-sans leading-relaxed">{message}</pre>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => copy(generatedLink, 'Link copied!')}
                disabled={!generatedLink}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-brand-beige-deep text-brand-beige-deep font-sans text-xs tracking-[0.15em] uppercase hover:bg-brand-beige/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Copy className="w-4 h-4" />
                Copy Link Only
              </button>
              <button
                onClick={() => copy(message, 'Message copied!')}
                disabled={!generatedLink}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-stone-800 text-white font-sans text-xs tracking-[0.15em] uppercase hover:bg-stone-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4" />
                Copy Full Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
