describe('Locflow.Form specs', () => {
  let xhr, requests;
  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    xhr.onCreate = (req) => { requests.push(req); };
    requests = [];
  });

  afterEach(() => {
    Locflow.elm('form.test').remove();
  });

  function createForm(html) {
    let form = Locflow.elm(`
      <form class="test" action="/submit" method="POST">
        ${html}
      </form>
    `);
    return new Locflow.Form(form[0]);
  }

  describe('#submit', () => {
    it('sends the request', () => {
      let form = createForm(``);
      form.submit();
      expect(requests).to.have.length(1);
      expect(requests[0].url).to.eq(new Locflow.Url('/submit').toString());
      expect(requests[0].method).to.eq('post');
    });

    it('sends with method in data-method', () => {
      let form = createForm(``);
      Locflow.elm(form.form).data('method', 'put');
      form.submit();
      expect(requests[0].method).to.eq('put');
    });
  });

  describe('#serialize', () => {
    it('text input', () => {
      let form = createForm(`
        <input name="name" value="Luiz Vasconcellos" />
      `);
      expect(form.serialize()).to.deep.eql({name: 'Luiz Vasconcellos'});
    });

    it('password input', () => {
      let form = createForm(`
        <input type="password" name="password" value="123456" />
      `);
      expect(form.serialize()).to.deep.eql({password: '123456'});
    });

    it('email input', () => {
      let form = createForm(`
        <input type="email" name="email" value="luizpvasc@gmail.com" />
      `);
      expect(form.serialize()).to.deep.eql({email: 'luizpvasc@gmail.com'});
    });

    it('hidden input', () => {
      let form = createForm(`
        <input type="hidden" name="val" value="100" />
      `);
      expect(form.serialize()).to.deep.eql({val: '100'});
    });

    it('color input', () => {
      let form = createForm(`
        <input type="color" name="color" value="#ffffff" />
      `);
      expect(form.serialize()).to.deep.eql({color: '#ffffff'});
    });

    it('number input', () => {
      let form = createForm(`
        <input type="number" name="age" value="18" />
      `);
      expect(form.serialize()).to.deep.eql({age: '18'});
    });

    it('empty values', () => {
      let form = createForm(`
        <input name="name" value="" />
      `);
      expect(form.serialize()).to.deep.eql({name: ''});
    });

    it('single select', () => {
      let form = createForm(`
        <select name="color">
          <option value="red" selected>Red</option>
          <option value="blue">Blue</option>
        </select>
      `);
      expect(form.serialize()).to.deep.eql({color: 'red'});
    });

    it('empty single select', () => {
      let form = createForm(`
        <select name="color">
          <option value="">Select</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
        </select>
      `);
      expect(form.serialize()).to.deep.eql({});
    });

    it('textarea', () => {
      let form = createForm(`
        <textarea name="message">Hello, world!</textarea>
      `);
      expect(form.serialize()).to.deep.eql({message: 'Hello, world!'});
    });

    it('empty textarea', () => {
      let form = createForm(`
        <textarea name="message"></textarea>
      `);
      expect(form.serialize()).to.deep.eql({message: ''});
    });

    it('multiple checkbox', () => {
      let form = createForm(`
        <input type="checkbox" name="role" value="admin" />
        <input type="checkbox" name="role" value="manager" checked />
      `);
      expect(form.serialize()).to.deep.eql({role: ['manager']});
    });

    it('single checkbox', () => {
      let form = createForm(`
        <input type="checkbox" name="enable_premium" checked />
      `);
      expect(form.serialize()).to.deep.eql({enable_premium: 'on'});
    });
    
    it('ignores empty checkbox', () => {
      let form = createForm(`
        <input type="checkbox" name="enable_premium" />
      `);
      expect(form.serialize()).to.deep.eql({});
    });

    it('radio input', () => {
      let form = createForm(`
        <input type="radio" name="color" value="red" />
        <input type="radio" name="color" value="blue" checked />
      `);
      expect(form.serialize()).to.deep.eql({color: 'blue'});
    });

    it('ignores empty radio', () => {
      let form = createForm(`
        <input type="radio" name="color" value="red" />
        <input type="radio" name="color" value="blue"/>
      `);
      expect(form.serialize()).to.deep.eql({});
    });

    it('serializes select multiple', () => {
      let form = createForm(`
        <select multiple name="colors">
          <option value="red" selected></option>
          <option value="blue" selected></option>
        </select>
      `);
      expect(form.serialize()).to.deep.eql({colors: ['red', 'blue']});
    });

    it('ignores empty select multiple', () => {
      let form = createForm(`
        <select multiple name="colors">
          <option value="red"></option>
          <option value="blue"></option>
        </select>
      `);
      expect(form.serialize()).to.deep.eql({});
    });
  });
});
