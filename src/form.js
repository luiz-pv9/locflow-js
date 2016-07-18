(function() {
  let singleValueTypes = [
    'text', 'password', 'submit', 'textarea', 'email', 'hidden', 'color', 
    'number'
  ];

  Locflow.Form = class Form {
    constructor(form) {
      this.form = form;
      this.serialized = {};
    }

    serialize() {
      for(let i=0, len=this.form.elements.length; i < len; i++) {
        let element = this.form.elements[i];
        this.serializeInput(element);
      }
      if(this.form.hasAttribute('data-format')) {
        this.serialized['_format'] = this.form.getAttribute('data-format');
      }
      return this.serialized;
    }

    submit() {
      let ev = Locflow.dispatcher.dispatch('submit', {
        data: { form: this.form }
      });
      if(ev.defaultPrevented) return;
      let method = this.form.getAttribute('data-method') || this.form.method;
      let submitRequest = new Locflow.Request(method, this.form.action, {
        headers: {
          'Accept': 'application/json, text/javascript'
        }
      });
      submitRequest.success(this.onSubmitSuccess.bind(this));
      submitRequest.error(this.onSubmitSuccess.bind(this));
      submitRequest.send(this.serialize());
    }

    onSubmitSuccess(response, status, xhr) {
      Locflow.dispatcher.dispatchOn([document, this.form], 'submit-success', {
        data: {
          form: this.form, response, status
        }
      });
    }

    onSubmitError(response, status, xhr) {
      Locflow.dispatcher.dispatchOn([document, this.form], 'submit-error', {
        data: {
          form: this.form, response, status
        }
      });
    }

    serializeInput(elm) {
      if(singleValueTypes.indexOf(elm.type) !== -1) {
        this.serializeSingleValue(elm);
      }
      if(elm.type === 'select-one') {
        this.serializeSelectOne(elm);
      }
      if(elm.type === 'checkbox') {
        this.serializeCheckbox(elm);
      }
      if(elm.type === 'radio') {
        this.serializeRadio(elm);
      }
      if(elm.type === 'select-multiple') {
        this.serializeSelectMultiple(elm);
      }
    }

    serializeSingleValue(elm) {
      this.serialized[elm.name] = elm.value;
    }

    serializeSelectOne(elm) {
      let option = elm.options[elm.selectedIndex];
      if(option) {
        if(option.value.trim() !== '') {
          this.serialized[elm.name] = option.value;
        }
      }
    }

    serializeCheckbox(elm) {
      let checkboxes = Locflow.elm(this.form).query(`*[name="${elm.name}"]`);
      if(checkboxes.length === 1 && elm.checked) {
        this.serialized[elm.name] = 'on';
      } else if(checkboxes.length > 1) {
        let values = [];
        for(let i=0, len=checkboxes.length; i < len; i++) {
          let checkbox = checkboxes[i];
          if(checkbox.checked) {
            values.push(checkbox.value);
          }
        }
        this.serialized[elm.name] = values;
      }
    }

    serializeRadio(elm) {
      let radios = Locflow.elm(this.form).query(`*[name="${elm.name}"]`);
      for(let i=0, len=radios.length; i < len; i++) {
        let radio = radios[i];
        if(radio.checked) {
          this.serialized[elm.name] = radio.value
        }
      }
    }

    serializeSelectMultiple(elm) {
      let options = elm.options;
      let selected = [];
      for(let i=0, len=options.length; i < len; i++) {
        let option = options[i];
        if(option.selected) {
          selected.push(option.value);
        }
      }
      if(selected.length > 0) {
        this.serialized[elm.name] = selected;
      }
    }
  };
})();
