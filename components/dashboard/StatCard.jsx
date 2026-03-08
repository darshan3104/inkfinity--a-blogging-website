export default function StatCard({ title, value, colorType, icon: Icon }) {
  // Styles based on the mockup
  const styles = {
    teal: {
      bg: "bg-[#b1e8e5]",
      iconBg: "bg-[#1f2852]",
      text: "text-[#1f2852]",
      valueText: "text-[#1f2852]",
      iconColor: "text-white"
    },
    purple: {
      bg: "bg-[#d6d8ee]",
      iconBg: "bg-[#1f2852]",
      text: "text-[#5e668c]",
      valueText: "text-[#1f2852]",
      iconColor: "text-white"
    },
    pink: {
      bg: "bg-[#eab9c1]",
      iconBg: "bg-[#1f2852]",
      text: "text-[#5e668c]",
      valueText: "text-[#1f2852]",
      iconColor: "text-white"
    }
  };

  const selectedStyle = styles[colorType] || styles.teal;

  return (
    <div className={`${selectedStyle.bg} rounded-2xl p-5 flex items-center gap-4 shadow-xs`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedStyle.iconBg} flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${selectedStyle.iconColor}`} />
      </div>
      <div>
        <h3 className={`text-2xl font-bold ${selectedStyle.valueText} mb-0.5`}>{value}</h3>
        <p className={`text-sm font-medium ${selectedStyle.text}`}>{title}</p>
      </div>
    </div>
  );
}
