import { Component, OnInit } from '@angular/core';
import { PlantService, Plant } from '../../services/plant.service';

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.css']
})
export class PlantListComponent implements OnInit {
  plants: Plant[] = [];
  filteredPlants: Plant[] = [];
  pollinators: any[] = [];
  selectedPollinator = '';
  pollinatorsLoading = false;
  pollinatorsError: string | null = null;
  selectedPlant: Plant | null = null;
  isPlantModalOpen = false;
  loading = false;
  error: string | null = null;
  
  // Filter options
  searchQuery = '';
  selectedSoilType = '';
  selectedPlantType = '';
  selectedLight = '';
  selectedFamily = '';
  
  soilTypes = ['dry', 'moist', 'wet'];
  plantTypes = ['Forb', 'Shrub', 'Grass', 'Vine', 'Tree', 'Fern'];
  lightOptions = ['full_sun', 'part_shade', 'full_shade'];
  families: string[] = [];

  constructor(private plantService: PlantService) { }

  ngOnInit(): void {
    this.loadPlants();
    this.loadPollinators();
  }

  loadPollinators(): void {
    this.pollinatorsLoading = true;
    this.pollinatorsError = null;

    this.plantService.getAllPollinators().subscribe({
      next: (data) => {
        this.pollinators = data.map((p: any) => ({
          name: p._id,
          scientific_order: p.scientific_order,
          family: p.family,
          description: p.description,
          plant_count: p.plant_count
        }));
        this.pollinatorsLoading = false;
      },
      error: (err) => {
        this.pollinatorsError = 'Failed to load pollinators';
        this.pollinatorsLoading = false;
        console.error(err);
      }
    });
  }

