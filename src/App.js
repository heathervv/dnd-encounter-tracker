import { Routes, Route } from "react-router-dom";

import Layout from './containers/layout/layout'
import Home from './containers/home/home'
import CombatTracker from './containers/combat-tracker/combat-tracker'
import Monsters from './containers/monsters/monsters'
import ModifyMonster from './containers/modify-monster/modify-monster'
import ViewMonster from './containers/view-monster/view-monster'
import ModifyEncounter from './containers/modify-encounter/modify-encounter'
import ViewEncounter from './containers/view-encounter/view-encounter'

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
    </Route>
  </Routes>
)

export default App;
