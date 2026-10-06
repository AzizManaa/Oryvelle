import OpeningChapter from "@/components/landing/chapters/opening/OpeningChapter";
import { homeJsonLd } from "./home-metadata";
export { metadata } from "./home-metadata";

export default function OpeningPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd).replace(/</g, "\\u003c") }} />
    <script dangerouslySetInnerHTML={{ __html: `window.__openingScrollRestoration=history.scrollRestoration;history.scrollRestoration="manual";window.scrollTo(0,0);` }} />
    <OpeningChapter />
  </>;
}
