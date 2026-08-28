import { Component, OnInit } from '@angular/core';
import { ReservacionesService } from '../../services/reservaciones.service';
import { ReservacionResponse } from '../../models/Reservaciones.model';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservaciones',
  standalone: false,
  templateUrl: './reservaciones.component.html',
  styleUrl: './reservaciones.component.css',
})
export class ReservacionesComponent implements OnInit {
  reservaciones: ReservacionResponse[] = [];

  idHuesped: number | null = null;

  tipoAcion: string = 'Todas las reservaciones';

  isFromHuesped: boolean = false;

  ngOnInit(): void {
    this.idHuesped = Number(this.route.snapshot.paramMap.get('id'));
    this.isFromHuesped = !!this.idHuesped;
    if (this.isFromHuesped) {
    } else {
      this.listarReservaciones();
    }
  }

  constructor(
    private route: ActivatedRoute,
    private reservacionesService: ReservacionesService,
  ) { }

  listarReservaciones(): void {
    this.reservacionesService.getReservaciones().subscribe({
      next: (resp) => {

        console.log(resp);
        this.reservaciones = resp;
      },
      error: (error) => {
        console.log(error);
        Swal.fire('Error', 'No se pudieron cargar las reservaciones', 'error');
      },
    });
  }

  // Contabiliza las reservaciones activas en estado CONFIRMADA (ID 1)
  get proximasEntradasCount(): number {
    return this.reservaciones.filter(r => r.idEstadoReserva === 1).length;
  }

  // Contabiliza las reservaciones en estado EN_CURSO (ID 2)
  get habitacionesOcupadasCount(): number {
    return this.reservaciones.filter(r => r.idEstadoReserva === 2).length;
  }

  // Total de reservaciones activas recibidas
  get totalReservacionesCount(): number {
    return this.reservaciones.length;
  }
}
