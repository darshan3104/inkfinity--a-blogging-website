import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function ScheduleWidget() {
  const days = [
    { day: "S", date: "8", active: false },
    { day: "M", date: "9", active: false },
    { day: "T", date: "10", active: false },
    { day: "W", date: "11", active: true },
    { day: "T", date: "12", active: false },
    { day: "F", date: "13", active: false },
    { day: "S", date: "14", active: false },
  ];

  const articles = [
    {
      time: "12:30",
      title: "Disney's motion principles in designing interface animations",
      assignedBy: "James k",
    },
    {
      time: "14:15",
      title: "How Airbnb drives users actions with their landing page design",
      assignedBy: "alexandra",
    },
    {
      time: "17:30",
      title: "It's Time for Tech to Ask 'Should We' Instead of 'Could We'",
      assignedBy: "alexandra",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#fadcbd] px-5 py-4 flex items-center justify-between">
        <h3 className="font-bold text-[#2d285a]">Today's artical</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/40 text-[#2d285a] hover:bg-white/60 text-sm font-medium transition-colors">
          <Calendar className="w-3.5 h-3.5" />
          January
        </button>
      </div>

      {/* Calendar Strip */}
      <div className="bg-[#fbf4eb] px-4 py-3 border-b border-orange-100 flex items-center justify-between">
        <button className="p-1 hover:bg-orange-200/50 rounded-lg text-slate-500">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2 lg:gap-3">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400">{d.day}</span>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  d.active ? "bg-[#1f2852] text-white shadow-md shadow-blue-900/20" : "text-slate-600 hover:bg-orange-100"
                }`}
              >
                {d.date}
              </div>
            </div>
          ))}
        </div>
        <button className="p-1 hover:bg-orange-200/50 rounded-lg text-slate-500">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Schedule List */}
      <div className="p-5 space-y-5 overflow-y-auto flex-1 bg-white">
        {articles.map((article, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-12 text-sm font-bold text-slate-500 pt-0.5 shrink-0">
              {article.time}
            </div>
            <div className="flex-1 pb-5 border-b border-slate-100 last:border-0 last:pb-0">
              <h4 className="text-sm font-bold text-slate-800 leading-snug mb-1">
                {article.title}
              </h4>
              <p className="text-xs text-slate-400 font-medium">
                Assigned by {article.assignedBy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
