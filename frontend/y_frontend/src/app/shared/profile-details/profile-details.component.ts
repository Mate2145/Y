import { Component } from '@angular/core';
import {
    MatCard,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle, MatCardTitle
} from "@angular/material/card";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {NgForOf} from "@angular/common";
import {TweetService} from "../services/feed.service";

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
        NgForOf
    ],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.css'
})
export class ProfileDetailsComponent {
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
