import {Component, Input} from '@angular/core';
import {
    MatCard,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle, MatCardTitle
} from "@angular/material/card";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CommonModule, NgForOf} from "@angular/common";
import {TweetService} from "../services/feed.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {TweetCardComponent} from "../tweet-card/tweet-card.component";
import {MatButton} from "@angular/material/button";
import {UserService} from "../services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'profile-details',
  standalone: true,
  imports: [
    MatCard,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle,
    MatTab,
    MatTabGroup,
    NgForOf,
    MatProgressSpinner,
    CommonModule,
    TweetCardComponent,
    MatButton
  ],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.css'
})
export class ProfileDetailsComponent {
  @Input() user: any;
  tweets: any[] = [];
  Tweetreplies: any[] = [];
  isFollowed:boolean = false;
  isSameId: boolean = false;
  userId = 'user123';  // Example user ID

  constructor(private tweetService: TweetService,
              private userService: UserService,
              private snackbar:MatSnackBar) {}

  ngOnInit(): void {
    if (this.user){
      console.log(this.user)
      this.isUserFollowed(this.user._id)
      this.getUserTweets(this.user._id)
    }
  }

  updateUser(userId:string){
    this.userService.getUserWithCounts(userId).subscribe({
      next: (data) =>{
        console.log(data)
        this.user.followsCount = data.followeeCount
        this.user.followersCount = data.followerCount
      },error: (error) =>{
        console.log(error)
      }
    })
  }

  getUserTweets(userId:string){
    this.tweetService.getTweetsbyUserId(userId).subscribe({
      next: (data:any) => {
        console.log(data)
        this.tweets = data
      },
      error: (error) => console.error('Failed to fetch tweets', error)
    });
    this.tweetService.getRepliesbyUserIdwithParent(userId).subscribe({
      next: (data:any) =>{
        console.log("Replies")
        console.log(data)
        this.Tweetreplies = data
      },
      error: (error) => console.error('Failed to fetch replies', error)
    });
  }

  isUserFollowed(userId:string){
    this.userService.isUserFollowed(userId).subscribe({
      next: (data:any) =>{
        console.log(data)
        this.isFollowed = data.isFollowed;
        this.isSameId = data.isSameId
      },error: (error) =>{
        console.log(error)
      }
    })
  }

  followUser(userId: string){
    if (!this.isFollowed){
      this.userService.followUserById(userId).subscribe({
        next: (data) =>{
          console.log(data)
          this.snackbar.open('Followed!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
          this.isUserFollowed(userId)
          this.updateUser(userId)
        },error: (error) =>{
          console.log(error)
          this.snackbar.open('Something went wrong!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      })
    }
    else {
      this.userService.unfollowUserById(userId).subscribe({
        next: (data) =>{
          console.log(data)
          this.snackbar.open('Unfollowed!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
          this.isUserFollowed(userId)
          this.updateUser(userId)
        },error: (error) =>{
          console.log(error)
          this.snackbar.open('Something went wrong!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      })
    }

  }

  logout() {

  }
}
