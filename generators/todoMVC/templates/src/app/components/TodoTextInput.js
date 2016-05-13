var ng = require('@angular/core');

module.exports = ng.Component({
  selector: 'TodoTextInput',
  template:
    '<input #myInput' +
      ' [ngClass]="{\'edit\': editing, \'new-todo\': newTodo}"' +
      ' [(ngModel)]="text"' +
      ' (keypress)="handleSubmit($event)"' +
      ' (blur)="handleBlur()"' +
      ' [placeholder]="placeholder"' +
      ' type="text"' +
    '/>',
  inputs: [
    'newTodo',
    'editing',
    'placeholder',
    'text'
  ],
  outputs: ['onSave'],
  queries: {
    input: new ng.ViewChild('myInput')
  }
})
.Class({
  constructor: [ng.Renderer, function TodoTextInputController(renderer) { // https://github.com/angular/angular/issues/7507
    this.renderer = renderer;
    this.onSave = new ng.EventEmitter(false);
  }],

  ngAfterViewInit: function () {
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []);
  },

  handleBlur: function () {
    if (!this.newTodo) {
      this.onSave.emit(this.text);
    }
  },

  handleSubmit: function (e) {
    if (e.keyCode === 13) {
      this.onSave.emit(this.text);
      if (this.newTodo) {
        this.text = '';
      }
    }
  }
});
