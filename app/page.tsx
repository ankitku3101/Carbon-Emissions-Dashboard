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

export default function Home() {
  return (
    <>
      <Landing />
      <Statistics />
      {/* <Hotspots /> */}
      <Prediction />
      {/* <Alerts /> */}
      <CoalTypeEmission />
      <TotalEVprod />
      <TotalEmissions />
      <EmissionProductionTracker />
    </>
  );
}
