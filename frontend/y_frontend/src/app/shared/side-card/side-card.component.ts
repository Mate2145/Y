import { Component } from '@angular/core';
import { MaterialModule } from '../../material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'side-card',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './side-card.component.html',
  styleUrl: './side-card.component.css'
})
export class SideCardComponent {

}
