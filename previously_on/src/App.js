import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Series from "./pages/Series/Series";
import Home from "./pages/Series/Home";
import DetailSeries from "./pages/Series/DetailSeries";
import EpisodeDetail from "./pages/Series/EpisodeDetail";
import Membre from "./pages/Membre/Membre";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />}>
          <Route path="/" element={<Series />} />
          <Route path="/seriesdetail/:id" element={<DetailSeries />} />
          <Route path="/episodedetail/:id" element={<EpisodeDetail />} />
          <Route path="/membre" element={<Membre />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
