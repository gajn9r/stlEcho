import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { PlantListComponent } from './components/plant-list/plant-list.component';
import { PlantDetailComponent } from './components/plant-detail/plant-detail.component';

// Services
import { PlantService } from './services/plant.service';

@NgModule({
  declarations: [
    AppComponent,
    PlantListComponent,
    PlantDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [PlantService],
  bootstrap: [AppComponent]
})
export class AppModule { }
