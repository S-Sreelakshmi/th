import React, { useState, useEffect } from "react";

function getInitialSubjects() {
  try {
    return JSON.parse(localStorage.getItem("subjects")) || [];
  } catch {
    return [];
  }
}

export default function SmartPlanner() {
  const [subjects, setSubjects] = useState(getInitialSubjects());
  const [viewDate, setViewDate] = useState(new Date());
  const [newSubName, setNewSubName] = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("22:00");
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  function addSubject() {
    if (!newSubName.trim()) return;
    setSubjects([...subjects, { id: Date.now(), name: newSubName.trim(), tasks: [] }]);
    setNewSubName("");
  }

  function removeSubject(id) {
    setSubjects(subjects.filter((s) => s.id !== id));
  }

  function addTask(id, type, title, date) {
    if (!title || !date) return alert("Enter title and deadline date!");
    const deadline = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    setSubjects((subs) =>
      subs.map((s) =>
        s.id === id
          ? {
              ...s,
              tasks: [
                ...s.tasks,
                {
                  id: Date.now(),
                  type,
                  title,
                  date,
                  subjectName: s.name,
                  days: daysRemaining,
                },
              ],
            }
          : s
      )
    );
  }

  function renderCalendar() {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    let days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={"empty-" + i}></div>);
    for (let d = 1; d <= lastDate; d++) {
      const dateStr = new Date(year, month, d).toISOString().split("T")[0];
      let todaysTasks = [];
      subjects.forEach((sub) =>
        sub.tasks.forEach((t) =>
          t.date === dateStr &&
          todaysTasks.push(
            <div key={t.id} className="text-[8px] bg-red-100 text-red-700 px-1 rounded mt-1">{t.title}</div>
          )
        )
      );
      days.push(
        <div key={d} className="text-[10px] p-1 min-h-[50px] border rounded-lg bg-slate-50">
          <div className="font-bold">{d}</div>
          {todaysTasks}
        </div>
      );
    }
    return days;
  }

  function generateWorkSchedule() {
    let tasks = [];
    subjects.forEach((s) => s.tasks.forEach((t) => tasks.push(t)));
    if (tasks.length === 0) return alert("Add tasks!");
    tasks.sort((a, b) => a.days - b.days);
    let cursor = new Date(`2026-01-01T${startTime}`);
    const limit = new Date(`2026-01-01T${endTime}`);
    const fmt = { hour: "2-digit", minute: "2-digit" };
    let timelineArr = [];
    tasks.forEach((task) => {
      if (cursor >= limit) return;
      let endWork = new Date(cursor.getTime() + 25 * 60000);
      timelineArr.push({
        start: cursor.toLocaleTimeString([], fmt),
        end: endWork.toLocaleTimeString([], fmt),
        subjectName: task.subjectName,
        title: task.title,
        type: task.type,
        days: task.days,
      });
      timelineArr.push({ break: true });
      cursor = new Date(endWork.getTime() + 5 * 60000);
    });
    setTimeline(timelineArr);
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      {/* HEADER */}
      <header className="flex items-center gap-3 mb-10 border-b pb-6">
        <div className="bg-indigo-600 p-2 rounded-xl text-white">
          <span role="img" aria-label="cap">🎓</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Smart Planner</h1>
          <p className="text-slate-500 text-sm">Manage tasks with real deadlines</p>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-7 space-y-6">
          {/* ADD SUBJECT */}
          <div className="flex gap-2 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
            <input
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              type="text"
              placeholder="Add Subject (e.g. Maths)"
              className="flex-1 p-3 bg-transparent outline-none"
            />
            <button
              onClick={addSubject}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-medium"
            >
              Add
            </button>
          </div>
          {/* SUBJECT LIST */}
          <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
            {subjects.map((s) => (
              <div className="bg-white rounded-3xl border shadow-sm" key={s.id}>
                <div className="bg-indigo-500 p-4 text-white flex justify-between items-center">
                  <span className="font-bold flex items-center gap-2">
                    <span role="img" aria-label="book">📖</span> {s.name}
                  </span>
                  <button onClick={() => removeSubject(s.id)}>
                    <span role="img" aria-label="trash">🗑️</span>
                  </button>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["test", "assignment", "record"].map((type) => (
                    <div key={type}>
                      <label className="text-[10px] font-bold text-slate-400 uppercase flex gap-1">
                        <span role="img" aria-label="tag">🏷️</span> {type}
                      </label>
                      <input
                        className={`${type}-title w-full p-2 bg-slate-50 border rounded-xl text-[11px]`}
                        placeholder="Title"
                        id={`title-${s.id}-${type}`}
                      />
                      <input
                        className={`${type}-date w-full p-2 bg-slate-50 border rounded-xl text-[11px] mt-1`}
                        type="date"
                        id={`date-${s.id}-${type}`}
                      />
                      <button
                        onClick={() => {
                          const title = document.getElementById(`title-${s.id}-${type}`).value;
                          const date = document.getElementById(`date-${s.id}-${type}`).value;
                          addTask(s.id, type, title, date);
                        }}
                        className="w-full mt-2 bg-indigo-600 text-white p-2 rounded-xl text-xs"
                      >
                        Add
                      </button>
                      <div className="mt-2 space-y-1">
                        {s.tasks.filter((t) => t.type === type).map((t) => (
                          <div key={t.id} className="text-[10px] bg-indigo-50 p-2 rounded-lg border">
                            <b>{t.title}</b>
                            <div className="text-indigo-600">{t.date}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="lg:col-span-5 space-y-6">
          {/* TIME WINDOW */}
          <section className="bg-white p-6 rounded-3xl border shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span role="img" aria-label="clock">⏰</span> Time Window
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <input
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                type="time"
                className="p-2 w-full bg-slate-50 border rounded-xl outline-none text-sm"
              />
              <span className="text-slate-400">→</span>
              <input
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                type="time"
                className="p-2 w-full bg-slate-50 border rounded-xl outline-none text-sm"
              />
            </div>
            <button
              onClick={generateWorkSchedule}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg"
            >
              ⚡ Schedule All Work
            </button>
          </section>
          {/* TIMELINE */}
          {timeline.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border shadow-sm max-h-[400px] overflow-y-auto custom-scrollbar space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Focus Timeline</h3>
              <div className="space-y-4">
                {timeline.map((item, idx) =>
                  item.break ? (
                    <div key={idx} className="text-[9px] italic text-emerald-600 ml-6">☕ 5-min break</div>
                  ) : (
                    <div key={idx} className="pl-6 border-l-2 border-indigo-200 relative">
                      <div className="absolute -left-[7px] top-0 w-3 h-3 bg-indigo-600 rounded-full"></div>
                      <div className="text-[10px] font-bold text-indigo-500">
                        {item.start} - {item.end}
                      </div>
                      <div className="mt-1 bg-slate-50 p-3 rounded-xl border">
                        <h4 className="text-xs font-bold">{item.subjectName}: {item.title}</h4>
                        <span className="text-[9px] bg-gray-200 px-2 py-0.5 rounded-full uppercase">{item.type}</span>
                        <p className="text-[9px] text-red-500 font-bold mt-1">Due in {item.days} days</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
          {/* CALENDAR */}
          <section className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <span role="img" aria-label="calendar">📅</span> Deadlines
              </h2>
              <span className="text-xs font-bold text-slate-400 uppercase">
                {viewDate.toLocaleString("en-US", { month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="calendar-grid text-center text-[10px] font-bold text-slate-300 mb-2" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
              <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="calendar-grid gap-1" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
              {renderCalendar()}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
