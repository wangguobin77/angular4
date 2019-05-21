import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { UserManager, User } from 'oidc-client';
import { environment } from '../../../environments/environment';

const settings: any = {
  authority: environment.oidcServerUrl,
  client_id: 'evs-js',
  redirect_uri: environment.thisSiteUrl + 'auth',
  post_logout_redirect_uri: environment.thisSiteUrl,
  response_type: 'id_token token',
  scope: 'openid profile sellerapi identityapi',
  silent_redirect_uri: environment.thisSiteUrl + 'silent-renew',
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTime: 4,
  silentRequestTimeout: 10000,
  monitorSession: true,
  filterProtocolClaims: true,
  loadUserInfo: true
};

class Applications {
  id = '00000000-0000-0000-0000-000000000000';
  name: string = null;

  constructor(appId: string = '00000000-0000-0000-0000-000000000000', appName: string = null) {
    this.id = appId;
    this.name = appName;
  }
}

export class TradingCenter {
  id: number = -1;
  appId = '00000000-0000-0000-0000-000000000000';
  name: string = null;
  pingYin: string = null;

  constructor(tcId: number = -1, tcName: string = null, tcPingYin: string = null) {
    this.id = tcId;
    this.name = tcName;
    this.pingYin = tcPingYin;
  }
}

class SellerInfo {
  id = '00000000-0000-0000-0000-000000000000';
  name: string = null;
  tradingCenters: TradingCenter[];
  applications: Applications[];
  remainingVMoney: 0;
  logoUrl = '';

  constructor(sId: string = '00000000-0000-0000-0000-000000000000', sName: string = null) {
    this.id = sId;
    this.name = sName;
  }
}

@Injectable()
export class AuthService {
  mgr: UserManager = new UserManager(settings);
  userLoadededEvent: EventEmitter<User> = new EventEmitter<User>();

  set currentUser(inPara: User) {
    sessionStorage.setItem('_currentUser', JSON.stringify(inPara));
  }

  get currentUser(): User {
    let rtnValue: User;
    if (sessionStorage.getItem('_currentUser') != null) {
      rtnValue = JSON.parse(sessionStorage.getItem('_currentUser')) as User;
    }
    return rtnValue;
  }

  set currentSeller(inPara: SellerInfo) {
    sessionStorage.setItem('_currentSeller', JSON.stringify(inPara));
  }

  get currentSeller(): SellerInfo {
    if (sessionStorage.getItem('_currentSeller') == null) {
      this.getSellerInfo();
    }
    return JSON.parse(sessionStorage.getItem('_currentSeller')) as SellerInfo;
  }

  set currentTradingCenter(inPara: TradingCenter) {
    localStorage.setItem('_currentTradingCenter', JSON.stringify(inPara));
    localStorage.setItem('_currentUser', JSON.stringify(this.currentUser));
  }

  get currentTradingCenter(): TradingCenter {
    let rtnValue: TradingCenter;
    try {
      if (localStorage.getItem('_currentTradingCenter') != null) {
        const vu = JSON.parse(localStorage.getItem('_currentUser')) as User;
        if (vu.profile.userId === this.currentUser.profile.userId) {
          rtnValue = JSON.parse(localStorage.getItem('_currentTradingCenter')) as TradingCenter;
        }
      }
    } catch (e) {
      return null;
    }
    return rtnValue;
  }

  get loggedIn(): boolean {
    try {
      if ((this.currentUser.expires_at * 1000) > Date.now()) {
        return true;
      } else {
        this.mgr.signinSilent();
        return false;
      }
    } catch (ex) {
      return false;
    }
  }
// 设置当前的 tradingCenter
  setCurrentTradingCenter(tradingCenter: TradingCenter) {
    this.currentTradingCenter = tradingCenter;
    const headers = this.authHeaders;
    if (headers.has('CurrentTCId')) {
      headers.set('CurrentTCId', `${this.currentTradingCenter.id}`);
    } else {
      headers.append('CurrentTCId', `${this.currentTradingCenter.id}`);
    }
    this.authHeaders = headers;
  }

  getAvaliableTradingCenters(): TradingCenter[] {
    if (this.currentSeller) {
      return this.currentSeller.tradingCenters;
    }
    return null;
  }

