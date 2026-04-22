import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlantService, Plant } from '../../services/plant.service';

@Component({
  selector: 'app-plant-detail',
  templateUrl: './plant-detail.component.html',
  styleUrls: ['./plant-detail.component.css']
})
export class PlantDetailComponent implements OnInit {
  plant: Plant | null = null;
  similarPlants: Plant[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private plantService: PlantService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadPlantDetails(params['id']);
      }
    });
  }

  loadPlantDetails(plantId: string): void {
    this.loading = true;
    this.error = null;

    this.plantService.getPlantFullProfile(plantId).subscribe({
      next: (data) => {
        this.plant = data;
        this.loadSimilarPlants(plantId);
      },
      error: (err) => {
        this.error = 'Failed to load plant details';
        this.loading = false;
      }
    });
  }

  loadSimilarPlants(plantId: string): void {
    this.plantService.getSimilarPlants(plantId).subscribe({
      next: (data) => {
        this.similarPlants = data.similar_plants || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  get lightRequirements(): string[] {
    if (!this.plant?.light_requirements) return [];
    const lights = [];
    if (this.plant.light_requirements.full_sun) lights.push('Full Sun');
    if (this.plant.light_requirements.part_shade) lights.push('Part Shade');
    if (this.plant.light_requirements.full_shade) lights.push('Full Shade');
    return lights;
  }

  get gardenUses(): string[] {
    if (!this.plant?.garden_uses) return [];
    const uses = [];
    if (this.plant.garden_uses.rain_garden_wet) uses.push('Rain Garden (Wet)');
    if (this.plant.garden_uses.rain_garden_dry) uses.push('Rain Garden (Dry)');
    if (this.plant.garden_uses.bioswale) uses.push('Bioswale');
    if (this.plant.garden_uses.butterfly_garden) uses.push('Butterfly Garden');
    if (this.plant.garden_uses.wildlife_keystone) uses.push('Wildlife Keystone');
    if (this.plant.garden_uses.ground_cover) uses.push('Ground Cover');
    return uses;
  }
}
