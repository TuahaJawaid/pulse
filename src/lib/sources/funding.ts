import { FundingRound } from "../types";

export async function fetchFunding(): Promise<FundingRound[]> {
  // Mock data for v1 — replace with Crunchbase RSS or API later
  const now = new Date();
  const day = 24 * 60 * 60 * 1000;

  return [
    {
      company: "Cognition AI",
      amount: "$175M Series B",
      investors: ["Founders Fund", "a16z"],
      timestamp: new Date(now.getTime() - 1 * day).toISOString(),
      url: "https://techcrunch.com",
    },
    {
      company: "Sakana AI",
      amount: "$300M Series B",
      investors: ["Lux Capital", "Khosla Ventures", "NVentures"],
      timestamp: new Date(now.getTime() - 2 * day).toISOString(),
      url: "https://techcrunch.com",
    },
    {
      company: "Poolside AI",
      amount: "$500M Series B",
      investors: ["Bain Capital Ventures", "DST Global"],
      timestamp: new Date(now.getTime() - 3 * day).toISOString(),
      url: "https://venturebeat.com",
    },
    {
      company: "Glean",
      amount: "$260M Series E",
      investors: ["Altimeter Capital", "Sequoia"],
      timestamp: new Date(now.getTime() - 4 * day).toISOString(),
      url: "https://techcrunch.com",
    },
    {
      company: "Runway",
      amount: "$141M Series D",
      investors: ["General Atlantic", "Google"],
      timestamp: new Date(now.getTime() - 5 * day).toISOString(),
      url: "https://venturebeat.com",
    },
    {
      company: "Hebbia",
      amount: "$130M Series B",
      investors: ["Andreessen Horowitz", "Peter Thiel"],
      timestamp: new Date(now.getTime() - 5 * day).toISOString(),
      url: "https://techcrunch.com",
    },
    {
      company: "Sierra AI",
      amount: "$175M Series B",
      investors: ["Sequoia", "Benchmark"],
      timestamp: new Date(now.getTime() - 6 * day).toISOString(),
      url: "https://techcrunch.com",
    },
  ];
}
