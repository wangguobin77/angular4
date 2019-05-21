import { Component, OnInit,ViewEncapsulation ,OnDestroy} from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import{ environment } from '../../../../../environments/environment';
declare var $: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'detail',
    templateUrl: './detail.html',
    styleUrls: ['./detail.css']
})
export class DetailComponent implements OnDestroy{ 
    sub1;
    private detailData = [];
    constructor(private router: Router,public route: ActivatedRoute, private auth: AuthHttpService, private http: Http) {
        
    }

    ngOnInit() {
        let id = this.route.snapshot.params['id'];
        this.sub1=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/GDPurchasePlan/Detail/${id}`).subscribe( (res) =>{
            let result = res.json();
            console.log(res.json());
            this.detailData = result;
        });

    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}