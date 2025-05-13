import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-completed-orders',
  templateUrl: './completed-orders.component.html',
  styleUrls: ['./completed-orders.component.scss'],
  standalone: true,
  imports: []
})
export class CompletedOrdersComponent implements OnInit {

  // Datos de órdenes completadas
  orders = [
    { id: 1, customerName: 'Carlos Pérez', orderDate: '2024-08-25', totalAmount: 150, status: 'Completado' },
    { id: 2, customerName: 'María López', orderDate: '2024-08-26', totalAmount: 200, status: 'Completado' },
    { id: 3, customerName: 'José García', orderDate: '2024-08-27', totalAmount: 350, status: 'Completado' },
    { id: 4, customerName: 'Ana Torres', orderDate: '2024-08-28', totalAmount: 400, status: 'Completado' },
    { id: 5, customerName: 'Luis Fernández', orderDate: '2024-08-29', totalAmount: 250, status: 'Completado' },
  ];

  ngOnInit() {
    $(document).ready(() => {
      $('#completedOrdersTable').DataTable({
        data: this.orders,
        "pageLength": 5,
        columns: [
          { title: "ID de Orden", data: "id" },
          { title: "Nombre del Cliente", data: "customerName" },
          { title: "Fecha de la Orden", data: "orderDate" },
          { title: "Monto Total (S/.)", data: "totalAmount" },
          {
            title: "Acciones",
            data: null,
            render: () => {
              return `
                <button class="btn btn-info btn-sm">Ver</button>
                <button class="btn btn-secondary btn-sm" disabled>Completado</button>
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
          }, {
              extend: 'csv',
              text: 'CSV'
          }, {
              extend: 'excel',
              text: 'Excel'
          }, {
              extend: 'print',
              text: 'Imprimir'
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
