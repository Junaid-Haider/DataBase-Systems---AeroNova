import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart() {
  // Mock data since local DB might not have enough history
  const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
    { name: 'Aug', value: 4500 },
    { name: 'Sep', value: 5200 },
    { name: 'Oct', value: 6100 },
    { name: 'Nov', value: 5800 },
    { name: 'Dec', value: 7200 },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 h-96 border border-white/5">
      <h3 className="text-lg font-bold text-white mb-6">Revenue Overview</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
          <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            itemStyle={{ color: '#38bdf8' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#0ea5e9" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
