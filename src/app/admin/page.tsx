import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import AdminLoginForm from './AdminLoginForm';
import { logoutAdmin } from '@/actions/auth';

export const metadata = {
  title: 'Admin Dashboard | Portfolio',
  robots: { index: false, follow: false }, 
};

export default async function AdminDashboard() {
  // 1. SECURITY CHECK: Verify if the user is logged in
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (session?.value !== 'authenticated') {
    // If no secure cookie is found, render the Login Form
    return <AdminLoginForm />;
  }

  // 2. IF AUTHENTICATED: Fetch data and render the dashboard
  const now = new Date();
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  const startOfWeek = new Date(new Date().setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch EVERYTHING in parallel for maximum speed
  const [
    contactMessages,
    totalVisits,
    dailyVisits,
    weeklyVisits,
    monthlyVisits,
    uniqueVisitorsData,
    topPagesData,
    aiConversations
  ] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.pageVisit.count(),
    prisma.pageVisit.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.pageVisit.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.pageVisit.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.pageVisit.findMany({ distinct: ['sessionId'], select: { sessionId: true } }),
    prisma.pageVisit.groupBy({
      by: ['page'],
      _count: { page: true },
      orderBy: { _count: { page: 'desc' } },
      take: 3,
    }),
    prisma.aiConversation.findMany({
      include: {
        messages: { 
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: {
        createdAt: 'desc', 
      },
      take: 20
    })
  ]);

  const uniqueVisitors = uniqueVisitorsData.length;

  return (
    <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 min-h-screen space-y-24">
      
      {/* Header with Logout Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-medium tracking-tight text-white mb-2">
            Mission Control
          </h1>
          <p className="text-neutral-500">
            Real-time portfolio analytics, private inbox, and AI interaction logs.
          </p>
        </div>
        <form action={logoutAdmin}>
          <button type="submit" className="text-sm px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white rounded-lg transition-colors">
            Log out
          </button>
        </form>
      </div>

      {/* SECTION 1: TRAFFIC ANALYTICS */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium text-white border-b border-white/10 pb-4">
          Visitor Analytics
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <div className="text-sm text-neutral-500 mb-2">Total Page Views</div>
            <div className="text-4xl font-medium text-white">{totalVisits}</div>
          </div>
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <div className="text-sm text-neutral-500 mb-2">Unique Visitors</div>
            <div className="text-4xl font-medium text-white">{uniqueVisitors}</div>
          </div>
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <div className="text-sm text-neutral-500 mb-2">Visits Today</div>
            <div className="text-4xl font-medium text-white">{dailyVisits}</div>
          </div>
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <div className="text-sm text-neutral-500 mb-2">Visits This Month</div>
            <div className="text-4xl font-medium text-white">{monthlyVisits}</div>
          </div>
        </div>

        <div className="flex gap-4 items-center p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl">
          <span className="text-sm text-neutral-500">Top Pages:</span>
          {topPagesData.map((page: typeof topPagesData[number], i: number) => (
            <div key={i} className="text-sm text-white bg-neutral-800 px-3 py-1 rounded-md">
              {page.page} <span className="text-neutral-500 ml-1">({page._count.page})</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: PRIVATE INBOX */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium text-white border-b border-white/10 pb-4">
          Direct Messages ({contactMessages.length})
        </h2>

        {contactMessages.length === 0 ? (
          <p className="text-neutral-500 italic">Inbox is empty.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* TYPE APPLIED HERE */}
            {contactMessages.map((msg: typeof contactMessages[number]) => (
              <div key={msg.id} className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-white">{msg.name}</span>
                    <a href={`mailto:${msg.email}`} className="text-sm text-blue-400 hover:text-blue-300">
                      {msg.email}
                    </a>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
                <div className="text-xs text-neutral-500 shrink-0">
                  {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3: AI CHAT LOGS */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium text-white border-b border-white/10 pb-4">
          Recent AI Interactions
        </h2>

        {aiConversations.length === 0 ? (
          <p className="text-zinc-500 text-sm">No conversations yet.</p>
        ) : (
          <div className="space-y-4">
            {/* TYPE APPLIED HERE */}
            {aiConversations.map((convo: typeof aiConversations[number]) => (
              <details 
                key={convo.id} 
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group"
              >
                <summary className="p-4 cursor-pointer flex justify-between items-center hover:bg-zinc-850 transition-colors list-none">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400">
                      🤖
                    </span>
                    <div>
                      <div className="font-medium text-white text-sm flex items-center gap-2">
                        Chat Session 
                        <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-xs font-mono">
                          ID: {convo.sessionId.split('-')[0]}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {convo.messages.length} messages
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-400 font-medium tracking-wide">
                    {new Date(convo.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </div>
                </summary>

                <div className="p-4 border-t border-zinc-800 bg-black/50 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {/* TYPE APPLIED HERE */}
                  {convo.messages.map((msg: typeof convo.messages[number]) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1.5">
                        {msg.role === 'user' ? 'Visitor' : 'AI'}
                        <span className="text-zinc-600 normal-case">•</span>
                        <span className="text-zinc-600 normal-case">
                          {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </span>

                      <div className={`px-4 py-2 rounded-xl text-sm max-w-[80%] ${
                        msg.role === 'user' 
                          ? 'bg-blue-600/20 text-blue-100 border border-blue-500/20 rounded-tr-sm' 
                          : 'bg-zinc-800 text-zinc-300 rounded-tl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}