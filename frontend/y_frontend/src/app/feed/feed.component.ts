import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from '../material-module';
import { MenubarComponent } from '../menubar/menubar.component';
import { TweetCardComponent } from "../shared/tweet-card/tweet-card.component";
import { SideCardComponent } from "../shared/side-card/side-card.component";

@Component({
    selector: 'app-feed',
    standalone: true,
    templateUrl: './feed.component.html',
    styleUrl: './feed.component.css',
    imports: [MatInputModule, MatButtonModule, MatCardModule, MaterialModule, MenubarComponent, TweetCardComponent, SideCardComponent]
})
export class FeedComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }




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
}
