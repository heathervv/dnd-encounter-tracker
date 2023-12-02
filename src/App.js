import { Routes, Route } from "react-router-dom";

import Layout from './containers/layout/layout'
import Home from './containers/home/home'
import CombatTracker from './containers/combat-tracker/combat-tracker'
import Monsters from './containers/monsters/monsters'
import ModifyMonster from './containers/modify-monster/modify-monster'
import ViewMonster from './containers/view-monster/view-monster'

const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/combat-tracker" element={<CombatTracker />} />
      <Route path="/monsters" element={<Monsters />} />
      <Route path="/monster/create" element={<ModifyMonster />} />
      <Route path="/monster/:id" element={<ViewMonster />} />
      <Route path="/monster/:id/edit" element={<ModifyMonster isEdit />} />
    </Route>
  </Routes>
)

export default App;
