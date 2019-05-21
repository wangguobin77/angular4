import { Component, OnInit,ViewEncapsulation ,OnDestroy} from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../../../environments/environment';

@Component({
    // encapsulation: ViewEncapsulation.None,
    selector: 'execute-check',
    templateUrl: './check.component.html',
    styleUrls: ['./check.scss']
})
export class ExecuteCheck implements OnDestroy{
  sub1;
  environment = environment;
    private model = [];
    private files =[];
      constructor(private router: Router,public route: ActivatedRoute, private auth: AuthHttpService, private http: Http) {
        
    }
    public shufflingPic = {
        'boxHeight': '400px',
        'btnShow': false,
        'pic': []
    };
    popShow = false;
    setPic(imgArr, n) {
        this.shufflingPic.pic = [];
        for (let i = 0; i < imgArr.length; i++) {
            this.shufflingPic.pic.push({
                'imgUrl': imgArr[i].imageSrc,
                'isShow': i === n
            });
        }
        this.popShow = true;
    }
    hidePop(event) {
        if (event.target === document.getElementById('pop')) {
            this.popShow = false;
        }
    }
  ngOnInit() {
        let id = this.route.snapshot.params['id'];//'39fa9777-eabf-4d8e-9df3-5486e9ae733f';
        this.sub1=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/GDPurchaseExecute/GetModelInfo/${id}`).subscribe( (res) =>{
            let result = res.json();
            console.log(res.json());
             this.model = result;
             this.files = result.purchaseExecuteFiles;
             console.log(this.files);
        });
  }
      ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}