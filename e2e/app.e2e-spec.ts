import { PowerSalePage } from './app.po';

describe('power-sale App', () => {
  let page: PowerSalePage;

  beforeEach(() => {
    page = new PowerSalePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
