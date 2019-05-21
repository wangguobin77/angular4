import { Component } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    FormGroup,
    FormControl
} from '@angular/forms';

@Component({
  selector: 'loading',
  template: `
    <section class="loaders"><span class="loader loader-quart"> </span> Loading...</section>
  `
})
export class Loading {
    
}