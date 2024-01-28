import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {ajax} from "rxjs/ajax";
import {FshareAuth} from "../models/fshare-auth";
import {Util} from "../util";
import {switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FshareService {
  userInfo = {
    email: "chungnh33@gmail.com",
    password: "NewPassWord3396"
  }

  login(email: string, password: string): Observable<FshareAuth> {
    return ajax({
      url: "https://wrapper-api-two.vercel.app/fshare/login",
      method: 'POST',
      body: {
        email: email,
        password: password
      }
    }).pipe(
      map(value => {
        let auth = {
          sessionId: value.response['session_id'],
          token: value.response['token'],
        }
        Util.setWithExpiry(`auth_${email}`, JSON.stringify(auth), 2 * 60 * 60 * 1000)
        return auth;
      })
    )
  }

  private getAuth: () => Observable<FshareAuth> = () => {
    let auth = Util.getWithExpiry(`auth_${this.userInfo.email}`);
    return auth == null ? this.login(this.userInfo.email, this.userInfo.password) : new Observable(subscriber => {
      subscriber.next(auth)
      subscriber.complete()
    });
  };

  get(id: string): Observable<string> {
    let directLink = sessionStorage.getItem(`fs://${id}`);
    if (directLink != null && directLink.startsWith("https://")) {
      return new Observable<string>(subscriber => {
        subscriber.next(directLink)
        subscriber.complete()
      });
    }
    return this.getAuth()
      .pipe(
        switchMap(auth => ajax({
            method: 'POST',
            url: `https://wrapper-api-two.vercel.app/fshare/file/${id}`,
            body: {
              token: auth.token
            },
            headers: {
              session_id: auth.sessionId,
            }
          }
        )
          .pipe(map(value => {
            if (value.status == 200) {
              let directLink: string = value.response['data'];
              if (directLink != null) {
                sessionStorage.setItem(`fs://${id}`, directLink);
              }
              return directLink;
            }
          }))));
  }
}
