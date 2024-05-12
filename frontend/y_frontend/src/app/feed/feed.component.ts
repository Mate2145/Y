import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from '../material-module';
import { MenubarComponent } from '../menubar/menubar.component';
import { TweetCardComponent } from "../shared/tweet-card/tweet-card.component";
import { SideCardComponent } from "../shared/side-card/side-card.component";
import { SendTweetComponent } from '../shared/send-tweet/send-tweet.component';
import { TweetService } from '../shared/services/feed.service';
import { Tweet } from '../shared/model/Tweet';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-feed',
    standalone: true,
    templateUrl: './feed.component.html',
    styleUrl: './feed.component.css',
    imports: [MatInputModule,
       MatButtonModule,
       MatCardModule,
       MaterialModule,
       MenubarComponent,
       TweetCardComponent,
       SideCardComponent,
       SendTweetComponent,
       CommonModule]
})
export class FeedComponent implements OnInit {

  tweetList:Tweet[] = []

  constructor(
    private authService: AuthService,
    private feedService: TweetService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAllTweets()
  }


  getAllTweets(){
     this.feedService.getAllTweets().subscribe({
      next: (data : Tweet[]) =>{
          this.tweetList = data;
          console.log(data);
      }, error: (error) =>{
          console.log(error)
      }
    })
  }

  handleTweetDeleted(tweetId: string) {
    this.tweetList = this.tweetList.filter(tweet => tweet._id !== tweetId);
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

  handleTweetCreation(tweet: boolean) {
    if (tweet){
      this.getAllTweets()
    }
  }
}
