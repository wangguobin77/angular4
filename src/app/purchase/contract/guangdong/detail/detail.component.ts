import { Component,OnDestroy } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import{ environment } from '../../../../../environments/environment';

declare var $:any;

@Component({
    selector: 'contract-detail',
    templateUrl: './detail.component.html',
    styleUrls:['./detail.scss']
})
export class GDContractDetail implements OnDestroy{
    sub1;
    environment = environment;
    private detailData = [];
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
                'imgUrl': imgArr[i].src,
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
	ngOnInit(){
        let id = this.route.snapshot.params['id'];
        this.sub1=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/GDEnergyContract/GetDetail/${id}`).subscribe( (res) =>{
            let result = res.json();
            console.log(res.json());
            this.detailData = result.energyContract;
            this.files = result.energyContractFileList;
        });
	}
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}