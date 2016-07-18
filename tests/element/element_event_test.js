describe('Locflow.Element event specs', () => {
  let elm
  beforeEach(() => {
    elm = Locflow.era.element(`
      <button>Hello</button>
    `)
  })

  it('binds the click event to the button', () => {
    expect(elm.on('click', ev => {})).to.eq(elm)
  })

  it('calls the event handler with the given event name', () => {
    let called = false
    elm.on('click', ev => { called = true })
    elm.trigger('click')

    expect(called).to.be.true
  })

  it('calls multiple event handlers with the same name', () => {
    let called = 0
    elm.on('click', ev => { called += 1 })
    elm.on('click', ev => { called += 1 })
    elm.trigger('click')

    expect(called).to.eq(2)
  })

  it('removes bind with the `off` method', () => {
    let called = 0
    elm.on('click', ev => { called += 1 })
    elm.off('click').on('click', ev => { called += 1 })
    elm.trigger('click')

    expect(called).to.eq(1)
  })

  it('removes a specific event bind', () => {
    let called = 0
    let bind1 = function() { called += 1 }
    let bind2 = function() { called += 1 }
    elm.on('click', bind1)
    elm.off('click', bind1).on('click', bind2)
    elm.trigger('click')

    expect(called).to.eq(1)
  })
})
