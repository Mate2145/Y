import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, retry, throwError } from 'rxjs';
import { Tweet } from '../model/Tweet';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  private apiUrl = 'http://localhost:5000/feed/'; // Change this URL to your actual API URL

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  headersTweet = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  // Fetch all tweets
  getTweets(): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.apiUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllTweets(): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.apiUrl + "tweetswithcount", {withCredentials: true})
  }

  getTweetById(id: string) {
    const url = `${this.apiUrl}/tweets/${id}`;
    return this.http.get(url,{withCredentials:true});
  }


  postTweet(tweet: Tweet): Observable<Tweet> {
    return this.http.post<Tweet>(this.apiUrl + "tweet", tweet, {headers: this.headersTweet, withCredentials: true})
      .pipe(
        catchError(this.handleError)
      );
  }

  likeTweet(tweetid: string){
    let likejson = {
      tweetId: tweetid
    }
    return this.http.post(this.apiUrl + "like", likejson, {headers: this.headersTweet, withCredentials: true})
  }

  unlikeTweet(tweetid: string){
    const url = `${this.apiUrl}/unlike/${tweetid}`;
    return this.http.delete(url,{withCredentials:true});
  }


  isLiked(tweetId: string): Observable<{ isLiked: boolean }> {
    const url = `${this.apiUrl}/check-like/${tweetId}`;
    return this.http.get<{ isLiked: boolean }>(url,{withCredentials:true});
  }

  // Error handling
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
