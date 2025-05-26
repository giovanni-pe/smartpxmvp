import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { INavData } from '@coreui/angular';

// Interfaz extendida
interface ExtendedNavData extends INavData {
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private userRole: string = 'guest';

  constructor(private translate: TranslateService) {
    this.loadUserFromStorage();
  }


  private loadUserFromStorage() {
    this.userRole = localStorage.getItem('userRole') || 'guest';
    console.log('User role loaded from storage:', this.userRole);
  }

  getNavItems(): ExtendedNavData[] {
    return [
      {
        name: "SmartPx",
        url: '/walkers',
        iconComponent: { name: 'cil-sun' }, // Icono de velocidad para representar un dashboard
        badge: {
          color: 'info',
          text: 'X'
        },
        roles: ['admin', 'client']
      },

      {
        name: "Mapa",
        url: '/base',
        iconComponent: { name: 'cilChartPie' }, // Icono de gráfica de pastel para representar monitoreo
        children: [
          {
            name: "Ver",
            url: '/sensor-monitoring',
            icon: 'nav-icon-bullet',
            roles: ['admin', 'User', 'Professor']
          },
        ],
        roles: ['admin', 'Professor', 'clients']
      },


      {
        name: "Paseos",
        url: '/base',
        iconComponent: { name: 'cilCursor' }, // Icono de cursor para representar interacción con sensores
        children: [
          {
            name: "ver",
            url: 'client-reservations',
            icon: 'nav-icon-bullet',
            roles: ['client']
          }, {
            name: "Nuevo paseo",
            url: 'walkers',
            icon: 'nav-icon-bullet',
            roles: ['client']
          },
        ],
        roles: ['admin', 'client']
      },


      // Dog walker
      {
        name: "Pasear",
        url: '/base',
        iconComponent: { name: 'cilCursor' }, // Icono de cursor para representar interacción con sensores
        children: [
          {
            name: "ver",
            url: 'walker-reservations',
            icon: 'nav-icon-bullet',
            roles: ['dog-walker']
          },
        ],
        roles: ['admin', 'dog_walker']
      },
      {
        name: "ganancias",
        url: '/walker-dashboard',
        iconComponent: { name: 'cilDollar' }, // Icono de cursor para representar interacción con sensores
        roles: ['admin', 'dog_walker']
      },
      {
        name: "Mis Peludos",
        url: '/base',
        iconComponent: { name: 'cilDog' }, // Icono principal: perro
        children: [
          {
            name: "Registrar",
            url: '/register-dogs',
            iconComponent: { name: 'cilAnimal' }, // Icono de agregar/registrar
            roles: ['admin', 'client']
          },
          {
            name: "Ver",
            url: '/list-dogs',
            iconComponent: { name: 'cilAnimal' }, // Icono de lista
            roles: ['admin', 'client']
          },
        ],
        roles: ['admin', 'client']
      },

      {
        name: "Reportes",
        url: 'reports',
        iconComponent: { name: 'cilChart' }, // Icono de gráfico para reportes
        badge: {
          color: 'info',
          text: 'NEW'
        },
        roles: ['admin', 'User']
      },

      {
        title: true,
        name: "Comercio",
        roles: ['User']
      },
      {
        name: "Pedidos",
        url: '/login',
        iconComponent: { name: 'cilBasket' }, // Icono de canasta para representar pedidos
        children: [
          {
            name: "Solicitud de Orden",
            url: '/banana-order',
            icon: 'nav-icon-bullet',
            roles: ['admin']
          },
          {
            name: "Pendientes",
            url: '/pending-orders',
            icon: 'nav-icon-bullet',
            roles: ['admin']
          },
          {
            name: "Completados",
            url: '/completed-orders',
            icon: 'nav-icon-bullet',
            roles: ['admin']
          },

        ],
        roles: ['admin', 'User']
      },
      {
        title: true,
        name: "Sobre Nosotros",
        class: 'mt-auto',
        roles: ['admin', 'Professor', 'User']
      },
      {
        name: "Info",
        url: 'https://smartpx.org/',
        iconComponent: { name: 'cilDescription' }, // Icono de descripción para la sección de información
        attributes: { target: '_blank' },
        roles: ['admin', 'dog_walker', 'client']
      }
    ].filter(item => this.isRoleAllowed(item));
  }

  private isRoleAllowed(navItem: ExtendedNavData): boolean {
    if (!navItem.roles) {
      return true;
    }
    return navItem.roles.includes(this.userRole);
  }
}
