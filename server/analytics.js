// Aggregates raw click documents into chart-friendly summaries.

function lastNDaysTrend(clicks, n = 7) {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = n - 1; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    days.push({ date: day, count: 0 });
  }

  clicks.forEach((click) => {
    const clickDate = new Date(click.timestamp);
    clickDate.setHours(0, 0, 0, 0);
    const match = days.find((d) => d.date.getTime() === clickDate.getTime());
    if (match) match.count += 1;
  });

  return days.map((d) => ({
    date: d.date.toISOString().slice(0, 10),
    label: d.date.toLocaleDateString('en-US', { weekday: 'short' }),
    count: d.count,
  }));
}

function groupByField(clicks, field) {
  const counts = {};
  clicks.forEach((click) => {
    const key = click[field] || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function summarize(link) {
  const clicks = link.clicks || [];
  return {
    trend7d: lastNDaysTrend(clicks, 7),
    byBrowser: groupByField(clicks, 'browser'),
    byDevice: groupByField(clicks, 'device'),
    byReferrer: groupByField(clicks, 'referrer'),
    totalClicks: link.clickCount,
    lastClickAt: clicks.length ? clicks[clicks.length - 1].timestamp : null,
  };
}

module.exports = { lastNDaysTrend, groupByField, summarize };
