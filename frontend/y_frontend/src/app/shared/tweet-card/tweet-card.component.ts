import {Component, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { MaterialModule } from '../../material-module';
import { CommonModule } from '@angular/common';
import { Tweet } from '../model/Tweet';
import { TweetService } from '../services/feed.service';
import { catchError } from 'rxjs';
import { Route, Router } from '@angular/router';
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import { EventEmitter } from '@angular/core';
import {EditDialogComponent} from "../edit-dialog/edit-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'tweet-card',
  standalone: true,
  imports: [MaterialModule,CommonModule],
  templateUrl: './tweet-card.component.html',
  styleUrl: './tweet-card.component.css'
})
export class TweetCardComponent implements OnChanges {

  isLiked: boolean = false
  @Input()
  tweet!: Tweet;
  @Input() isFooter:boolean = true
  checkedTweet: boolean = false
  @Output() tweetDeleted = new EventEmitter<string>();

  constructor(
    private tweetService : TweetService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ){



  }
  ngOnInit(): void {
    console.log(this.tweet)
    this.isLikedTweet()
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    if (changes['tweet'] && !changes['tweet'].isFirstChange()) {
      this.isLikedTweet();
    }
  }

  openTweet(){
    console.log(this.tweet._id)
    this.navigate("/tweet/" + this.tweet._id)
  }

  isLikedTweet(){
    if(this.tweet){
      this.tweetService.isLiked(this.tweet._id as string).subscribe({
        next: (data: any) =>{
          console.log(this.tweet.text)
          console.log(data)
          this.isLiked = data.isLiked
          this.checkTweet();
        },error: (error) =>{
          console.log(error)
        }
      })
    }
    else{
      {return}
    }
  }

  checkTweet(){
    console.log("Hali")
    if(this.tweet){
      console.log("Ya")
      this.tweetService.checkTweet(this.tweet.userId as string).subscribe({
        next: (data: any) =>{
          console.log("Check tweet")
          console.log(data)
          this.checkedTweet = data.checkTweet
          console.log(this.checkedTweet)
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

  getTweet(id:string):void{
    this.tweetService.getTweetById(id).subscribe({
      next: (data: any) =>{
        console.log(data)
        this.tweet = data.tweet
        this.tweet.commentCount = data.commentCount
        this.tweet.likeCount = data.likeCount
      },error: (error) =>{
        console.log(error)
      }
    });
  }

  openDeleteConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this tweet?',
        submitBtnText: 'Delete',
        tweetId: this.tweet._id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTweet()
        this.tweetDeleted.emit(this.tweet._id);
      }
    });
  }


  deleteTweet() {
    if (this.tweet._id){
      this.tweetService.deleteTweetbyId(this.tweet._id).subscribe({
        next: (data) =>{
          console.log(data)
          this.snackbar.open('Success!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
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

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { tweetText: this.tweet.text } // Pass current tweet text
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.updateTweet(result.tweetText);
      }
    });
  }

  updateTweet(text: string) {
    console.log(text)
    if (this.tweet._id){
      this.tweetService.editTweetbyId(this.tweet._id,text).subscribe({
        next: (data:any) =>{
          console.log(data)
          this.snackbar.open('Edit tweet succesfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
          this.getTweet(data._id)
        }, error: (error) =>{
          console.log(error)
          this.snackbar.open('Something went wrong!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      });

    }
    else {
      this.snackbar.open('There is no ID!', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    }
    //this.tweet.text = text;
  }

  openProfile() {
    this.router.navigateByUrl('profile/' + this.tweet.userId)
  }
}
