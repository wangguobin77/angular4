import { Component, EventEmitter, OnInit,OnDestroy } from '@angular/core';
import { SideNavModule } from '../sideNav/sideNav.module';
import { SideNavService } from '../sideNav/sideNav.service';
import { environment } from '../../../environments/environment';
import { AuthHttpService } from '../../+common/services/auth-http.service';
import { Router} from '@angular/router';
@Component({
    selector: 'tradingCenter',
    templateUrl: './tradingCenter.html',
    styleUrls: ['./tradingCenter.scss']
})
export class TradingCenterComponent implements OnInit,OnDestroy {
    sub1;sub2;
    private purchasedList = [];
    purchasedListIsNull = false;
    private unpurchasedList = [];
    unpurchasedListIsNull = false;
    public activate = new EventEmitter<string>();
    constructor(public service: SideNavService, private auth: AuthHttpService,private router:Router) {
    }
    getData(){
        const tcUrl = `${environment.appStoreApi}api/TradingCenter`;
        this.sub1=this.auth.get(tcUrl).subscribe((res) => {
            const result = res.json();
            if (result.purchasedList !== null) {
                this.purchasedList = result.purchasedList;
                if(result.purchasedList.length > 0)this.purchasedListIsNull = true;
                for (let k of this.purchasedList) {
                    const date = new Date(k.endDate);
                    k.endDate = `${date.getFullYear()}年${date.getMonth()}月`;
                }
            }
            if (result.unpurchasedList !== null) {
                this.unpurchasedList = result.unPurchasedList;
                if(result.unPurchasedList.length > 0)this.unpurchasedListIsNull = true;
            }
        })
    }
    ngOnInit() {
        this.getData();
        this.service.setWhichIsActive('tradingCenter');
    }
    addToCart(appId){
        this.sub2=this.auth.post(`${environment.appStoreApi}api/Cart`,[appId]).subscribe((res)=>{
            this.getData();
            console.log(res.json());
            this.router.navigate(['/store/cart']);
        })
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
		if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}
