// docs/assets/js/kpis.js
document.addEventListener("DOMContentLoaded", async () => {
  const base = document.querySelector('meta[name="baseurl"]')?.content || "";
  const join = (a, b) => (a.endsWith("/") ? a.slice(0, -1) : a) + "/" + (b.startsWith("/") ? b.slice(1) : b);
  const url = join(base, "data/kpi.json") + "?" + Date.now();

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("kpi.json fetch failed " + res.status);
    const data = await res.json();

    const months = data.monthly.map(m => m.month);
    const hours = data.monthly.map(m => m.hours);
    const byProject = data.leaderboard;
    const cumulative = hours.reduce((a, v, i) => { a.push((a[i-1]||0) + v); return a; }, []);

    const common = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } };

    new Chart(document.getElementById("chartMonthly").getContext("2d"), {
      type: "line",
      data: { labels: months, datasets: [{ data: hours, pointRadius: 3 }] },
      options: { ...common, plugins:{ title:{ display:true, text:"Monthly Hours Saved" } } }
    });

    const ctxBar = document.getElementById("chartByProject").getContext("2d");
    new Chart(ctxBar, {
      type: "bar",
      data: { labels: byProject.map(p => p.project), datasets: [{ data: byProject.map(p => p.hours) }] },
      options: { ...common, plugins:{ title:{ display:true, text:"Hours Saved by Project" } } }
    });

    new Chart(document.getElementById("chartShare").getContext("2d"), {
      type: "doughnut",
      data: { labels: byProject.map(p => p.project), datasets: [{ data: byProject.map(p => p.hours) }] },
      options: { responsive:true, plugins:{ title:{ display:true, text:"Share of Hours by Project" } } }
    });

    new Chart(document.getElementById("chartCumulative").getContext("2d"), {
      type: "line",
      data: { labels: months, datasets: [{ data: cumulative, pointRadius: 3 }] },
      options: { ...common, plugins:{ title:{ display:true, text:"Cumulative Hours Saved" } } }
    });
  } catch (e) {
    console.error(e);
  }
});