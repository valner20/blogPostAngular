import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink

  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  @Input() username!: string | null;
  @Input() logged!: boolean;
  @Output() logout = new EventEmitter<void>();
  @Input() logouted = false
  show = false
  @Input() disable = false
  onLogout() {
    this.disable = true
    this.logout.emit();
  }
}

