import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../form.service';

@Component({
  selector: 'app-fill-form',
  templateUrl: './fill-form.component.html',
  styleUrls: ['./fill-form.component.scss']
})
export class FillFormComponent {
  forms: any[] = [];
  templates: any[] = [];
  formId: string | null | undefined = null;
  templateId: string | null | undefined = null;
  form: any;
  template: any;
  editMode = false
  filledForm = new FormGroup({});
  formTitleGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    formId: new FormControl('', Validators.required),
  });

  templateTitleGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    templateId: new FormControl('', Validators.required),
  });

  constructor(private formService: FormService) { }

  ngOnInit(): void {
    this.formService.getAllForms().subscribe((forms) => {
      this.forms = forms;
    });
    this.formService.getAllTemplates().subscribe((templates) => {
      this.templates = templates;
    });
  }

  loadTemplate() {
    this.editMode = false
    this.templateId = this.templateTitleGroup.get('templateId')?.value;
    this.template = this.templates.find((template) => template.id === this.templateId);
    for (let field of this.template.fields) {
      field = {...field, value: ''}
    }
    console.log(this.template)
    
  }

  loadForm() {
    this.editMode = true
    this.formId = this.formTitleGroup.get('formId')?.value;
    this.form = this.forms.find((form) => form.id === this.formId);
    console.log(this.form)
    
  }

  async saveFilledForm() {
    if (this.editMode) {
      this.formService.saveFilledForm(this.form)
    } else {
      this.formService.saveFilledForm(this.template)
    }
    
  }
}

