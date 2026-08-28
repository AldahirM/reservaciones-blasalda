import { Component, OnInit } from '@angular/core';
import { HuespedResponse } from '../../models/Huesped.model';
import { HuespedesService } from '../../services/huespedes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-huespedes',
  standalone: false,
  templateUrl: './huespedes.component.html',
  styleUrl: './huespedes.component.css',
})
export class HuespedesComponent implements OnInit {
  huespedes: HuespedResponse[] = [];

  constructor(private huespedService: HuespedesService) {}
  ngOnInit(): void {
    this.listarHuespedes();
  }

  listarHuespedes(): void {
    this.huespedService.getHuespedes().subscribe({
      next: (resp) => {
        this.huespedes = resp;
      },
      error: (error) => {
        console.log(error);
        Swal.fire('Error', 'No se pudieron cargar los huéspedes', 'error');
      },
    });
  }

  eliminarHuesped(id: number, nombre: string): void {
    Swal.fire({
      title: 'Are you sure about that?',
      text: `El huesped ${nombre} será eliminado permamentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.huespedService.deleteHuesped(id).subscribe({
          next: () => {
            this.huespedes = this.huespedes.filter(
              (h) => h.id !== id
            );
            Swal.fire(
              'Eliminado',
              `Huesped ${nombre} eliminado correctamente`,
              'success',
            );
          },
          error: () =>{
            Swal.fire(
              'Error',
              `Hubo un error al eliminar el huesped`,
              'error',
            );
          }
        });
      }
    });
  }
}
