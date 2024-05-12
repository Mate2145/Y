import { Component } from '@angular/core';
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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MaterialModule, MatTabGroup, MatTab, CommonModule, MenubarComponent, SendTweetComponent, SideCardComponent, TweetCardComponent, ProfileDetailsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any;
  tweets: any[] = [];
  replies: any[] = [];
  userId = 'user123';  // Example user ID

  constructor(private tweetService: TweetService) {}

  ngOnInit(): void {
    this.user = {
      name:"Matter",
      bio:"This is my bio",
      coverPicture: "https://variety.com/wp-content/uploads/2023/03/Twitter.png?w=1000",
      followersCount: "50",
      followsCount: "100"
    }
    this.tweetService.getAllTweets().subscribe({
      next: (data) => this.tweets = data,
      error: (error) => console.error('Failed to fetch tweets', error)
    });
    this.tweetService.getAllTweets().subscribe({
      next: (data) => this.replies = data,
      error: (error) => console.error('Failed to fetch replies', error)
    });
  }

  logout() {

  }
}
