import { Component } from '@angular/core';
import { MaterialModule } from '../../material-module';
import { CommonModule } from '@angular/common';
import { TweetService } from '../services/feed.service';
import { text } from 'stream/consumers';
import { Tweet } from '../model/Tweet';

@Component({
  selector: 'send-tweet',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './send-tweet.component.html',
  styleUrl: './send-tweet.component.css'
})
export class SendTweetComponent {

  tweetText: string = '';

  constructor(
    private tweetService: TweetService
  ) { }

  sendTweet() {
    console.log('Sending tweet:', this.tweetText);
    let tweet = new Tweet(this.tweetText)
    this.tweetService.postTweet(tweet).subscribe({
      next: (data) =>{
        console.log(data)
      }, error: (error) =>{
        console.log(error)
      }
    })
    this.tweetText = ''; // Clear the input after sending
  }

}
