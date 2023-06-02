import logo from "./logo.svg";
import "./App.css";

import TileSet from "./components/TileSet";
import Grid from "./components/Grid";

export default function App() {
  return (
    <div className="App">
      <main>
        <TileSet></TileSet>
        <TileSet></TileSet>
        <Grid></Grid>
      </main>
    </div>
  );
}
