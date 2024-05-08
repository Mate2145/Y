import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tweet-card',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './tweet-card.component.html',
  styleUrl: './tweet-card.component.css'
})
export class TweetCardComponent {

  @Input() tweet: any;  // Make sure to define an interface or class for 'tweet'

  likeTweet() {
    // Increment likes count or handle like functionality
    console.log('Liked the tweet!');
  }

  commentOnTweet() {
    // Handle comment functionality
    console.log('Comment on the tweet!');
  }

}