  loadPlants(): void {
    this.loading = true;
    this.error = null;
    
    this.plantService.getAllPlants().subscribe({
      next: (data) => {
        this.plants = data;
        this.filteredPlants = data;
        // Extract unique families
        const uniqueFamilies = [...new Set(data.map(p => p.family).filter(f => f))];
        this.families = uniqueFamilies.sort();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load plants';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  // Trigger search whenever any filter changes
  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    // If search query is empty and no other filters, show all plants
    if (!this.searchQuery.trim() && !this.selectedPlantType && !this.selectedSoilType && !this.selectedLight && !this.selectedFamily && !this.selectedPollinator) {
      this.filteredPlants = this.plants;
      return;
    }

    this.loading = true;
    this.error = null;

    // Use the advanced filter endpoint
    this.plantService.getAdvancedFilter(
      this.searchQuery,
      this.selectedPlantType,
      this.selectedSoilType,
      this.selectedLight,
      this.selectedFamily,
      this.selectedPollinator
    ).subscribe({
      next: (data) => {
        this.filteredPlants = data.plants || [];
        this.loading = false;
      },
      error: (err) => {
        // Fallback to local filtering if API fails
        this.filterLocally();
        this.loading = false;
      }
    });
  }

  // Fallback local filtering
  filterLocally(): void {
    this.filteredPlants = this.plants.filter(plant => {
      const matchesSearch = !this.searchQuery.trim() || 
        plant.botanical_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        plant.common_name.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesPlantType = !this.selectedPlantType || plant.plant_type === this.selectedPlantType;
      
      const matchesSoilType = !this.selectedSoilType || plant.soil_type === this.selectedSoilType;
      
      const matchesLight = !this.selectedLight || (
        (this.selectedLight === 'full_sun' && plant.light_requirements?.full_sun) ||
        (this.selectedLight === 'part_shade' && plant.light_requirements?.part_shade) ||
        (this.selectedLight === 'full_shade' && plant.light_requirements?.full_shade)
      );

      const matchesFamily = !this.selectedFamily || plant.family === this.selectedFamily;

      const matchesPollinator = !this.selectedPollinator || !!plant.pollinators?.some(
        (pollinator) => pollinator.common_name.toLowerCase() === this.selectedPollinator.toLowerCase()
      );

      return matchesSearch && matchesPlantType && matchesSoilType && matchesLight && matchesFamily && matchesPollinator;
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedSoilType = '';
    this.selectedPlantType = '';
    this.selectedLight = '';
    this.selectedFamily = '';
    this.selectedPollinator = '';
    this.filteredPlants = this.plants;
    this.error = null;
  }

  selectPollinator(pollinator: string): void {
    this.selectedPollinator = this.selectedPollinator === pollinator ? '' : pollinator;
    this.applyFilters();
  }

  removeSearchFilter(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  removeTypeFilter(): void {
    this.selectedPlantType = '';
    this.applyFilters();
  }

  removeSoilFilter(): void {
    this.selectedSoilType = '';
    this.applyFilters();
  }

  removeLightFilter(): void {
    this.selectedLight = '';
    this.applyFilters();
  }

  removeFamilyFilter(): void {
    this.selectedFamily = '';
    this.applyFilters();
  }

  removePollinatorFilter(): void {
    this.selectedPollinator = '';
    this.applyFilters();
  }

  getDescription(pollinator: string): string {
    const pollinatorDescriptions: { [key: string]: string } = {
      bees: 'Provide essential pollination for many native plants and crops',
      butterflies: 'Beautiful pollinators crucial for plant reproduction',
      hummingbirds: 'Nectar-feeding birds attracted to tubular flowers',
      moths: 'Nocturnal pollinators for evening-blooming plants',
      beetles: 'Ancient pollinators important for many flowers',
      flies: 'Often-overlooked pollinators for many garden plants',
      wasps: 'Beneficial pollinators often overlooked in gardens',
      ants: 'Supporting ecosystem pollinators in native gardens',
      wind: 'Pollinated by wind currents, no visual flowers needed'
    };
    return pollinatorDescriptions[pollinator] || 'Important pollinator for native plants';
  }

  getPollinatorIcon(pollinator: string): string {
    const icons: { [key: string]: string } = {
      bees: '🐝',
      butterflies: '🦋',
      hummingbirds: '🐦',
      moths: '🌙',
      beetles: '🪲',
      flies: '🪰',
      wasps: '🐝',
      ants: '🐜',
      wind: '💨'
    };
    return icons[pollinator] || '🌸';
  }

  getPollinatorNames(plant: Plant): string {
    if (!plant.pollinators || plant.pollinators.length === 0) {
      return '';
    }
    return plant.pollinators.map(p => p.common_name).join(', ');
  }

  openPlantModal(plant: Plant): void {
    this.selectedPlant = plant;
    this.isPlantModalOpen = true;
  }

  closePlantModal(): void {
    this.isPlantModalOpen = false;
    this.selectedPlant = null;
  }

  getTaxonomicPollinatorDetails(plant: Plant): string[] {
    if (!plant.pollinators || plant.pollinators.length === 0) {
      return [];
    }

    return plant.pollinators.map((pollinator) => {
      const taxonomy = this.resolvePollinatorTaxonomy(pollinator.common_name, pollinator.scientific_order, pollinator.family);
      return `${pollinator.common_name}: Order ${taxonomy.order}; Family ${taxonomy.family}`;
    });
  }

  private resolvePollinatorTaxonomy(commonName: string, scientificOrder?: string, family?: string): { order: string; family: string } {
    const cleanedName = (commonName || '').trim().toLowerCase();

    if (scientificOrder && family) {
      return { order: scientificOrder, family };
    }

    const fallbackTaxonomy: Record<string, { order: string; family: string }> = {
      bees: { order: 'Hymenoptera', family: 'Apidae and related bee families' },
      butterflies: { order: 'Lepidoptera', family: 'Papilionidae, Pieridae, Nymphalidae, Lycaenidae' },
      moths: { order: 'Lepidoptera', family: 'Noctuidae, Geometridae, Sphingidae' },
      beetles: { order: 'Coleoptera', family: 'Cerambycidae, Meloidae, Scarabaeidae and others' },
      wasps: { order: 'Hymenoptera', family: 'Vespidae, Sphecidae and related wasp families' },
      flies: { order: 'Diptera', family: 'Syrphidae and related fly families' },
      hummingbirds: { order: 'Apodiformes', family: 'Trochilidae' },
      ants: { order: 'Hymenoptera', family: 'Formicidae' },
      wind: { order: 'Anemophily', family: 'N/A' }
    };

    const fallback = fallbackTaxonomy[cleanedName];

    return {
      order: scientificOrder || fallback?.order || 'Unknown',
      family: family || fallback?.family || 'Unknown'
    };
  }
}
