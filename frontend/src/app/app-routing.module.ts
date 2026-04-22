import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlantListComponent } from './components/plant-list/plant-list.component';
import { PlantDetailComponent } from './components/plant-detail/plant-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/plants', pathMatch: 'full' },
  { path: 'plants', component: PlantListComponent },
  { path: 'plant/:id', component: PlantDetailComponent },
  // Add more routes as components are developed
  // { path: 'environmental', component: EnvironmentalImpactComponent },
  // { path: 'research', component: ResearchComponent },
  // { path: 'garden-design', component: GardenDesignComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
