'use client';

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

interface ProjectionsChartProps {
  data: Array<{
    year: number;
    revenue: number;
    costs: number;
    profit: number;
  }>;
}

export function ProjectionsChart({ data }: ProjectionsChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-72 w-full bg-bg-tertiary/20 rounded-xl animate-pulse"></div>;
  }

  const formattedData = data.map(d => ({
    ...d,
    revenueK: Math.round(d.revenue / 1000),
    costsK: Math.round(d.costs / 1000),
    profitK: Math.round(d.profit / 1000),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#003ec7" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#003ec7" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v}k`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
            itemStyle={{ color: '#475569' }}
            formatter={(value: any, name: any) => [`₹${value}k`, name === 'revenueK' ? 'Revenue' : name === 'costsK' ? 'Costs' : 'Profit']}
          />
          <Area type="monotone" dataKey="revenueK" stroke="#003ec7" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
          <Area type="monotone" dataKey="profitK" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface FundsChartProps {
  data: Array<{
    category: string;
    percentage: number;
  }>;
}

export function FundsChart({ data }: FundsChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-72 w-full bg-bg-tertiary/20 rounded-xl animate-pulse"></div>;
  }

  const COLORS = ['#003ec7', '#0052ff', '#3b82f6', '#93c5fd', '#bfdbfe'];

  return (
    <div className="h-72 w-full flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex-1 h-full w-full max-w-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="percentage"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              itemStyle={{ color: '#0f172a' }}
              formatter={(value) => `${value}%`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-grow space-y-2 w-full">
        {data.map((item, index) => (
          <div key={item.category} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-text-secondary">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              <span className="truncate max-w-[150px]">{item.category}</span>
            </div>
            <span className="font-mono font-bold text-text-primary">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RadarScoreChartProps {
  scores: Record<string, { score: number }>;
}

export function RadarScoreChart({ scores }: RadarScoreChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 w-full bg-bg-tertiary/20 rounded-xl animate-pulse"></div>;
  }

  const data = [
    { name: 'Overall', score: scores.overall?.score || 0 },
    { name: 'Innovation', score: scores.innovation?.score || 0 },
    { name: 'Market', score: scores.marketPotential?.score || 0 },
    { name: 'Scalability', score: scores.scalability?.score || 0 },
    { name: 'Invest Readiness', score: scores.investmentReadiness?.score || 0 },
    { name: 'Risk Cut', score: 100 - (scores.risk?.score || 0) },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} />
          <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={100} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            itemStyle={{ color: '#0f172a' }}
            formatter={(value) => [`${value}/100`, 'Rating']}
          />
          <Bar dataKey="score" fill="#003ec7" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.name === 'Overall' ? '#003ec7' : entry.name === 'Risk Cut' ? '#dc2626' : '#0052ff'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
