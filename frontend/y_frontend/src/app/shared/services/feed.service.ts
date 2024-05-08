import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, retry, throwError } from 'rxjs';
import { Tweet } from '../model/Tweet';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  private apiUrl = 'http://localhost:5000/feed'; // Change this URL to your actual API URL

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Fetch all tweets
  getTweets(): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.apiUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

    // Fetch mock tweets for testing purposes
    getMockTweets(): Observable<Tweet[]> {
      const mockTweets: Tweet[] = [
        {
          userId: '1',
          text: 'Hello, this is a mock tweet!',
          createdAt: new Date('2022-01-01T09:00:00Z')
        },
        {
          userId: '2',
          text: 'Here is another test tweet for development.',
          createdAt: new Date('2022-01-02T10:00:00Z')
        },
        {
          userId: '3',
          text: 'Mock data can simplify frontend development.',
          createdAt: new Date('2022-01-03T11:00:00Z')
        }
      ];
      return of(mockTweets);
    }


    
  postTweet(tweet: Tweet): Observable<Tweet> {
    return this.http.post<Tweet>(this.apiUrl, tweet, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
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
