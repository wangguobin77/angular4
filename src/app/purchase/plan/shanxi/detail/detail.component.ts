import { Component, OnInit,ViewEncapsulation,OnDestroy } from '@angular/core';
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
export class DetailComponent implements OnDestroy { 
    sub1;sub2;
    environment = environment;
    private detailData = [];
    private gridData = [];
    private id = "";
    private searchContent = "";
    constructor(private router: Router,public route: ActivatedRoute, private auth: AuthHttpService, private http: Http) {
        
    }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.sub1=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/SXPurchasePlan/Detail/${this.id}`).subscribe( (res) =>{
            let result = res.json();
            console.log(res.json());
            this.detailData = result;
        });
        this.searchGet();
    }

    searchContract(){
        this.searchGet();
    }
    searchGet(){
        this.sub2=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/SXPurchasePlan/GetRelationContact/${this.id}?name=${this.searchContent}`).subscribe((res)=>{
            let result = res.json();
            console.log(res.json());
            this.gridData = result;
        })
    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}