  IsInRole(roleName: string): boolean {
    if (roleName === '') {
      return true;
    }
    try {
      const roles = (this.currentUser.profile.evsroles as string).split(',');
      const rolesChk = (roleName as string).split(',');
      for (let i = 0; i < rolesChk.length; i++) {
        if (roles.indexOf(rolesChk[i]) !== -1 ||
          (this.currentTradingCenter !== undefined &&
            this.currentTradingCenter !== null &&
            roles.indexOf(rolesChk[i] + '#' + this.currentTradingCenter.id) !== -1)) {
          return true;
        }
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  async getSellerInfo() {
    const res = await this.AuthGet(environment.oidcServerUrl + 'api/sellerinfo/').first().toPromise();
    this.currentSeller = res.json() as SellerInfo;
  }

  constructor(private http: Http) {
    const evt = this.mgr.getUser()
      .then((user) => {
        if (user) {
          this.currentUser = user;
          this.userLoadededEvent.emit(user);
        } else {
          this.currentUser = null;
        }
      })
      .catch((err) => {
        this.currentUser = null;
      });

    this.mgr.events.addUserLoaded(user => {
      this.currentUser = user;
      if (!environment.production) {
        console.log('authService addUserLoaded', user);
      }
    });

    this.mgr.events.addUserUnloaded((e) => {
      if (!environment.production) {
        console.log('user unloaded');
      }
      this.currentUser = null;
    });
  }
  clearState() {
    this.mgr.clearStaleState().then(function () {
      console.log('clearStateState success');
    }).catch(function (e) {
      console.log('clearStateState error', e.message);
    });
  }

  getUser() {
    this.mgr.getUser().then((user) => {
      console.log('got user', user);
      this.currentUser = user;
      this.userLoadededEvent.emit(user);
    }).catch(function (err) {
      console.log(err);
    });
  }
  isLoggedInObs(): Observable<boolean> {
    return Observable.fromPromise(this.mgr.getUser()).map<User, boolean>((user) => {
      if (user) {
        return true;
      } else {
        return false;
      }
    });
  }

  removeUser() {
    this.mgr.removeUser().then(() => {
      this.userLoadededEvent.emit(null);
      this.currentUser = null;
      this.currentSeller = null;
      console.log('user removed');
    }).catch(function (err) {
      console.log(err);
    });
  }

  startSigninMainWindow() {
    this.mgr.signinRedirect({ data: 'some data' }).then(function () {
      console.log('signinRedirect done');
    }).catch(function (err) {
      console.log(err);
    });
  }
  endSigninMainWindow() {
    this.mgr.signinRedirectCallback().then(function (user) {
      console.log('signed in', user);
    }).catch(function (err) {
      console.log(err);
    });
  }

  startSignoutMainWindow() {
    this.mgr.signoutRedirect().then(function (resp) {
      console.log('signed out', resp);
      this.currentUser = null;
      this.currentSeller = null;
      setTimeout(5000, () => {
        console.log('testing to see if fired...');

      });
    }).catch(function (err) {
      console.log(err);
    });
  };

  endSignoutMainWindow() {
    this.mgr.signoutRedirectCallback().then(function (resp) {
      console.log('signed out', resp);
    }).catch(function (err) {
      console.log(err);
    });
  };
  /**
   * Example of how you can make auth request using angulars http methods.
   * @param options if options are not supplied the default content type is application/json
   */
  AuthGet(url: string, data?: any, options?: RequestOptions): Observable<Response> {
    if (options) {
      options = this._setRequestOptions(options);
    } else {
      options = this._setRequestOptions();
    }
    if (data != null && data !== undefined) {
      options.params = data;
    }
    return this.http.get(url, options);
  }

  /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthPut(url: string, data: any, options?: RequestOptions): Observable<Response> {

    const body = JSON.stringify(data);

    if (options) {
      options = this._setRequestOptions(options);
    } else {
      options = this._setRequestOptions();
    }
    return this.http.put(url, body, options);
  }
  /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthDelete(url: string, options?: RequestOptions): Observable<Response> {

    if (options) {
      options = this._setRequestOptions(options);
    } else {
      options = this._setRequestOptions();
    }
    return this.http.delete(url, options);
  }
  /**
   * @param options if options are not supplied the default content type is application/json
   */
  // ajax post  arguements(url, body, options) 参数 url ：post地址 data:数据 ；options方法


  AuthPost(url: string, data: any, options?: RequestOptions): Observable<Response> {
    if (options) {
      options = this._setRequestOptions(options);
    } else {
      options = this._setRequestOptions();
    }
    options.body = JSON.stringify(data);
    return this.http.post(url, data, options);
  }

  // 设置请求的 header 判断用户是否拥有auth
  set authHeaders(inPara: Headers) {
    sessionStorage.setItem('_authHeaders', JSON.stringify(inPara));
  }


// access_token
  get authHeaders(): Headers {
    const rtnValue: Headers = new Headers();
    if (this.loggedIn) {
      rtnValue.append('Authorization', this.currentUser.token_type + ' ' + this.currentUser.access_token);
      rtnValue.append('Content-Type', 'application/json');
    }
    if (sessionStorage.getItem('_authHeaders') != null) {
      const tmp = JSON.parse(sessionStorage.getItem('_authHeaders'));
      if (tmp.hasOwnProperty('CurrentTCId')) {
        const CurrentTCIds = (tmp.CurrentTCId as string[]).join('; ');
        rtnValue.append('CurrentTCId', CurrentTCIds);
      }
    }

    this.authHeaders = rtnValue;
    return rtnValue;
  }

  public _setRequestOptions(options?: RequestOptions) {
    if (options) {
      if (!options.headers) {
        options.headers = new Headers();
      }
      options.headers.append(this.authHeaders.keys()[0], this.authHeaders.values()[0][0]);
    } else {
      options = new RequestOptions({ headers: this.authHeaders, body: '' });
    }

    return options;
  }

}
