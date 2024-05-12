import { Routes } from '@angular/router';
import { authGuard } from './shared/guard/auth.guard';
import { TweetResolver } from './shared/tweet-resolver.resolver';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'feed', loadComponent: () => import('./feed/feed.component').then((c) => c.FeedComponent), canActivate: [authGuard] },
    { path: 'profile', loadComponent: () => import('./profile/profile.component').then((c) => c.ProfileComponent), canActivate: [authGuard] },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'tweet/:id', loadComponent: () => import('./tweet-detail/tweet-detail.component').then((c) => c.TweetDetailsComponent), canActivate: [authGuard], resolve: {tweet: TweetResolver} },
    { path: '**', redirectTo: 'login' }
];
