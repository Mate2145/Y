import {Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MenubarComponent} from "../menubar/menubar.component";
import {NgForOf, NgIf} from "@angular/common";
import {SendTweetComponent} from "../shared/send-tweet/send-tweet.component";
import {SideCardComponent} from "../shared/side-card/side-card.component";
import {TweetCardComponent} from "../shared/tweet-card/tweet-card.component";
import {Tweet} from "../shared/model/Tweet";
import {AuthService} from "../shared/services/auth.service";
import {TweetService} from "../shared/services/feed.service";
import {UserService} from "../shared/services/user.service";
import {Router} from "@angular/router";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {User} from "../shared/model/User";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [
    MatButton,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    MatIcon,
    MatListItem,
    MatNavList,
    MenubarComponent,
    NgForOf,
    NgIf,
    SendTweetComponent,
    SideCardComponent,
    TweetCardComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.css'
})
export class ProfilesComponent implements OnInit{

  userList:User[] = []
  isAdminUser: boolean = false

  constructor(
    private authService: AuthService,
    private feedService: TweetService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isAdmin()
    this.getAllUsers()
  }



  getAllUsers(){
    this.userService.getAllUsers().subscribe({
      next:(data) =>{
          console.log(data)
          this.userList = data
      },error: (error) =>{
        console.log(error)
      }
    })
  }

  isAdmin(){
    this.userService.isAdminbyId().subscribe({
      next: (data: boolean) =>{
        console.log("ADMIN?" + data)
        if (data){
          console.log("ADMIN VOK")
        }
        this.isAdminUser = data;
      },error: (error) =>{

      }
    })
  }

  logout() {
    this.authService.logout().subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigateByUrl('/login');
      }, error: (err) => {
        console.log(err);
      }
    });
  }


  navigate(url:string){
    this.router.navigateByUrl(url)
  }

  deleteUser(userId: string){
    this.userService.deleteUser(userId).subscribe({
      next: (data) =>{
        console.log(data)
        console.log("Torlom?")
        this.getAllUsers()
      },error: (error) =>{
        console.log(error)
      }
    })
  }

  openDeleteConfirmDialog(userId:string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this user?',
        submitBtnText: 'Delete',
        tweetId: userId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(userId)
        this.deleteUser(userId)
      }
    });
  }
}
