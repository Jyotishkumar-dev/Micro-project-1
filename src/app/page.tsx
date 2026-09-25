import { getPortfolioData } from "@/lib/data/portfolio";
import { PortfolioShell } from "@/components/layout/PortfolioShell";

/**
 * Public portfolio page.
 *
 * Now a Server Component so the portfolio content can be read from Supabase
 * during the render. The reads go through the cookie-less anon client and are
 * cached for 5 minutes, and every one of them degrades to the bundled copy on
 * failure — see `lib/data/portfolio.ts`. All client-side interactivity lives in
 * `PortfolioShell`, which receives plain serialisable props.
 */
export default async function HomePage() {
  const data = await getPortfolioData();

  return <PortfolioShell {...data} />;
}
