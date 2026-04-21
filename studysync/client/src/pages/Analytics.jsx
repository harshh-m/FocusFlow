import React,
{
  useEffect,
  useState
} from "react";

import { Link } from "react-router-dom";

import {
  BarChart3,
  TrendingUp
} from "lucide-react";

import {
  getAnalyticsData
} from "../services/api";

export default function Analytics() {
  const [data, setData] =
    useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData =
    async () => {
      const res =
        await getAnalyticsData();

      setData(res);
    };

  if (!data)
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0b1020] text-white p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-gray-400">
            Track your progress
          </p>

          <h1 className="text-3xl font-bold flex gap-2 items-center">
            <BarChart3 className="text-indigo-400" />
            Analytics
          </h1>
        </div>

        <Link
          to="/"
          className="bg-indigo-500 px-5 py-3 rounded-xl"
        >
          Back Dashboard
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {data.cards.map(
          (item, i) => (
            <div
              key={i}
              className="bg-[#121a2f] p-5 rounded-2xl"
            >
              <p className="text-gray-400 text-sm">
                {item.title}
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {item.value}
              </h2>
            </div>
          )
        )}
      </div>

      {/* Weekly */}
      <div className="bg-[#121a2f] p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-bold mb-6">
          Weekly Study Hours
        </h2>

        <div className="flex items-end gap-3 h-72">
          {data.weeklyData.map(
            (item, i) => (
              <div
                key={i}
                className="w-full text-center"
              >
                <div
                  className="bg-indigo-500 rounded-t-xl"
                  style={{
                    height:
                      item.hours *
                        35 +
                      "px",
                  }}
                />

                <p className="text-sm mt-3 text-gray-400">
                  {item.day}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="grid xl:grid-cols-2 gap-6">
        {/* Subjects */}
        <div className="bg-[#121a2f] p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-5">
            Subject Performance
          </h2>

          <div className="space-y-5">
            {data.subjects.map(
              (item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span>
                      {item.subject}
                    </span>

                    <span className="text-indigo-400">
                      {item.value}
                    </span>
                  </div>

                  <div className="bg-white/5 h-3 rounded-full">
                    <div
                      className="bg-indigo-500 h-3 rounded-full"
                      style={{
                        width:
                          item.value,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-[#121a2f] p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-5">
            Insights
          </h2>

          <div className="space-y-4">
            {data.insights.map(
              (item, i) => (
                <div
                  key={i}
                  className="bg-white/5 p-4 rounded-xl"
                >
                  {item}
                </div>
              )
            )}
          </div>

          <div className="mt-6 bg-indigo-500 rounded-2xl p-5">
            <p className="text-sm opacity-80">
              Growth
            </p>

            <h3 className="font-semibold mt-1 flex gap-2 items-center">
              {data.growth}
              <TrendingUp size={18} />
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}