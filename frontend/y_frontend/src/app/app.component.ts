import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MenubarComponent } from './menubar/menubar.component';
import { MaterialModule } from './material-module';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/services/auth.service';
import {UserService} from "./shared/services/user.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports:
   [RouterOutlet,
    CommonModule,
    LoginComponent,
    MenubarComponent,
    MaterialModule,
    SignupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Y';
}
