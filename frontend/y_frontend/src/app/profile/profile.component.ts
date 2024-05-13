import {Component, OnInit} from '@angular/core';
import {MaterialModule} from "../material-module";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {Tweet} from "../shared/model/Tweet";
import {TweetService} from "../shared/services/feed.service";
import {CommonModule} from "@angular/common";
import {MenubarComponent} from "../menubar/menubar.component";
import {SendTweetComponent} from "../shared/send-tweet/send-tweet.component";
import {SideCardComponent} from "../shared/side-card/side-card.component";
import {TweetCardComponent} from "../shared/tweet-card/tweet-card.component";
import {ProfileDetailsComponent} from "../shared/profile-details/profile-details.component";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../shared/services/user.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MaterialModule, MatTabGroup, MatTab, CommonModule, MenubarComponent, SendTweetComponent, SideCardComponent, TweetCardComponent, ProfileDetailsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  user: any = {};
  isAdminUser:boolean = false

  constructor(private tweetService: TweetService,
              private route:ActivatedRoute,
              private userService: UserService,
              private router:Router) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data: any) =>{
        console.log(data)
        this.user._id = data.user._id
        this.user.username = data.user.username
        this.user.followsCount = data.user.followeeCount
        this.user.followersCount = data.user.followerCount
        this.user.coverPicture = "https://variety.com/wp-content/uploads/2023/03/Twitter.png?w=1000"
        this.user.bio = "This is my bio"
        this.isAdmin()
      },error: (error) =>{
        console.log(error)
      }
    });
  }

  isAdmin(){
    this.userService.isAdminbyId().subscribe({
      next: (data: boolean) =>{
        console.log("ADMIN?" + data)
        this.isAdminUser = data;
      },error: (error) =>{

      }
    })
  }


  logout() {
    this.router.navigateByUrl('/logout')
  }

  navigate(s: string) {
    this.router.navigateByUrl(s)
  }
}
