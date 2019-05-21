import { Component, OnInit, ViewEncapsulation, Injectable, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../+common/services/auth.service';
declare var $: any;
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;
declare var unescape: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'messageDetail',
  templateUrl: './messageDetail.html',
  styleUrls: ['./messageDetail.scss']
})
export class messageDetail implements OnDestroy {
  sub1;
  constructor(private location: Location, private authService: AuthService, private http: Http,private route: ActivatedRoute) {

  }
  public data = {};
  ngOnInit() {
    //获取url中的参数
    function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数
      if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    let id = this.route.snapshot.params['id'];
    let type = this.route.snapshot.params['type'];
    let url = `api/WorkbenchUser/GetAnnouncementDetail?id=${id}&type=${type}`;
    let totalurl = `${environment.sellerUserProfileApi}${url}`;

    this.sub1 = this.authService.AuthGet(totalurl).subscribe((res) => {
      this.data = res.json()
    });

  }
  ngOnDestroy(): void {
    if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
  }
}



