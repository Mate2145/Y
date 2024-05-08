import { Component, OnInit } from '@angular/core';
import { MenubarComponent } from '../menubar/menubar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [
    MenubarComponent,
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css'
})
export class DisplayComponent implements OnInit{

  constructor(
    private authService: AuthService
  ){

  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
