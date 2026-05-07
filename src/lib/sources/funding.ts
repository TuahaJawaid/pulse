import { FundingRound } from "../types";

export async function fetchFunding(): Promise<FundingRound[]> {
  // Public launch: do not show unverifiable mock funding rounds.
  return [];
}
