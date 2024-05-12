import {ActivatedRouteSnapshot, Resolve, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {Injectable} from "@angular/core";
import {TweetService} from "../services/feed.service";
import {Observable} from "rxjs";
import {UserService} from "../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const userId = route.paramMap.get('id');
    if (userId) {
      console.log("Amugy a resolver az")
      return this.userService.getUserWithCounts(userId)
    } else {
      // Handle the case where tweetId is not available
      // You might want to redirect or throw an error
      throw new Error('No tweet ID provided in route');
    }
  }
}
