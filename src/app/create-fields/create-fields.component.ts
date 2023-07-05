import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../form.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-create-fields',
  templateUrl: './create-fields.component.html',
  styleUrls: ['./create-fields.component.scss']
})
export class CreateFieldsComponent {
  forms: any[] = [];
  fields: any[] = [];
  formTitle: string = '';
  selectedFormId: string | null | undefined = null;

  formTitleGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    formId: new FormControl('', Validators.required),
  });
  fieldForm = new FormGroup({
    type: new FormControl('', Validators.required),
    label: new FormControl('', Validators.required),
    alignment: new FormControl('', Validators.required),
    options: new FormControl([]as string[]) ,
  });

  fieldTypes: string[] = ['text', 'number', 'checkbox', 'select', 'radio'];
  alignments: string[] = ['25', '50', '75', '100'];

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.formService.getAllForms().subscribe((forms) => {
      this.forms = forms;
    });
  }

  addFieldToArray(fieldForm: FormGroup) {
    if (fieldForm.valid) {
      const field = fieldForm.value;
      this.fields.push(field); // Add the field to the fields array
      fieldForm.reset(); // Reset the form
    }
  }

  addFieldOption(option: string) {
    if (option) {
      const options = this.fieldForm.get('options')?.value || [];
      options.push(option);
      this.fieldForm.get('options')?.setValue(options);
    }
  }
  saveFields() {
    this.formService.saveFormToFirestore({title: this.formTitle, fields:this.fields});
  }

  loadForm() {
    this.selectedFormId = this.formTitleGroup.get('formId')?.value;
    const selectedFormId = this.formTitleGroup.get('formId')?.value;
    const selectedForm = this.forms.find((form) => form.id === selectedFormId);
    console.log(selectedForm)
    if (selectedForm) {
      this.formTitle = selectedForm.title;
      this.fields = selectedForm.fields;
  
      console.log(this.formTitle)
      console.log(this.fields)
    }
  }

  updateForm() {
    if (this.selectedFormId) {
      this.formService.editFormInFirestore(this.selectedFormId, {
        title: this.formTitle,
        fields: this.fields
      }).then(() => {
        console.log('Form updated successfully');
      }).catch((error) => {
        console.error('Error updating form:', error);
      });
    } else {
      console.error('No form ID provided');
    }
  }

  removeField(index: number) {
    this.fields.splice(index, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
  }

}
