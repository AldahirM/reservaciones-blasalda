import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Roles } from '../../../constants/Roles';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  username: string | null = null;
  showMenuAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    if (this.authService.hasRole(Roles.ADMIN)) {
      this.showMenuAdmin = true;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
