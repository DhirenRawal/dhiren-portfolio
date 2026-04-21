import { fetchMarketSnapshot } from "../server/market";

export default async function handler(_req: unknown, res: { status: (code: number) => { json: (body: unknown) => void }; json: (body: unknown) => void }) {
  try {
    const quotes = await fetchMarketSnapshot();
    res.status(200).json(quotes);
  } catch (error) {
    console.error("Vercel market API failed", error);
    res.status(502).json({
      message: "Unable to fetch live market data right now.",
    });
  }
}
