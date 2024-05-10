import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../material-module';
import { CommonModule } from '@angular/common';
import { Tweet } from '../model/Tweet';
import { TweetService } from '../services/feed.service';
import { error } from 'console';
import { catchError } from 'rxjs';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'tweet-card',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './tweet-card.component.html',
  styleUrl: './tweet-card.component.css'
})
export class TweetCardComponent implements OnInit {

  isLiked: boolean = false
  @Input()
  tweet!: Tweet;

  constructor(
    private tweetService : TweetService,
    private router: Router
  ){



  }
  ngOnInit(): void {
    console.log(this.tweet)
    this.isLikedTweet()
  }

  openTweet(){
    console.log(this.tweet._id)
    this.navigate("/tweet/" + this.tweet._id)
  }

  isLikedTweet(){
    if(this.tweet){
      this.tweetService.isLiked(this.tweet._id as string).subscribe({
        next: (data: any) =>{
          console.log(data)
          this.isLiked = data.isLiked
        },error: (error) =>{
          console.log(error)
        }
      })
    }
    else{
      {return}
    }
  }

  likeTweet() {
    if(!this.isLiked){
      console.log('Liked the tweet!');
      console.log(this.tweet._id)
      this.tweetService.likeTweet(this.tweet._id as string).subscribe({
        next: (data : any) =>{
          console.log(data)
          this.isLiked = true;
          this.tweet.likeCount = data.status as string
        },error: (error) =>{
          console.log(error)
        }
      })
    }
    else{
      console.log('Unlike tweet')
      this.tweetService.unlikeTweet(this.tweet._id as string).subscribe({
        next: (data : any) =>{
          console.log(data)
          this.isLiked = false;
          this.tweet.likeCount = data.status as string
        },error: (error) =>{
          console.log(error)
        }
      })
    }

  }

  commentOnTweet() {
    // Handle comment functionality
    console.log('Comment on the tweet!');
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

}
