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
}
