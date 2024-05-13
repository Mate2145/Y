import {Component, OnInit} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {Router, RouterOutlet} from '@angular/router';
import { MaterialModule } from '../material-module';
import {error} from "console";
import {User} from "../shared/model/User";
import {UserService} from "../shared/services/user.service";

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MaterialModule,
    RouterOutlet
  ],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.css'
})
export class MenubarComponent implements OnInit{

  badgevisible = false;
  badgevisibility() {
    this.badgevisible = true;
  }

  constructor(
    private userService:UserService,
    private router:Router
  ) {
  }


  toMyProfile(){
    this.userService.getUserId().subscribe({
      next: (data:any) =>{
        console.log(data)
        this.navigate(`/profile/${data._id}`)
      },error: (error) =>{
        console.log(error)
      }
    })
  }

  private navigate(s: string) {
    this.router.navigateByUrl(s);
  }

  ngOnInit(): void {
  }
}
