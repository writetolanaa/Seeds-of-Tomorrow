import { Switch, Route, Router as WouterRouter } from "wouter";
import { GameProvider } from "@/context/GameContext";
import TitleScreen from "@/pages/TitleScreen";
import GameWorld from "@/pages/GameWorld";
import PuzzleScreen from "@/pages/PuzzleScreen";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TitleScreen} />
      <Route path="/world" component={GameWorld} />
      <Route path="/map" component={GameWorld} />
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
