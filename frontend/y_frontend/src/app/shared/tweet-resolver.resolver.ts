import { ResolveFn } from '@angular/router';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';  // Assuming this service exists and is properly set up
import { TweetService } from './services/feed.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TweetResolver implements Resolve<any> {
  constructor(private tweetService: TweetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const tweetId = route.paramMap.get('id');
    if (tweetId) {
      return this.tweetService.getTweetById(tweetId);
    } else {
      // Handle the case where tweetId is not available
      // You might want to redirect or throw an error
      throw new Error('No tweet ID provided in route');
    }
  }
}
