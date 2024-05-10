import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { tweetResolverResolver } from './tweet-resolver.resolver';

describe('tweetResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => tweetResolverResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
