import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Pollinator {
  common_name: string;
  scientific_order: string;
  family: string;
  description: string;
}

export interface Plant {
  _id?: string;
  botanical_name: string;
  common_name: string;
  plant_type: string;
  family: string;
  description?: string;
  image?: string;
  url?: string;
  height?: string;
  bloom_time?: string;
  soil_type?: string;
  pollinators?: Pollinator[];
  light_requirements?: {
    full_sun?: boolean;
    part_shade?: boolean;
    full_shade?: boolean;
  };
  garden_uses?: {
    rain_garden_wet?: boolean;
    rain_garden_dry?: boolean;
    bioswale?: boolean;
    butterfly_garden?: boolean;
    wildlife_keystone?: boolean;
    ground_cover?: boolean;
  };
  morphological_traits?: any;
  environmental_impact?: any;
  ethnobotanical_uses?: string[];
  medicinal_properties?: string[];
  source_research?: Array<{ title: string; url: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Plant endpoints
  getAllPlants(): Observable<Plant[]> {
    return this.http.get<Plant[]>(`${this.apiUrl}/plants`);
  }

  getPlantById(id: string): Observable<Plant> {
    return this.http.get<Plant>(`${this.apiUrl}/plants/${id}`);
  }

  getPlantsWithPagination(page: number, limit: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/plants/paginated`, { params });
  }

  searchPlants(query: string, plantType?: string, soilType?: string, light?: string): Observable<Plant[]> {
    let params = new HttpParams().set('query', query);
    if (plantType) params = params.set('plant_type', plantType);
    if (soilType) params = params.set('soil_type', soilType);
    if (light) params = params.set('light', light);
    return this.http.get<Plant[]>(`${this.apiUrl}/plants/search`, { params });
  }

  getPlantsBySoilType(soilType: string): Observable<Plant[]> {
    return this.http.get<Plant[]>(`${this.apiUrl}/plants/soil-type/${soilType}`);
  }

  getPlantByBotanicalName(name: string): Observable<Plant> {
    return this.http.get<Plant>(`${this.apiUrl}/plants/botanical-name/${name}`);
  }

  createPlant(plant: Plant): Observable<Plant> {
    return this.http.post<Plant>(`${this.apiUrl}/plants`, plant);
  }

  updatePlant(id: string, plant: Plant): Observable<Plant> {
    return this.http.put<Plant>(`${this.apiUrl}/plants/${id}`, plant);
  }

  deletePlant(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/plants/${id}`);
  }

  // Pollinator endpoints
  getPlantsByPollinator(pollinator: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pollinators/type/${pollinator}`);
  }

  getAllPollinators(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pollinators`);
  }

  getKeystoneWildlifePlants(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pollinators/keystone-wildlife`);
  }

  getButterflyGardenPlants(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pollinators/butterfly-garden`);
  }

  // Morphology endpoints
  getSimilarPlants(plantId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/morphology/similar/${plantId}`);
  }

  getPlantsByFlowerColor(color: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/morphology/flower-color/${color}`);
  }

  getAllFlowerColors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/morphology/flower-colors`);
  }

  getPlantsByBloomTime(bloomTime: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/morphology/bloom-time/${bloomTime}`);
  }

  // Environmental endpoints
  getConservationPriority(): Observable<any> {
    return this.http.get(`${this.apiUrl}/environmental/conservation-priority`);
  }

  getWaterConservationPlants(): Observable<any> {
    return this.http.get(`${this.apiUrl}/environmental/water-conservation`);
  }

  getPlantsByHabitatUse(use: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/environmental/habitat-use/${use}`);
  }

  getAllEcologicalImportances(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/environmental/ecological-importance`);
  }

  // Research endpoints
  getPlantResearch(plantId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/research/${plantId}`);
  }

  getPlantFullProfile(plantId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/research/profile/${plantId}`);
  }

  getAllMedicinalProperties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/research/medicinal-properties`);
  }

  searchResearch(keyword: string): Observable<any> {
    let params = new HttpParams().set('keyword', keyword);
    return this.http.get(`${this.apiUrl}/research/search`, { params });
  }

  getResearchSources(plantId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/research/sources/${plantId}`);
  }

  // Advanced filtering endpoint combining multiple filters
  getAdvancedFilter(query?: string, plantType?: string, soilType?: string, light?: string, family?: string, pollinator?: string): Observable<any> {
    let params = new HttpParams();
    if (query) params = params.set('query', query);
    if (plantType) params = params.set('plantType', plantType);
    if (soilType) params = params.set('soilType', soilType);
    if (light) params = params.set('light', light);
    if (family) params = params.set('family', family);
    if (pollinator) params = params.set('pollinator', pollinator);
    return this.http.get(`${this.apiUrl}/research/filter`, { params });
  }
}
