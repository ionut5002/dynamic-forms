import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss']
})
export class DynamicInputComponent {
  @Input() inputModel: any;
  @Input() control: any;
  @Output() remove = new EventEmitter<void>();

  onRemove() {
    this.remove.emit();
  }
}
