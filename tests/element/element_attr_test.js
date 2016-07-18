describe('Locflow.Element attr specs', () => {

  it('returns the element attribute value', () => {
    let elm = Locflow.era.element(`
      <div my-attr="my-value"></div>
    `);

    expect(elm.attr('my-attr')).to.eq('my-value');
  });

  it('returns the element class, id and href', () => {
    let elm = Locflow.era.element(`
      <a href="my-href" class="my-class" id="my-id"></a>
    `);

    expect(elm.attr('href')).to.eq('my-href');
    expect(elm.attr('class')).to.eq('my-class');
    expect(elm.attr('id')).to.eq('my-id');
  });

  it('sets the value of custom properties', () => {
    let elm = Locflow.era.element(`
      <div my-attr="my-value"></div>
    `);
    elm.attr('my-attr', 'my-updated-value');

    expect(elm.attr('my-attr')).to.eq('my-updated-value');
  });

  it('sets the value of class, id and href', () => {
    let elm = Locflow.era.element(`
      <a href="my-href" class="my-class" id="my-id"></a>
    `);

    elm.attr('href', 'my-updated-href');
    elm.attr('class', 'my-updated-class');
    elm.attr('id', 'my-updated-id');

    expect(elm.attr('href')).to.eq('my-updated-href');
    expect(elm.attr('class')).to.eq('my-updated-class');
    expect(elm.attr('id')).to.eq('my-updated-id');
  });

  it('returns data attributes wiht `data` function', () => {
    let elm = Locflow.era.element(`
      <a data-behaviour="modal">Toggle</a>
    `);
    expect(elm.data('behaviour')).to.eq('modal');
    expect(elm.data('trigger')).to.be.null;
  });

  it('returns properties from the html element', () => {
    let elm = Locflow.era.element(`<button></button>`);
    expect(elm.prop('tagName')).to.eq('BUTTON');
  });
});
