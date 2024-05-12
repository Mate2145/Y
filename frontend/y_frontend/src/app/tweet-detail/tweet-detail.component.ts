import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from '../material-module';
import { MenubarComponent } from '../menubar/menubar.component';
import { TweetCardComponent } from '../shared/tweet-card/tweet-card.component';
import { SideCardComponent } from '../shared/side-card/side-card.component';
import { SendTweetComponent } from '../shared/send-tweet/send-tweet.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TweetService } from '../shared/services/feed.service';
import { AuthService } from '../shared/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, switchMap,of } from 'rxjs';
import {SendCommentComponent} from "../shared/send-comment/send-comment.component";
import {Tweet} from "../shared/model/Tweet";

@Component({
  selector: 'tweet-detail',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MaterialModule,
    MenubarComponent,
    TweetCardComponent,
    SideCardComponent,
    SendTweetComponent,
    CommonModule, SendCommentComponent],
  templateUrl: './tweet-detail.component.html',
  styleUrl: './tweet-detail.component.css'
})
export class TweetDetailsComponent implements OnInit {
  tweet: any; // Declare a variable to store the tweet details
  tweetId?: string;
  isLoading:boolean = true
  tweetList: Tweet[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private tweetService: TweetService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.data.subscribe({
      next: (data: any) =>{
        console.log("YO EZ A DATA")
        console.log(data.tweet.tweet.text)
        this.tweet = {
          ...data.tweet.tweet,
          likeCount: data.tweet.likeCount,
          commentCount: data.tweet.commentCount
        };
        console.log(this.tweet)
        this.getTweetComments(this.tweet._id)
        this.isLoading = false
        this.cdRef.detectChanges()
      },error: (error) =>{
        console.log(error)
      }
    });
  }

  getTweetComments(parentId:string){
    this.tweetService.getCommentsbyParentId(parentId).subscribe({
      next: (data:any) =>{
        console.log(data)
        this.tweetList = data
      },error: (error) =>{
        console.log(error)
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

  handleTweetDeletion(id:string) {
    this.router.navigateByUrl("/feed")
  }

  handleComment($event: boolean) {
    this.getTweetComments(this.tweet._id)
  }
}
