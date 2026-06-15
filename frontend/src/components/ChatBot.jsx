import { useEffect, useRef, useState } from 'react'
import { MessageCircleIcon, SendIcon, XIcon, SparklesIcon } from './Icons'

// "Aria" — the AI assistant on the landing page. Her avatar uses a real
// photograph of a professional woman, with a soft animated pulse halo so
// it feels alive in the UI. If the image ever fails to load we fall back
// to a small CSS-styled placeholder.
const BOT_NAME = 'Aria'
const BOT_PHOTO_URL =
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format&q=80'

// Avatar — a real photograph with a pulsing gradient ring so it
// reads as "live" without needing a GIF.
function BotAvatar({ size = 40 }) {
  const [errored, setErrored] = useState(false)
  const ringSize = size + 8

  if (errored) {
    return (
      <div
        className="bot-avatar-img"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f472b6, #a78bfa)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: size * 0.4,
        }}
        aria-label={BOT_NAME}
      >
        A
      </div>
    )
  }

  return (
    <span
      className="bot-avatar-wrap"
      style={{ width: ringSize, height: ringSize, position: 'relative', display: 'inline-block' }}
    >
      <span className="bot-avatar-ring" />
      <img
        src={BOT_PHOTO_URL}
        alt={BOT_NAME}
        width={size}
        height={size}
        onError={() => setErrored(true)}
        className="bot-avatar-img"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid white',
          position: 'relative',
          zIndex: 1,
          display: 'block',
        }}
      />
    </span>
  )
}
                              
const QUICK_REPLIES = [
  'How do I find jobs?',
  'How do I get an API key?',
  'What does Pro include?',
  'How do I sign up?',
  'Talk to sales',
]

// Each rule matches a list of lowercase keywords. First match wins.
const RULES = [
  {
    keywords: ['hi', 'hello', 'hey', 'yo', 'greetings'],
    reply: `Hi! I'm ${BOT_NAME}, your GSFSGroup assistant. Ask me about jobs, API keys, or our plans — or pick a quick reply below.`,
  },
  {
    keywords: ['job', 'jobs', 'work', 'hire', 'career', 'opening'],
    reply:
      "We post 1-10 fresh jobs every week across tech, product, and design. Sign up free to see this week's listings and get matched by our AI. Want me to walk you through it?",
  },
  {
    keywords: ['api', 'key', 'token', 'developer', 'llm', 'gpt', 'model'],
    reply:
      "Every signed-in user gets a free AI API key (with daily limits). Pro and Extra members unlock more requests and better models like GPT-4-class. Generate yours from your dashboard after signing up.",
  },
  {
    keywords: ['pro', 'plan', 'pricing', 'tier', 'extra', 'cost', 'price', 'pay', 'subscription'],
    reply:
      'Free gives you job search + a basic API key. Pro ($29/mo) adds 5x more job boards and better LLM models. Extra ($99/mo) unlocks everything with priority support. Full comparison is on the pricing section above.',
  },
  {
    keywords: ['sign', 'signup', 'sign up', 'register', 'join', 'create account'],
    reply:
      "Click 'Sign Up' at the top right. You can also try a demo account from the sign-in page — one click logs you in as a sample user or admin.",
  },
  {
    keywords: ['admin', 'manage', 'dashboard', 'console'],
    reply:
      "Admins get a separate console at /admin for managing users, jobs, and issued API keys. Access is by invitation — use the seeded admin demo account on the sign-in page to peek inside.",
  },
  {
    keywords: ['help', 'support', 'contact', 'human', 'sales'],
    reply:
      "I can answer most questions, but for account issues or sales, email hello@gsfsgroup.demo and a human will reply within a business day.",
  },
  {
    keywords: ['thank', 'thanks', 'thx', 'ty'],
    reply: "You're welcome! Ping me anytime.",
  },
]

function matchReply(text) {
  const t = text.toLowerCase()
  for (const rule of RULES) {
    if (rule.keywords.some((k) => t.includes(k))) return rule.reply
  }
  return "I'm not sure I caught that — try one of the quick replies below, or ask about jobs, API keys, pricing, or signing up."
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: `Hi! I'm ${BOT_NAME} 👋 I can answer questions about jobs, API keys, and our Pro/Extra plans. What would you like to know?`,
      // (Using the wave emoji once is fine as a friendly greeting;
      //  all UI icons are SVG elsewhere.)
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, typing, open])

  const send = (text) => {
    const value = (text ?? input).trim()
    if (!value) return
    setMessages((m) => [...m, { from: 'user', text: value }])
    setInput('')
    setTyping(true)
    // Simulate "thinking" for a moment
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: matchReply(value) }])
      setTyping(false)
    }, 650)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        className={'chatbot-fab' + (open ? ' chatbot-fab-hidden' : '')}
        onClick={() => setOpen(true)}
        aria-label={`Open ${BOT_NAME} chat`}
      >
        <BotAvatar size={56} />
        <span className="chatbot-fab-pulse" aria-hidden />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chatbot-panel" role="dialog" aria-label={`${BOT_NAME} chat`}>
          <header className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar"><BotAvatar size={40} /></div>
              <div>
                <strong>{BOT_NAME}</strong>
                <span><span className="chatbot-online" /> Online · GSFSGroup AI</span>
              </div>
            </div>
            <button
              type="button"
              className="chatbot-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <XIcon size={18} />
            </button>
          </header>

          <div className="chatbot-messages" ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={'chatbot-msg chatbot-msg-' + m.from}>
                {m.from === 'bot' && (
                  <div className="chatbot-msg-avatar"><BotAvatar size={28} /></div>
                )}
                <div className="chatbot-bubble">{m.text}</div>
              </div>
            ))}
            {typing && (
              <div className="chatbot-msg chatbot-msg-bot">
                <div className="chatbot-msg-avatar"><BotAvatar size={28} /></div>
                <div className="chatbot-bubble chatbot-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-quick">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                type="button"
                className="chatbot-chip"
                onClick={() => send(q)}
              >
                {q}
              </button>
            ))}
          </div>

          <form
            className="chatbot-input"
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Message ${BOT_NAME}…`}
              aria-label="Message"
            />
            <button type="submit" className="chatbot-send" aria-label="Send">
              <SendIcon size={18} />
            </button>
          </form>

          <div className="chatbot-footer">
            <SparklesIcon size={12} /> Powered by GSFSGroup AI
          </div>
        </div>
      )}
    </>
  )
}
