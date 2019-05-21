import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, TradingCenter } from '../services/auth.service';

declare var $: any;

@Component({
    selector: 'header-app',
    templateUrl: './header.html',
    styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
    displayPopup = false;

    displaySubMenu = true;

    a:boolean = true;

    tradingCenters: TradingCenter[];

    currentTCName: string;

    activedMenu = 0;

    constructor(private base: AuthService, private route: ActivatedRoute, private router: Router) {
    }
    get myapplink(): string {
        if (this.base.currentTradingCenter === undefined || this.base.currentTradingCenter == null) {
            return '/';
        }
        switch (this.base.currentTradingCenter.id) {
            case 34:
                if (this.base.IsInRole('SellerAgent,CustomerService')) {
                    return '/client/anhui/list';
                } else if (this.base.IsInRole('Purchaser')) {
                    return '/purchase/eFactory/anhui/list';
                } else if (this.base.IsInRole('FinancialOfficer')) {
                    return '/settlement/purchase/anhui/list';
                } else if (this.base.IsInRole('RiskOfficer')) {
                    return '/energyefficiency/online';
                } else if (this.base.IsInRole('ITAdmin')) {
                    return '/enterprisesset/sellerinformation';
                } else {
                    return '/';
                }
            case 14:
                if (this.base.IsInRole('SellerAgent,CustomerService')) {
                    return '/client/shanxi/list';
                } else if (this.base.IsInRole('Purchaser')) {
                    return '/purchase/eFactory/shanxi/list';
                } else if (this.base.IsInRole('FinancialOfficer')) {
                    return '/settlement/purchase/shanxi/list';
                } else if (this.base.IsInRole('RiskOfficer')) {
                    return '/energyefficiency/online';
                } else if (this.base.IsInRole('ITAdmin')) {
                    return '/enterprisesset/sellerinformation';
                } else {
                    return '/';
                }
            case 6:
                if (this.base.IsInRole('SellerAgent,CustomerService')) {
                    return '/client/guangdong/list';
                } else if (this.base.IsInRole('Purchaser')) {
                    return '/purchase/eFactory/guangdong/list';
                } else if (this.base.IsInRole('FinancialOfficer')) {
                    return '/settlement/purchase/gongdong/list';
                } else if (this.base.IsInRole('RiskOfficer')) {
                    return '/energyefficiency/online';
                } else if (this.base.IsInRole('ITAdmin')) {
                    return '/enterprisesset/sellerinformation';
                } else {
                    return '/';
                }
            default:
                return '/';
        }
    }
    subMenu() {
        this.displaySubMenu = !(this.displaySubMenu);
    }

    ngOnInit() {

        const the = this;
        // 重写jquery ajax加请求头
        /*$.ajax = function (_ajax) {
            return function (options) {
                const _success = options.success || function (a, b) { };
                const _opt = $.extend(options, {
                    beforeSend: function (request) {
                        if(request!=undefined){
                            const headers = the.base.authHeaders.values();
                            for (let k = 0; k < headers.length; k++) {
                                request.setRequestHeader(k, headers[k][0]);
                            }
                        }
                    },
                    success: function (data, textStatus) {
                        _success(data, textStatus);
                    }
                });
                return _ajax(_opt);
            };
        }($.ajax);*/

        $.showMenu = (i) => {
            this.activedMenu = i;
        };
        document.body.onclick = (event) => {
            const evt = event.target as any;
            // let personSet = document.getElementById('personSet');
            if(evt!=document.getElementById('personSet')&&!document.getElementById('personSet').contains(evt)){
                this.displaySubMenu = true;
            }
            // if (evt.id !== 'personSetIcon' && evt.id !== 'personSet') {
            //     // personSet.style.display = 'none';
            //     this.displaySubMenu = false;
            // } else {
            //     console.log(this.displaySubMenu);
            // }
        };

        this.tradingCenters = this.base.getAvaliableTradingCenters();
        if (this.base.currentTradingCenter != null && this.base.currentTradingCenter.name != null) {
            const tcs = this.base.getAvaliableTradingCenters();
            for (let i = 0; i < tcs.length; i++) {
                if (this.base.currentTradingCenter.id === tcs[i].id) {
                    this.base.setCurrentTradingCenter(tcs[i]);
                    if (this.base.currentTradingCenter != null && this.base.currentTradingCenter.name != null) {
                        this.currentTCName = this.base.currentTradingCenter.name;
                    } else {
                        this.currentTCName = '未知';
                    }
                    break;
                }
            }
        } else {
            this.currentTCName = '未知';
        }

        if (this.base.currentTradingCenter != null) {
            this.displayPopup = false;
        } else {
            this.displayPopup = true;
        }
    }

    changeTradingCenter(tcId: number) {
        const tcs = this.base.getAvaliableTradingCenters();
        for (let i = 0; i < tcs.length; i++) {
            if (tcId === tcs[i].id) {
                this.base.setCurrentTradingCenter(tcs[i]);
                if (this.base.currentTradingCenter != null && this.base.currentTradingCenter.name != null) {
                    this.currentTCName = this.base.currentTradingCenter.name;
                } else {
                    this.currentTCName = '未知';
                }
                this.displayPopup = false;
                window.location.href = '/';
                return;
            }
        }
    }
    closeTradingCenterSelector() {
        if (this.base.currentTradingCenter != null) {
            this.displayPopup = false;
        } else {
            // this.displayPopup = true;
        }
    }
    openTradingCenterSelector() {
        this.displayPopup = true;
    }
}
