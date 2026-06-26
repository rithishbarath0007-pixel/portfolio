'use server'

import prisma from '@/lib/prisma'

export async function getDashboardMetrics() {
  const now = new Date();
  
  // Time boundaries
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    // 1. Total Page Views
    const totalViews = await prisma.pageVisit.count();

    // 2. Unique Visitors (Counting distinct sessionIds)
    const uniqueVisitorsResult = await prisma.pageVisit.findMany({
      distinct: ['sessionId'],
      select: { sessionId: true },
    });
    const uniqueVisitors = uniqueVisitorsResult.length;

    // 3. Time-based Visitors
    const dailyVisits = await prisma.pageVisit.count({ where: { createdAt: { gte: startOfDay } } });
    const weeklyVisits = await prisma.pageVisit.count({ where: { createdAt: { gte: startOfWeek } } });
    const monthlyVisits = await prisma.pageVisit.count({ where: { createdAt: { gte: startOfMonth } } });

    // 4. Top Visited Pages
    const topPages = await prisma.pageVisit.groupBy({
      by: ['page'],
      _count: { page: true },
      orderBy: { _count: { page: 'desc' } },
      take: 5,
    });

    return {
      totalViews,
      uniqueVisitors,
      dailyVisits,
      weeklyVisits,
      monthlyVisits,
      topPages: topPages.map(p => ({ page: p.page, views: p._count.page }))
    };
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    return null;
  }
}