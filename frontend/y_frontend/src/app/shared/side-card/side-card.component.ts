import {Component, OnInit} from '@angular/core';
import {MaterialModule} from '../../material-module';
import {CommonModule} from '@angular/common';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'side-card',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './side-card.component.html',
  styleUrl: './side-card.component.css'
})
export class SideCardComponent implements OnInit{
  userList:any[] = []
  constructor(
    private userService:UserService,
    private router:Router
  ) {
  }



  getAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        // Shuffle the user list
        // Get the first 3 users from the shuffled list
        this.userList = data.slice(0, 3);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  ngOnInit(): void {
    this.getAllUsers()
  }

  navigate(s:string) {
    this.router.navigateByUrl(s)
  }
}
