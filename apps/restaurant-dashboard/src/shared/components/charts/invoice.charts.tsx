"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const InvoiceCharts = () => {
  const analyticsData = [
    { name: "Jan 24", count: 700 },
    { name: "Feb 24", count: 900 },
    { name: "Mar 24", count: 400 },
    { name: "Apr 24", count: 800 },
    { name: "May 24", count: 400 },
    { name: "Jun 24", count: 800 },
  ];

  return (
    <div className="w-full h-[60vh] mt-10">
      <ResponsiveContainer width={"100%"}>
        <AreaChart
          data={analyticsData}
          margin={{
            top: 20,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="count"
            stroke="#4d62d9"
            fill="#4d62d9"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvoiceCharts;
