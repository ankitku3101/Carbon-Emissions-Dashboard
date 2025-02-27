import Image from "next/image";
import Landing from "./sections/Landing";
import Statistics from "./sections/Statistics";
import Hotspots from "./sections/Hotspots";
import Prediction from "./sections/Prediction";
import Alerts from "./sections/Alerts";

export default function Home() {
  return (
    <>
      <Landing />
      <Statistics />
      <Hotspots />
      <Prediction />
      <Alerts />
    </>
  );
}
