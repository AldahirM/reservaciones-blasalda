import { Component, OnInit } from '@angular/core';
import { HabitacionesService } from '../../services/habitaciones.service';
import { HabitacionResponse } from '../../models/Habitacion.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-habitaciones',
  standalone: false,
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})
export class HabitacionesComponent implements OnInit {
  habitaciones: HabitacionResponse[] = [];

  constructor(private habitacionesService: HabitacionesService) { }

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  cargarHabitaciones(): void {
    this.habitacionesService.getHabitaciones().subscribe({
      next: (data) => {
        this.habitaciones = data;
      },
      error: (err) => {
        console.error('Error al cargar habitaciones:', err);
        Swal.fire('Error', 'No se pudieron cargar las habitaciones', 'error');
      }
    });
  }

  eliminarHabitacion(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bc6b43',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.habitacionesService.deleteHabitacion(id).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'La habitación ha sido eliminada correctamente', 'success');
            this.cargarHabitaciones();
          },
          error: (err) => {
            console.error('Error al eliminar habitación:', err);
            Swal.fire('Error', 'No se pudo eliminar la habitación', 'error');
          }
        });
      }
    });
  }
}
