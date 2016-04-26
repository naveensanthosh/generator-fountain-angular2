<% if (modules === 'webpack') { -%>
import 'zone.js/dist/zone';
<% } -%>
import 'zone.js/dist/async-test';
import Title from './title';
import ngTest from 'angular2/testing';

ngTest.describe('title component', function () {
  ngTest.it('should render \'Allo, \'Allo!', ngTest.async(ngTest.inject([ngTest.TestComponentBuilder], function (tcb) {
    tcb.createAsync(Title)
      .then(function (fixture) {
        fixture.detectChanges();
        var title = fixture.nativeElement;
        ngTest.expect(title.querySelector('h1').textContent.trim()).toBe('\'Allo, \'Allo!');
      });
  })));
});