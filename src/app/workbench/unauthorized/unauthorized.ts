import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'unauthorized',
  templateUrl: './unauthorized.html',
  styleUrls:['./unauthorized.scss']
})


export class unauthorized {

    ngOnInit() {
        $("#calendar").kendoCalendar({
            weekNumber: true,
            month: {
                content: '# if ($.inArray(+data.date, data.dates) != -1) { #' +
                '<div class="' +
                '# if (data.value < 10) { #' +
                "exhibition" +
                '# } else if ( data.value < 20 ) { #' +
                "party" +
                '# } else { #' +
                "cocktail" +
                '# } #' +
                '">#= data.value #</div>' +
                '# } else { #' +
                '#= data.value #' +
                '# } #',
                weekNumber: '<a class="italic">#= data.weekNumber #</a>'
            },
            footer: false,
            width: '400px'
        });
    }
}
