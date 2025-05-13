import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-real-time-walk-view',
  templateUrl: './real-time-walk-view.component.html',
  styleUrls: ['./real-time-walk-view.component.css']
})
export class RealTimeWalkViewComponent implements OnInit, OnDestroy, AfterViewInit {

  private map: mapboxgl.Map | undefined;

  constructor() { }

  ngOnInit(): void {
    (mapboxgl as typeof mapboxgl & { accessToken: string }).accessToken = environment.mapboxAccessToken; // Token de Mapbox
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    this.map = new mapboxgl.Map({
      container: 'map', // El contenedor del mapa
      style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
      center: [-75.9981, -8.9517], // Coordenadas de Tingo María
      zoom: 14, // Nivel de zoom
      pitch: 45, // Ángulo de la vista (perspectiva 3D)
      bearing: 0,
      antialias: true
    });

    // Agregar controles al mapa (zoom y geolocalización)
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    }));
  }
}
