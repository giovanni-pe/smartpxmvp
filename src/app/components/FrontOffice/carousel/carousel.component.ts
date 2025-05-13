import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
  imports: [CommonModule] 
})
export class CarouselComponent implements OnInit {
  slides = [
    {
      image: 'assets/silde1.png',
      title: 'Innovación en Agricultura',
      description: 'Mejoramos la producción de hijuelos con tecnología IoT'
    },
    {
      image: 'assets/silde2.png',
      title: 'Monitoreo Inteligente',
      description: 'Supervisa tus cultivos en tiempo real con nuestra app'
    },
    {
      image: 'assets/silde3.png',
      title: 'Sostenibilidad',
      description: 'Optimiza recursos y asegura la calidad de tu producción'
    }
  ];

  currentSlide = 0;
  slideInterval: any;

  ngOnInit(): void {
    this.startSlideShow();
  }

  startSlideShow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambia cada 5 segundos
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide > 0) ? this.currentSlide - 1 : this.slides.length - 1;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide < this.slides.length - 1) ? this.currentSlide + 1 : 0;
  }

  setSlide(index: number) {
    this.currentSlide = index;
    clearInterval(this.slideInterval); // Resetea el temporizador cuando el usuario selecciona una diapositiva
    this.startSlideShow(); // Reinicia el temporizador después de seleccionar una diapositiva
  }
}

