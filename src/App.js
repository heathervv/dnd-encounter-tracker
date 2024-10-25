import { Routes, Route } from "react-router-dom";

import Layout from './containers/layout/layout'
import Home from './containers/home/home'
import CombatTracker from './containers/combat-tracker/combat-tracker'
import Monsters from './containers/monsters/monsters'
import ModifyMonster from './containers/modify-monster/modify-monster'
import ViewMonster from './containers/view-monster/view-monster'
import ModifyEncounter from './containers/modify-encounter/modify-encounter'
import ViewEncounter from './containers/view-encounter/view-encounter'
import Players from './containers/players/players'
import ModifyPlayer from './containers/modify-player/modify-player'
import ViewPlayer from './containers/view-player/view-player'
import ManageData from "./containers/manage-data/manage-data"

const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/encounter/create" element={<ModifyEncounter />} />
      <Route path="/encounter/:id" element={<ViewEncounter />} />
      <Route path="/encounter/:id/edit" element={<ModifyEncounter isEdit />} />
      <Route path="/combat-tracker/:encounterId" element={<CombatTracker />} />
      <Route path="/monsters" element={<Monsters />} />
      <Route path="/monster/create" element={<ModifyMonster />} />
      <Route path="/monster/:id" element={<ViewMonster />} />
      <Route path="/monster/:id/edit" element={<ModifyMonster isEdit />} />
      <Route path="/players" element={<Players />} />
      <Route path="/player/create" element={<ModifyPlayer />} />
      <Route path="/player/:id" element={<ViewPlayer />} />
      <Route path="/player/:id/edit" element={<ModifyPlayer isEdit />} />
      <Route path="/manage-data" element={<ManageData />} />
    </Route>
  </Routes>
)

export default App;
