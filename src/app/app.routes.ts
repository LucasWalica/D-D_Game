import { Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { EndGameComponent } from './components/end-game/end-game.component';
import { PartySelectionComponent } from './components/party-selection/party-selection.component';
import { DungeonComponent } from './components/dungeon/dungeon.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'party-selection',
    pathMatch: 'full',
  },
  {
    path: "map",
    component: MapComponent,
  },
  {
    path: 'party-selection',
    component: PartySelectionComponent,
  },
  {
    path: 'dungeon',
    component: DungeonComponent,
  },
  {
    path: 'end-game',
    component: EndGameComponent,
  },
  {
    path: '**',
    redirectTo: 'party-selection',
  },
];
