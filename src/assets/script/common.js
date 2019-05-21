//公用弹窗
var PopupWin = {
    OpenEditWindow: function (kendoName,url, Id) {
        $('#' + kendoName).html('')
        $('#' + kendoName).data("kendoWindow").title('编辑').center().refresh(url + "?Id=" + Id).open();
    },
    OpenNewWindow: function (kendoName,url) {
        $('#' + kendoName).data("kendoWindow").title('新增').center().refresh(url).open();
    },
    Complete: function (kendoName) {
        $('#' + kendoName).data('kendoWindow').close();
    },
};
//
var Utility = {
    CloseWindow: function (id) {
        $('#' + id).data('kendoWindow').close();
    },
    CloseIframeWindow: function (id) {
        window.parent.$('#' + id).data('kendoWindow').close();
    },
    RefreshGrid: function (id) {
        var grid = $('#' + id).data('kendoGrid');
        var dataSource = grid.dataSource;
        dataSource.read({ page: 1, skip: 0, filter: null });
        grid.refresh();
    }
}
//在Form中，加入参数，避免重复提交
function onBegin(formId) {
    var obj = $('#' + formId);
    if (obj.data('alreadySent') == 'true') {
        alert("请勿重复提交表单")
        return false;
    } else {
        $('#' + formId).data('alreadySent', 'true');
    }
}

function removeAlreadSent(formId) {
    var obj = $('#' + formId);
    obj.removeData('alreadySent');
}

//Form提交失败处理，如果失败不是500，给出相应提示
function onFailure(xhr, status, error, formId) {
    if (formId != null) {
        $('#' + formId).removeData('alreadySent');
    }
    if (xhr.status != '500') {
        alert('调用程序产生错误, 请检查您的网络连接');
    }
}

//为文本框写的简易校验器
//var nameChecker = $("#txtName").TChecker({
//    required: { rule: true, error: "请输入您的名字" },
//    format: { rule: /^[a-z]+$/, error: "您的名字格式不正确" }
//});
$.fn.TChecker = function (opts) {
    var $this = this;
    var $validator = $this.nextAll(".tishi");
    var status = 0;

    if (opts.ele) $validator = $(opts.ele);

    var doError = function (error, msg) {
        if (error) {
            $validator.html(msg);
            $validator.show();
            $this.focus();
            return true;
        }
        else {
            $validator.html("");
            $validator.hide();
            return false;
        }
    }

    $this.blur(function () {
        status = 1;
        var value = $this.val();

        if (opts.required) {
            if (doError(opts.required.rule && value == "", opts.required.error)) return false;
        }
        if (opts.format) {
            if (doError(!opts.format.rule.test(value), opts.format.error)) return false;
        }
        if (typeof opts.custom == "function") {
            var result = opts.custom(value);
            if (doError(!result.rule, result.error)) return false;
        }
    });

    return {
        correct: $validator.html() === "",
        check: function (once) {
            once = (once != false);
            if (status === 0 || !once) {
                $this.blur();
            }
            var correct = $validator.html() === "";
            if (!correct) $this.focus();
            return correct;
        }
    };
};

//加减乘除计算
function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}

function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) { }
    try {
        c += e.split(".")[1].length;
    } catch (f) { }
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

function div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) { }
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) { }
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}

/** 
 * 售电云html工具类 v2017.2.23                                                                                                                                     
 * 
 */
var config = {};

//日期格式化 TryDateFormat(dateObject, "yyyy/MM/dd");
function TryDateFormat(date, fmt) {
    if (Object.prototype.toString.call(date) == "[object Date]") {
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    else {
        console.log(`${fmt}is not date object`);
        return null;
    }
}

window.alert = function(str, callback) {
    var selector = "#dialogB4FD6DB2BD614D9BBFA6682AF963D6F7";
    if ($(selector).length == 0) {
        $('body').append("<div id='dialogB4FD6DB2BD614D9BBFA6682AF963D6F7'></div>");
    }
    var dialog = $(selector);
    //if ($("#dialog").data("kendoDialog") == undefined) {
    dialog.kendoDialog({
        width: "400px",
        title: "",
        closable: false,
        modal: false,
        content: "<p class='text-center'>" + str + "</p>",
        actions: [
            { text: '确认', primary: true, action: callback, className: "a-button" }
        ]
    });
    //}
    //else {
    //    dialog.data("kendoDialog").content("<p class='text-center'>" + str + "</p>");
    //}
    dialog.data("kendoDialog").open();
}


/* 公共事件绑定 */
$(function () {
    $("div.popup-cart .pop-del,div.popup-cart .del").click(function () {
        $(this).closest("div.popup-cart").hide();
    });
//$(document).on("click", "div.popup-box .icon-guanbipsd", function () {
//    $(this).closest("div.popup-box").hide();
//});
});
