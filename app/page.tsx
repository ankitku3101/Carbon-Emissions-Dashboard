import Image from "next/image";
import Landing from "./sections/Landing";
import Statistics from "./sections/Statistics";
import Hotspots from "./sections/Hotspots";
import Prediction from "./sections/Prediction";
import Alerts from "./sections/Alerts";
import Insights from "./sections/Insights";
import TotalEmissions from "./sections/TotalEmissions";
import TotalEVprod from "./sections/TotalEVprod";
import CoalTypeEmission from "./sections/CoalTypeEmission";
import EmissionProductionTracker from "./sections/EmissionProductionTracker";
import Suggestion from "./sections/Suggestion";

export default function Home() {
  return (
    <>
      <Landing />
      {/*<Statistics /> */}
      {/*<Hotspots /> */}
      <Insights />
      {/* <Hotspots /> */}
      <Prediction />
      {/* <Alerts /> */}
      <CoalTypeEmission />
      <TotalEVprod />
      <TotalEmissions />
      <EmissionProductionTracker />
      <h1>Suggestion</h1>
      <Suggestion/>
    </>
  );
}
