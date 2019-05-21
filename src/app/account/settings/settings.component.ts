import { Component, OnInit, ViewEncapsulation, Injectable, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../+common/services/auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../../../environments/environment';

declare var $: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'settings',
    templateUrl: './settings.html',
    styleUrls: ['./settings.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
    user: any = {};

    refresh: Function;

    sub1;
    sub2;
    sub3;
    sub4;
    sub5;
    sub6;
    sub7;
    sub8;
    sub9;
    sub10;
    sub11;
    sub12;

    constructor(private location: Location, private authService: AuthService, private http: Http, private router: Router) {

    }
    ngOnInit() {

        $.showMenu(-1);

        const _this = this;

        //弹层的关闭按钮
        $(".icon-guanbipsd").on("click", function () {
            $(this).closest('div.popup-cart').hide();
            return false;
        });

        // 调用接口数据
        ; (function () {

            _this.refresh = function () {
                this.sub1 = _this.authService.AuthGet(`${environment.sellerUserProfileApi}api/myaccount/index`)
                    .subscribe(function (res) {
                        const data = res.json();
                        _this.user = data.user;
                        _this.user.headPicSrc = data.headPicSrc == null ?
                            '/assets/images/seller-user.png' : (environment.uploadRoot + data.headPicSrc);
                        _this.user.isAdmin = data.isAdmin;
                    });
            };

            _this.refresh();
        })();

        // 修改姓名
        ; (function () {
            $('#modifyFullName').click(function () {
                $('#popFullName').show();
                return false;
            });
            $('a.cancel-button').click(function () {
                $(this).closest('div.popup-cart').hide();
                return false;
            });

            const nameChecker = $('#txtFullName').TChecker({
                required: { rule: true, error: '请输入您的名字' }
            });

            $('#popFullName').find('a.confirm-button').click(function () {
                const correct = nameChecker.check();
                if (!correct) { return false; }

                const fullName = $('#txtFullName').val();
                const $tishi = $('#txtFullName').nextAll('.tishi');

                this.sub2 = _this.authService.AuthPost(`${environment.sellerUserProfileApi}api/MyAccount/UpdateFullName/`,
                    { FullName: fullName }).subscribe(function (res) {
                        const msg = res.json();
                        if (msg.actionResult !== '1') {
                            $tishi.html(msg.message);
                            $tishi.show();
                            return false;
                        }
                        $tishi.html('');
                        $tishi.hide();
                        alert(msg.message);
                        $('#lbFullName').attr('placeholder', fullName);
                        $('#popFullName').hide();
                    });
                return false;
            });

        })();

        // 修改上传头像
        ; (function () {
            $('#fileHeadPic').kendoUpload({
                showFileList: false,
                validation: {
                    allowedExtensions: ['.jpg', '.jpeg', '.png', '.bmp', '.gif'],
                    maxFileSize: 4194304    // 4M
                },
                async: {
                    saveUrl: `${environment.sellerUserProfileApi}/api/MyAccount/UploadHeadPic`,
                    autoUpload: true
                },
                success: function (e) {
                    if (e.operation === 'upload') {
                        const data = e.response;
                        if (data.fileId != null) {
                            this.sub3 = _this.authService.AuthPost(`${environment.sellerUserProfileApi}api/MyAccount/ChangeHeadPic/`,
                                { fileId: data.fileId })
                                .subscribe(res => {
                                    $('#imgHeadPic').attr('src', environment.uploadRoot + data.src);
                                });
                        }
                    }
                }
            });
            $('#fileHeadPic').closest('div.k-upload').hide();
            $('#modifyHead').off().on('click', function () {
                $('#fileHeadPic').click();
            });
        })();

        // 手机号的改绑
        ; (function () {
            $('#addTel').click(function () {
                $('#titleTel').html('绑定手机')
                $('#popTel').show();
                return false;
            });
            $('#updTel').click(function (e) {
                e.preventDefault();
                $('#titleTel').html('改绑手机')
                $('#popTel').show();
                return false;
            });

            const telChecker = $('#txtTel').TChecker({
                required: { rule: true, error: '请输入您的手机号码' },
                format: { rule: /^\d{11}$/, error: '您的手机号码格式不正确' },
                custom: function (value) {
                    if (value === $('#lbTel').attr('placeholder')) {
                        return { rule: false, error: '手机号码未发生改变' };
                    }
                    return { rule: true };
                }
            });

            const telCodeChecker = $('#txtTelCode').TChecker({
                required: { rule: true, error: '请填写您收到的短信验证码' }
            });

            // 发短信验证码
            $('#popTel').find('button.verification').click(function () {
                const $send = $(this);
                if ($send.hasClass('verification-no')) {
                    return false;
                }

                const correct = telChecker.check();
                if (!correct) { return false; }

                const tel = $('#txtTel').val();
                const $tishi = $('#txtTel').nextAll('.tishi');

                this.sub4 = _this.authService.AuthPost(`${environment.sellerUserProfileApi}api/MyAccount/SendCodeBySetTel/`,
                    { tel: tel, setType: 1 })
                    .subscribe(function (res) {
                        const msg = res.json();
                        if (msg.actionResult !== '1') {
                            $tishi.html(msg.message);
                            $tishi.show();
                            return false;
                        }
                        $tishi.html('');
                        $tishi.hide();
                        $send.addClass('verification-no').html('剩余120秒');
                        let T = 120;
                        const GetVerifyCodeTimeLeft = setInterval(function () {
                            T--;
                            if (T === 0) {
                                clearInterval(GetVerifyCodeTimeLeft);
                                $send.removeClass('verification-no').html('发送验证码');
                            } else {
                                $send.html('剩余' + T + '秒');
                            }
                        }, 1000);
                    });
            });

            // 提交确认
            $('#popTel').find('a.confirm-button').click(function () {
                let correct = telChecker.check();
                if (!correct) { return false; }

                correct = telCodeChecker.check();
                if (!correct) { return false; }

                const tel = $('#txtTel').val();
                const $tishi = $('#txtTelCode').nextAll('.tishi');

                this.sub5 = _this.authService.AuthPost(`${environment.sellerUserProfileApi}api/MyAccount/UpdateTel/`,
                    { newTel: tel, code: $('#txtTelCode').val() })
                    .subscribe(function (res) {
                        const msg = res.json();
                        if (msg.actionResult !== '1') {
                            $tishi.html(msg.message);
                            $tishi.show();
                            return false;
                        }
                        $tishi.html('');
                        $tishi.hide();
                        alert(msg.message);

                        $('#popTel').hide();
                        _this.refresh();
                    });
                return false;
            });
        })();

        // 手机号的解绑
        ; (function () {
            $('#removeTel').click(function () {
                $('#popRemoveTel').show();
                return false;
            });

            const telCodeChecker = $('#txtCodeByRemoveTel').TChecker({
                required: { rule: true, error: '请填写您收到的短信验证码' }
            });

            // 发短信验证码
            $('#popRemoveTel').find('button.verification').click(function () {
                const $send = $(this);
                if ($send.hasClass('verification-no')) {
                    return false;
                }
                const tel = $('#lbTel').attr('placeholder');
                const $tishi = $('#txtCodeByRemoveTel').nextAll('.tishi');

                this.sub6 = _this.authService.AuthPost(`${environment.sellerUserProfileApi}api/MyAccount/SendCodeBySetTel/`,
                    { tel: tel, setType: 2 })
                    .subscribe(function (res) {
                        const msg = res.json();
                        if (msg.actionResult !== '1') {
                            $tishi.html(msg.message);
                            $tishi.show();
                            return false;
                        }
                        $tishi.html('');
                        $tishi.hide();
                        $send.addClass('verification-no').html('剩余120秒');
                        let T = 120;
                        const GetVerifyCodeTimeLeft = setInterval(function () {
                            T--;
                            if (T === 0) {
                                clearInterval(GetVerifyCodeTimeLeft);
                                $send.removeClass('verification-no').html('发送验证码');
                            } else {
                                $send.html('剩余' + T + '秒');
                            }
                        }, 1000);
                    });
            });

            // 提交确认
            $('#popRemoveTel').find('a.confirm-button').click(function () {
                const correct = telCodeChecker.check();
                if (!correct) { return false; }

                const tel = $('#lbTel').attr('placeholder');
                const $tishi = $('#txtCodeByRemoveTel').nextAll('.tishi');

                this.sub7 = _this.authService.AuthPost(`${environment.sellerUserProfileApi}api/MyAccount/RemoveTel/`,
                    { tel: tel, code: $('#txtCodeByRemoveTel').val() })
                    .subscribe(function (res) {
                        const msg = res.json();
                        if (msg.actionResult !== '1') {
                            $tishi.html(msg.message);
                            $tishi.show();
                            return false;
                        }
                        $tishi.html('');
                        $tishi.hide();
                        alert(msg.message);

                        $('#popRemoveTel').hide();
                        _this.refresh();
                    });
                return false;
            });
        })();

        // 邮箱的改绑
        ; (function () {
            $('#addEmail').click(function () {
                $('#titleEmail').html('绑定邮箱')
                $('#popEmail').show();
                return false;
            });
            $('#updEmail').click(function () {
                $('#titleEmail').html('改绑邮箱')
                $('#popEmail').show();
                return false;
            });

            const EmailChecker = $('#txtEmail').TChecker({
                required: { rule: true, error: '请输入您的邮箱地址' },
                format: { rule: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,8}$/, error: '您的邮箱地址格式不正确' },
                custom: function (value) {
                    if (value === $('#lbEmail').attr('placeholder')) {
                        return { rule: false, error: '邮箱地址未发生改变' };
                    }
                    return { rule: true };
                }
            });

            const EmailCodeChecker = $('#txtEmailCode').TChecker({
                required: { rule: true, error: '请填写您收到的邮箱验证码' }
            });

            // 发邮箱验证码
            $('#popEmail').find('button.verification').click(function () {
                const $send = $(this);
                if ($send.hasClass('verification-no')) {
                    return false;
                }
                const correct = EmailChecker.check();
                if (!correct) { return false; }

                const Email = $('#txtEmail').val();
                const $tishi = $('#txtEmail').nextAll('.tishi');

                this.sub8 = _this.authService.AuthPost(`${environment.sellerUserProfileApi}api/MyAccount/SendCodeBySetEmail/`
                    , { email: Email, setType: 1 })
                    .subscribe(function (res) {
                        const msg = res.json();
                        if (msg.actionResult !== '1') {
                            $tishi.html(msg.message);
                            $tishi.show();
                            return false;
                        }
                        $tishi.html('');
                        $tishi.hide();
                        $send.addClass('verification-no').html('剩余120秒');
                        let T = 120;
                        const GetVerifyCodeTimeLeft = setInterval(function () {
                            T--;
                            if (T === 0) {
                                clearInterval(GetVerifyCodeTimeLeft);
                                $send.removeClass('verification-no').html('发送验证码');
                            } else {
                                $send.html('剩余' + T + '秒');
                            }
                        }, 1000);
                    });
            });

            // 提交确认
            $('#popEmail').find('a.confirm-button').click(function () {
                let correct = EmailChecker.check();
                if (!correct) { return false; }

                correct = EmailCodeChecker.check();
                if (!correct) { return false; }

                const Email = $('#txtEmail').val();
                const $tishi = $('#txtEmailCode').nextAll('.tishi');

                this.sub9 = _this.authService.AuthPost(`${environment.sellerUserProfileApi}api/MyAccount/UpdateEmail/`,
                    { newEmail: Email, code: $('#txtEmailCode').val() })
                    .subscribe(function (res) {
                        const msg = res.json();
                        if (msg.actionResult !== '1') {
                            $tishi.html(msg.message);
                            $tishi.show();
                            return false;
                        }
                        $tishi.html('');
                        $tishi.hide();
                        alert(msg.message);

                        $('#popEmail').hide();
                        _this.refresh();
                    });
                return false;
            });
        })();


        // 邮箱的解绑
        ;(function () {
            $('#removeEmail').click(function () {
                $('#popRemoveEmail').show();
                return false;
            });

            const EmailCodeChecker = $('#txtCodeByRemoveEmail').TChecker({
                required: { rule: true, error: '请填写您收到的邮箱验证码' }
            });

            // 发短信验证码
            $('#popRemoveEmail').find('button.verification').click(function () {
                const $send = $(this);
                if ($send.hasClass('verification-no')) {
                    return false;
                }
                const Email = $('#lbEmail').attr('placeholder');
                const $tishi = $('#txtCodeByRemoveEmail').nextAll('.tishi');

                this.sub10 = _this.authService.AuthPost(`${environment.sellerUserProfileApi}api/MyAccount/SendCodeBySetEmail/`,
                    { Email: Email, setType: 2 })
                    .subscribe(function (res) {
                        const msg = res.json();
                        if (msg.actionResult !== '1') {
                            $tishi.html(msg.message);
                            $tishi.show();
                            return false;
                        }
                        $tishi.html('');
                        $tishi.hide();
                        $send.addClass('verification-no').html('剩余120秒');
                        let T = 120;
                        const GetVerifyCodeTimeLeft = setInterval(function () {
                            T--;
                            if (T === 0) {
                                clearInterval(GetVerifyCodeTimeLeft);
                                $send.removeClass('verification-no').html('发送验证码');
                            } else {
                                $send.html('剩余' + T + '秒');
                            }
                        }, 1000);
                    });
            });

            // 提交确认
            $('#popRemoveEmail').find('a.confirm-button').click(function () {
                const correct = EmailCodeChecker.check();
                if (!correct) { return false; }

                const Email = $('#lbEmail').attr('placeholder');
                const $tishi = $('#txtCodeByRemoveEmail').nextAll('.tishi');

                this.sub11 = _this.authService.AuthPost(`${environment.sellerUserProfileApi}api/MyAccount/RemoveEmail/`,
                    { Email: Email, code: $('#txtCodeByRemoveEmail').val() })
                    .subscribe(function (res) {
                        const msg = res.json();
                        if (msg.actionResult !== '1') {
                            $tishi.html(msg.message);
                            $tishi.show();
                            return false;
                        }
                        $tishi.html('');
                        $tishi.hide();
                        alert(msg.message);

                        $('#popRemoveEmail').hide();
                        _this.refresh();
                    });
                return false;
            });
        })();

        // 修改密码
        ; (function () {

            $('#modifyPwd').click(function () {
                $('#popPwd').show();
                return false;
            });

            const pwdChecker = $('#txtPwd').TChecker({
                required: { rule: true, error: '请输入您的当前密码' },
                format: { rule: /^\w{6,20}$/, error: '您的当前密码格式不正确' }
            });


            const newPwdChecker = $('#txtNewPwd').TChecker({
                required: { rule: true, error: '请输入您的新密码' },
                format: { rule: /^\w{6,20}$/, error: '您的新密码格式不正确' }
            });
            const comfPwdChecker = $('#txtComfPwd').TChecker({
                required: { rule: true, error: '请确认您的新密码' },
                custom: function (value) {
                    if ($('#txtNewPwd').val() !== value) {
                        return { rule: false, error: '二次输入的密码不一致' };
                    }
                    return { rule: true };
                }
            });

            $('#popPwd').find('a.confirm-button').click(function () {
                let correct = pwdChecker.check();
                if (!correct) {
                    return false;
                }
                correct = newPwdChecker.check();
                if (!correct) {
                    return false;
                }
                correct = comfPwdChecker.check(false);
                if (!correct) {
                    return false;
                }

                const pwd = $('#txtPwd').val();
                const newpwd = $('#txtNewPwd').val();
                let $tishi = $('#txtComfPwd').nextAll('.tishi');
                const $alltishi = $('#popPwd').find('.tishi');

                this.sub12 = _this.authService.AuthPost(`${environment.sellerUserProfileApi}api/MyAccount/UpdatePassword/`,
                    { oldPassword: pwd, newPassword: newpwd })
                    .subscribe(function (res) {
                        const msg = res.json();
                        if (msg.actionResult !== '1') {
                            if (msg.actionResult === '5') {
                                $tishi = $('#txtPwd').nextAll('.tishi');
                            }
                            $tishi.html(msg.message);
                            $tishi.show();
                            return false;
                        }
                        $alltishi.html('');
                        $alltishi.hide();
                        alert(msg.message);
                        $('#popPwd').hide();

                        window.location.href = '/logout/';
                    });
                return false;
            });

        })();

    }

    goback() {
        // this.location.back();
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe(); }
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe(); }
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe(); }
        if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe(); }
        if (this.sub6 !== undefined && this.sub6 !== null) { this.sub6.unsubscribe(); }
        if (this.sub7 !== undefined && this.sub7 !== null) { this.sub7.unsubscribe(); }
        if (this.sub8 !== undefined && this.sub8 !== null) { this.sub8.unsubscribe(); }
        if (this.sub9 !== undefined && this.sub9 !== null) { this.sub9.unsubscribe(); }
        if (this.sub10 !== undefined && this.sub10 !== null) { this.sub10.unsubscribe(); }
        if (this.sub11 !== undefined && this.sub11 !== null) { this.sub11.unsubscribe(); }
        if (this.sub12 !== undefined && this.sub12 !== null) { this.sub12.unsubscribe(); }
    }
}
