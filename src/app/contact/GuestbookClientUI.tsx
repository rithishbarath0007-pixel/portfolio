"use client";

import { useRef, useTransition, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createGuestbookMessage } from '@/actions/guestbook';

// ─── Icons ────────────────────────────────────────────────────────────────────

const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

// ─── Reusable field icon ───────────────────────────────────────────────────────

function FieldIcon({ focused, hasValue }: { focused: boolean; hasValue: boolean }) {
  const show = focused || hasValue;
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key={focused ? 'pencil' : 'check'}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="absolute top-3 right-3 pointer-events-none"
        >
          {focused ? <PencilIcon /> : <CheckIcon />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function GuestbookClientUI() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Per-field focus + value state
  const [nameFocused, setNameFocused]       = useState(false);
  const [nameValue, setNameValue]           = useState('');
  const [emailFocused, setEmailFocused]     = useState(false);
  const [emailValue, setEmailValue]         = useState('');
  const [msgFocused, setMsgFocused]         = useState(false);
  const [msgValue, setMsgValue]             = useState('');

  const onSubmit = async (formData: FormData) => {
    setStatus('idle');
    setErrorMessage('');

    startTransition(async () => {
      try {
        const result = await createGuestbookMessage(formData);
        if (result?.success) {
          setStatus('success');
          formRef.current?.reset();
          setNameValue('');
          setEmailValue('');
          setMsgValue('');
          setTimeout(() => setStatus('idle'), 5000);
        }
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error.message || 'Failed to send message.');
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-12 mt-12">

      <motion.form
        ref={formRef}
        action={onSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col space-y-6"
      >

        {/* Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Name */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-white ml-1">Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Rithish Barath N"
                required
                disabled={isPending}
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                className="w-full bg-neutral-900 border rounded-xl px-5 py-4 pr-10 text-white placeholder:text-neutral-500 outline-none transition-colors disabled:opacity-50"
                style={{ borderColor: nameFocused ? '#2563eb' : nameValue ? '#404040' : '#262626' }}
              />
              <FieldIcon focused={nameFocused} hasValue={!!nameValue} />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-white ml-1">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="rithishbarathn@gmail.com"
                required
                disabled={isPending}
                value={emailValue}
                onChange={e => setEmailValue(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className="w-full bg-neutral-900 border rounded-xl px-5 py-4 pr-10 text-white placeholder:text-neutral-500 outline-none transition-colors disabled:opacity-50"
                style={{ borderColor: emailFocused ? '#2563eb' : emailValue ? '#404040' : '#262626' }}
              />
              <FieldIcon focused={emailFocused} hasValue={!!emailValue} />
            </div>
          </div>

        </div>

        {/* Message */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-white ml-1">Message</label>
          <div className="relative">
            <textarea
              name="message"
              placeholder="share your message"
              required
              disabled={isPending}
              rows={6}
              value={msgValue}
              onChange={e => setMsgValue(e.target.value)}
              onFocus={() => setMsgFocused(true)}
              onBlur={() => setMsgFocused(false)}
              className="w-full bg-neutral-900 border rounded-xl px-5 py-4 pr-10 text-white placeholder:text-neutral-500 outline-none transition-colors disabled:opacity-50"
              style={{
                resize: 'vertical',
                borderColor: msgFocused ? '#2563eb' : msgValue ? '#404040' : '#262626',
              }}
            />
            <FieldIcon focused={msgFocused} hasValue={!!msgValue} />
          </div>
        </div>

        {/* Status Messages */}
        <AnimatePresence mode="wait">
          {status === 'success' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-green-500 text-sm font-medium text-center"
            >
              Message sent successfully! I'll be responding soon!
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-red-500 text-sm font-medium text-center"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="flex justify-center pt-2">
          <motion.button
            type="submit"
            disabled={isPending}
            onMouseEnter={() => !isPending && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{
              backgroundColor: isPending ? '#1a1a1a' : isHovered ? '#2563eb' : '#1a1a1a',
              gap:             isHovered && !isPending ? 8  : 0,
              paddingLeft:     isHovered && !isPending ? 20 : 18,
            }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              display:       'flex',
              flexDirection: 'row',
              alignItems:    'center',
              paddingTop:    12,
              paddingBottom: 12,
              paddingRight:  20,
              borderRadius:  10,
              overflow:      'hidden',
              cursor:        isPending ? 'not-allowed' : 'pointer',
              border:        'none',
              whiteSpace:    'nowrap',
              opacity:       isPending ? 0.6 : 1,
            }}
          >
            {isPending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: '2px solid white', borderTopColor: 'transparent',
                }}
              />
            ) : (
              <>
                <motion.span
                  animate={{
                    width:   isHovered ? 15 : 2,
                    height:  isHovered ? 15 : 2,
                    opacity: isHovered ? 1  : 0,
                  }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    display:    'inline-flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    overflow:   'hidden',
                    color:      'white',
                  }}
                >
                  <SendIcon />
                </motion.span>
                <span style={{ fontSize: 15, fontWeight: 500, color: 'white', userSelect: 'none' }}>
                  Send
                </span>
              </>
            )}
          </motion.button>
        </div>

      </motion.form>
    </div>
  );
}