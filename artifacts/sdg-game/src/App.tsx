import { Switch, Route, Router as WouterRouter } from "wouter";
import { GameProvider } from "@/context/GameContext";
import TitleScreen from "@/pages/TitleScreen";
import WorldMap from "@/pages/WorldMap";
import ZoneInterior from "@/pages/ZoneInterior";
import PuzzleScreen from "@/pages/PuzzleScreen";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TitleScreen} />
      <Route path="/map" component={WorldMap} />
      <Route path="/zone/:id" component={ZoneInterior} />
      <Route path="/puzzle/:id" component={PuzzleScreen} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <GameProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </GameProvider>
  );
}

export default App;
