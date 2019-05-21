import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Product } from './model';

@Component({
    selector: 'kendo-grid-edit-form',
    styles: [
      "input[type=text] { width: 100%; }"
    ],
    template: `
        <kendo-dialog *ngIf="active" (close)="closeForm()">
          <kendo-dialog-titlebar>
            {{ isNew ? 'Add new product' : 'Edit product' }}
          </kendo-dialog-titlebar>

            <form novalidate [formGroup]="editForm">
                <div class="form-group">
                    <label for="ProductName" class="control-label">Product name</label>

                    <input type="text" class="k-textbox" formControlName="ProductName" />

                    <div class="k-tooltip k-tooltip-validation" [hidden]="editForm.controls.ProductName.valid || editForm.controls.ProductName.pristine">
                        ProductName is required
                    </div>
                </div>
                <div class="form-group">
                    <label for="UnitPrice" class="control-label">Unit price</label>

                    <input type="text" class="k-textbox" formControlName="UnitPrice" />
                </div>
                <div class="form-group">
                    <label for="UnitsInStock" class="control-label">Units in stock</label>

                    <input type="text" class="k-textbox" formControlName="UnitsInStock" />

                    <div class="k-tooltip k-tooltip-validation" [hidden]="editForm.controls.UnitsInStock.valid || editForm.controls.UnitsInStock.pristine">
                        Units must be between 0 and 99
                    </div>
                </div>
                <div class="form-group">
                    <label>
                      <input type="checkbox" formControlName="Discontinued" />
                      Discontinued product
                    </label>
                </div>
            </form>

            <kendo-dialog-actions>
                <button class="k-button" (click)="onCancel($event)">Cancel</button>
                <button class="k-button k-primary" [disabled]="!editForm.valid" (click)="onSave($event)">Save</button>
            </kendo-dialog-actions>
        </kendo-dialog>
    `
})
export class GridEditFormComponent {
    private editForm = new FormGroup({
        'ProductID': new FormControl(),
        'ProductName': new FormControl("", Validators.required),
        'UnitPrice': new FormControl(0),
        'UnitsInStock': new FormControl("", Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,2}')])),
        'Discontinued': new FormControl(false)
    });

    private active: boolean = false;
    @Input() public isNew: boolean = false;

    @Input() public set model(product: Product) {
        this.editForm.reset(product);

        this.active = product !== undefined;
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<Product> = new EventEmitter();

    public onSave(e): void {
        e.preventDefault();
        this.save.emit(this.editForm.value);
        this.active = false;
    }

    public onCancel(e): void {
        e.preventDefault();
        this.closeForm();
    }

    private closeForm(): void {
        this.active = false;
        this.cancel.emit();
    }
}
