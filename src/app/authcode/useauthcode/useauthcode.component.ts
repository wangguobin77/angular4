import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../+common/services/auth.service';

declare var $: any;
declare var vCode: any;

@Component({
    selector: 'app-useauthcode',
    templateUrl: './useauthcode.html',
    styleUrls: ['./useauthcode.component.scss']
})
export class UseAuthCodeComponent implements OnInit, OnDestroy {
    public data = {};
    formData = {};

    sub1;
    sub2;
    sub3;

    constructor(private authService: AuthService) {
    }
    // 校验验证码
    fnValidateCode() {
        const VerifyCode = $('#VerifyCode').val();
        const vc = new vCode();
        if ($.trim(VerifyCode) !== '') {
            if (vc.verify(VerifyCode)) {
                $('#liVerifyCode').hide();
                return true;
            } else {
                $('#liVerifyCode').show();
                return false;
            }
        }
    }
    // 激活
    fnUseAuthCode() {

        const sellerName = $('#fullname').val();
        const authcodeValue = $('#authcode').val();

        this.sub1 = this.authService.AuthPost(`${environment.sellerCRMApi}api/AuthCode/AddAuthCode`,
            { SellerName: sellerName, Authcode: authcodeValue })
            .subscribe((res) => {
                const result = res.json();
                if (result.message.indexOf('成功') > -1) {
                    window.location.href = '/logout';
                } else {
                    alert(result.message);
                    $('#container').trigger('click');
                    return;
                }
            });
    }

    submit(event) {
        event.preventDefault();
        if (this.VerifyCode()) {
            const sellerName = $('#fullname').val();
            const authcodeValue = $('#authcode').val();

            if (sellerName === '' || sellerName === undefined) {
                $('#fullname').focus();
                $('#fullnameHint').show();
                return;
            }
            if (authcodeValue === '') {
                $('#authcode').focus();
                $('#authcodeHint').show();
                return;
            }

            this.sub2 = this.authService.AuthPost(`${environment.sellerCRMApi}api/SellerInformation/ValidateSellerName`,
                { SellerName: sellerName })
                .subscribe((res) => {
                    const data = res.json();
                    if (data === 1) {
                        this.fnUseAuthCode();
                    } else if (data === 0) {
                        $('#fullname').focus();
                        alert('公司已存在，请重新填写！');
                        return;
                    } else {
                        $('#fullname').focus();
                        alert('验证公司名称失败，请联系管理员！');
                        return;
                    }
                })
        } else {
            $('#container').trigger('click');
            return;
        }

    }

    ngOnInit() {
        // 基本信息的api sellerCRMApi
        const url = `api/SellerInformation/GetBasicInfo`;
        const totalurl = `${environment.sellerCRMApi}${url}`;
        this.sub3 = this.authService.AuthGet(totalurl).subscribe((res) => {
            const result = res.json();
            this.data = result;
            this.formData = result;

        });

        let code = null;
        $(function () {
            const container = document.getElementById('container');
            code = new vCode(container);
        });



        const spanLen = $('#container').find('span').length;
        $('#VerifyCode').on('blur', function () {
            let code = '';

            for (let i = 0; i < spanLen; i++) {
                code += $('#container').find('span')[i].innerHTML;
            }
            const inputCode = $('#VerifyCode').val();
            if (inputCode !== code) {
                $('#VerifyCode').focus();
                $('#liVerifyCode').show();
                return false;
            } else {
                $('#liVerifyCode').hide();
                return true;
            }
        })

        $('#authcode').on('blur', function () {
            const authcodeValue = $('#authcode').val();
            if (authcodeValue === '') {
                $('#authcode').focus();
                $('#authcodeHint').show();
            } else {
                $('#authcodeHint').hide();
            }
        });

    }

    VerifyCode(): boolean {
        const spanLen = $('#container').find('span').length;
        let code = '';

        for (let i = 0; i < spanLen; i++) {
            code += $('#container').find('span')[i].innerHTML;
        }
        const inputCode = $('#VerifyCode').val();
        if (inputCode !== code) {
            $('#VerifyCode').focus();
            $('#liVerifyCode').show();
            $('#container').trigger('click');
            return false;
        } else {
            $('#liVerifyCode').hide();
            return true;
        }

    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe(); }
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe(); }
    }
}
