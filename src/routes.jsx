import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './pages/App';
import List from './pages/List';
import GameWeek from './pages/GameWeek';
import Rankings from './pages/Rankings';
import Picks from './pages/Picks';
import Standings from './pages/Standings';
import Teams from './pages/Teams';
import TeamSchedules from './pages/TeamSchedules';


const routes = (
    <Route path="/" component={ App }>
        <IndexRoute path="/games" component={ GameWeek } />
        <Route path="/games/:week" component={ GameWeek } />
        <Route path="/teams" component={ Teams } />
        <Route path="/teams/:team" component={ TeamSchedules } />
        <Route path="/standings" component={ Standings } />
        <Route path="/rankings" component={ Rankings } />
        <Route path="/rankings/:week" component={ Rankings } />
        <Route path="/picks" component={ Picks } />
        <Route path="/picks/:week" component={ Picks } />
    </Route>
);

export default routes;
