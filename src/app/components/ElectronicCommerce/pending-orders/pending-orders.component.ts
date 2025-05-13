import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.scss'],
  standalone: true,
  imports: []
})
export class PendingOrdersComponent implements OnInit {

  // Datos de las órdenes pendientes con información adecuada para un entorno peruano
  orders = [
    {
      id: 1, 
      customerName: 'Carlos Pérez', 
      contactNumber: '987-654-321',
      product: 'Plátano Isla',
      hijuelosQuantity: 15,
      address1: 'Jirón Dos de Mayo 123',
      address2: '',
      city: 'Tingo María',
      state: 'Huánuco',
      zip: '10121',
      country: 'Perú',
      deliveryDate: '2024-09-10',
      totalAmount: 450, 
      status: 'Pendiente'
    },
    {
      id: 2, 
      customerName: 'María López', 
      contactNumber: '987-321-654',
      product: 'Plátano Bellaco',
      hijuelosQuantity: 25,
      address1: 'Av. Universitaria 456',
      address2: 'Depto 304',
      city: 'Lima',
      state: 'Lima',
      zip: '15074',
      country: 'Perú',
      deliveryDate: '2024-09-12',
      totalAmount: 750, 
      status: 'Pendiente'
    },
    {
      id: 3, 
      customerName: 'José García', 
      contactNumber: '945-876-123',
      product: 'Plátano Seda',
      hijuelosQuantity: 20,
      address1: 'Calle Las Flores 789',
      address2: '',
      city: 'Tingo María',
      state: 'Huánuco',
      zip: '10121',
      country: 'Perú',
      deliveryDate: '2024-09-15',
      totalAmount: 600, 
      status: 'Pendiente'
    },
    {
      id: 4, 
      customerName: 'Ana Torres', 
      contactNumber: '912-345-678',
      product: 'Banano de Exportación',
      hijuelosQuantity: 30,
      address1: 'Jirón Puno 123',
      address2: '',
      city: 'Lima',
      state: 'Lima',
      zip: '15001',
      country: 'Perú',
      deliveryDate: '2024-09-20',
      totalAmount: 900, 
      status: 'Pendiente'
    },
    {
      id: 5, 
      customerName: 'Luis Fernández', 
      contactNumber: '944-555-666',
      product: 'Plátano Cavendish',
      hijuelosQuantity: 40,
      address1: 'Av. Circunvalación 1024',
      address2: '',
      city: 'Huánuco',
      state: 'Huánuco',
      zip: '10000',
      country: 'Perú',
      deliveryDate: '2024-09-22',
      totalAmount: 1200, 
      status: 'Pendiente'
    },
  ];

  ngOnInit() {
    $(document).ready(() => {
      $('#pendingOrdersTable').DataTable({
        data: this.orders,
        "pageLength": 5,
        columns: [
          { title: "ID de Orden", data: "id" },
          { title: "Nombre del Comprador", data: "customerName" },
          { title: "Número de Contacto", data: "contactNumber" },
          { title: "Producto", data: "product" },
          { title: "Número de Hijuelos", data: "hijuelosQuantity" },
          { title: "Dirección de Entrega 1", data: "address1" },
          { title: "Dirección de Entrega 2", data: "address2" },
          { title: "Ciudad", data: "city" },
          { title: "Estado", data: "state" },
          { title: "Código Postal", data: "zip" },
          { title: "País", data: "country" },
          { title: "Fecha de Entrega", data: "deliveryDate" },
          { title: "Precio Total de Venta (S/.)", data: "totalAmount" },
          { title: "Estado", data: "status" },
          {
            title: "Acciones",
            data: null,
            render: () => {
              return `
                <button class="btn btn-primary btn-sm">Editar</button>
                <button class="btn btn-info btn-sm">Ver</button>
                <button class="btn btn-danger btn-sm">Cancelar</button>
              `;
            }
          }
        ],
        responsive: true,
        dom: 'Bfrtip',
        buttons: [{
          extend: 'collection',
          text: 'Reportes',
          buttons: [{
              extend: 'copy',
              text: 'Copiar'
          }, {
              extend: 'pdf',
              text: 'PDF'
              ,customize: (doc: any) => {
                doc.pageSize = 'A3';  
                doc.pageMargins = [20, 20, 20, 20];  
                doc.defaultStyle.fontSize = 8;             
                if (doc.content[1] && doc.content[1].table) {
                  doc.content[1].table.widths = Array(doc.content[1].table.body[0].length).fill('auto');
                }
              },exportOptions: {
                columns: ':not(:last-child)'  
              }
              
          }, {
              extend: 'csv',
              text: 'CSV',
              exportOptions: {
                columns: ':not(:last-child)'  
              }
          }, {
              extend: 'excel',
              text: 'Excel',
              exportOptions: {
                columns: ':not(:last-child)'  
              }
          }, {
              extend: 'print',
              text: 'Imprimir',
              exportOptions: {
                columns: ':not(:last-child)'  
              }
          }]
        }, {
          extend: 'colvis',
          text: 'Visibilidad de Columnas',
          collectionLayout: 'fixed three-column'
        }]
      });
    });
  }
}
