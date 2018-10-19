
class CustomSelect {
  constructor({type, container, dataPrefix, namespace ='cs-component', icon, keyCodes = [13, 86]}) {
    this.select = document.querySelector(`${type}${container}`);
    this.options = [...document.querySelectorAll(`${type}${container} > option`)];
    this.keyCodes = keyCodes;
    this.prefix = dataPrefix;
    this.icon = icon;
    this.values = [];
    this.parent = null;
    this.namespace = namespace;
    this.defaultValueIndex = 0;
    this.activeClass = `${this.namespace}__options-wrapper--isActive`;

    this.createOptions = null;
    this.createOptionWrapper = null;
    this.hiddenField = null;
    this.createSelect = null;
    this.createSelectWrapper = null;
    this.altContainer = null;
    this.currentValue = '';
    this.init = this.init.bind(this);
    this.changeViewOnBrackpoints = this.changeViewOnBrackpoints.bind(this);
    //this.init();
  }
  createEl(tagName, value = null, attrs = [], childrens = []) {
    let element = document.createElement(tagName);
    if(attrs.length !== 0 && Array.isArray(attrs) ) {
      attrs.forEach((attr) => {
        element.setAttribute(`${attr.type}`, `${attr.value}`);
      });
    }
    if(value !== null) {
      element.innerHTML = value;
    }
    if(childrens.length !== 0 && Array.isArray(childrens)) {
      childrens.forEach((children) => {
        element.appendChild(children);
      });
    }
    return element;
  }
  getOptionsValues() {
    this.options.forEach((option) => {
      this.values.push({
        value: option.value,
        content: option.innerHTML,
        altData: option.getAttribute('data-alt'),
        useAltStatus: option.getAttribute('data-use-alt-status'),
        unq: option.getAttribute('data-unq-img')
      });
    });
  }
  getParentElement() {
    this.parent = this.select.parentNode;
  }
  removeCustomSelect() {
    this.parent.removeChild(this.createSelectWrapper);
  }
  createSelectField() {
    this.createOptions = this.values.map((option) => {
      let opt = this.createEl('li', (option.useAltStatus === 'true' ? option.altData : option.content), [
        {
          type: 'class',
          value: `${this.namespace}__option`
        },
        {
          type: `data-${this.prefix}`,
          value: 'option'
        },
        {
          type: 'tabindex',
          value: '0'
        },{
          type: 'data-unq-img',
          value: option.unq
        }
      ]);
      return opt;
    });

    this.createOptionWrapper = this.createEl('ul', null, [
      {
        type: 'class',
        value: `${this.namespace}__options-wrapper`
      },
      {
        type: `data-${this.prefix}`,
        value: 'options-wrapper'
      }
    ],[...this.createOptions]);

    this.createSelect = this.createEl('input', null, [
      {
        type: 'class',
        value: `${this.namespace}__select`
      },
      {
        type: 'type',
        value: 'text'
      },
      {
        type: `data-${this.prefix}`,
        value: 'select'
      },
      {
        type: 'value',
        value: this.values[this.defaultValueIndex].content
      },
      {
        type: 'readonly',
        value: 'true'
      }
    ]);

    this.hiddenField = this.createEl('input', null, [
      {
        type: 'type',
        value: 'hidden'
      },
      {
        type: 'class',
        value: `${this.namespace}__current-output`
      },
      {
        type: `data-${this.prefix}`,
        value: 'hidden'
      },
      {
        type: 'value',
        value: this.values[this.defaultValueIndex].value
      },
      {
        type: 'name',
        value: this.select.getAttribute('name')
      }
    ]);

    let icon = this.createEl('span', this.icon, [
      {
        type: 'class',
        value: `${this.namespace}__icon`
      },
      {
        type: `data-${this.prefix}`,
        value: 'icon-down'
      }
    ]);
    this.altContainer = this.createEl('span', '', [
      {
        type: 'class',
        value: `${this.namespace}__alt-container`
      },
      {
        type: `data-${this.prefix}`,
        value: 'alt-container'
      }
    ]);

    this.createSelectWrapper = this.createEl('div', null, [
      {
        type: 'class',
        value: `${this.namespace}__select-container`
      },
      {
        type: 'style',
        value: 'display: inline-block;'
      },
      {
        type: `data-${this.prefix}`,
        value: 'select-wrapper'
      }
    ],[
      this.altContainer, this.createSelect, this.hiddenField, this.createOptionWrapper, icon
    ]);

    this.parent.appendChild(this.createSelectWrapper);
  }
  getCurrentData(e) {
    let at = e.target.getAttribute(`data-${this.prefix}`);
    if(at) {
      return {
        name: at,
        value: e.target.innerHTML,
        unq: e.target.getAttribute('data-unq-img')
      };
    }else{
      return false;
    }
  }
  isHidden(elem) {
  		return !elem.offsetWidth && !elem.offsetHeight;
  }
  getOnFocusEvent(el, dataAttrValue, keycodes = [13], callback) {
    el.addEventListener('focus', (event) => {
      if(this.getCurrentData(event).name === dataAttrValue) {
        el.addEventListener('keydown', (event) => {
          keycodes.forEach((key) => {
            if(event.keyCode === key) {
              callback();
            }
          });
        });
      }
    });
  }
  setAction(el, action, classname) {
    el.classList[action](classname);
  }

  settingValuesAction(event) {

    let ce = this.values.find((value) => {
      if( value.useAltStatus !== 'true' && value.content === this.getCurrentData(event).value ) {
        return {value: value, altData: false};
      }else if( value.useAltStatus === 'true' && (value.unq === this.getCurrentData(event).unq) ) {
        return {value: this.getCurrentData(event), altData: true};
      }

    });
    this.currentValue = ce;
    this.setCurrentValueInHidden(this.hiddenField, this.currentValue.value);
    this.setCurrentValue(this.createSelect, this.currentValue);
    this.setAction(this.createOptionWrapper, 'toggle', this.activeClass);
  }
  setDefaultValue() {
    let defaultValue = this.values[0];
    let currentData = null;

    if( defaultValue.useAltStatus !== 'true' ) {
      currentData = {value: defaultValue, altData: false};
    }else if( defaultValue.useAltStatus === 'true' ) {
      currentData = {value: defaultValue, altData: true};
    }

    this.setCurrentValueInHidden(this.hiddenField, currentData.value.value);
    this.setCurrentValue(this.createSelect, currentData.value);
  }
  setController() {
    /************************************/
    /******* FOCUS CONTROLLER SET *******/
    /************************************/
    this.getOnFocusEvent(this.createSelect, 'select', this.keyCodes, () => {
      this.setAction(this.createOptionWrapper, 'toggle', this.activeClass);
    });

    this.createOptions.forEach((option) => {
      this.getOnFocusEvent(option, 'option', this.keyCodes, () => {
        this.settingValuesAction(event);
      });
    });
    /************************************/
    /******* CLICK CONTROLLER SET *******/
    /************************************/
    this.createSelectWrapper.addEventListener('click', (event) => {
      //alert(this.getCurrentData(event).name);
      if( (this.getCurrentData(event).name === 'select-wrapper')
        || (this.getCurrentData(event).name === 'select')
        || (this.getCurrentData(event).name === 'icon-down')
        || (this.getCurrentData(event).name === 'alt-container'
        || event.target.tagName === 'use'
        )) {
        this.setAction(this.createOptionWrapper, 'toggle', this.activeClass);

      }
      if(this.getCurrentData(event).name === 'option') {
        this.settingValuesAction(event);
      }
    });
  }
  setCurrentValueInHidden(el, value) {
    el.value = value;
  }
  setCurrentValue(el, value) {
    if(value.useAltStatus === 'false') {
      el.value = value.content;
      this.altContainer.innerHTML = '';
    }else{
      el.value = '';
      this.altContainer.innerHTML = value.altData;
    }
  }
  removeSelect() {
    this.select.style.display = 'none';
  }
  changeViewOnBrackpoints() {
    this.removeCustomSelect();
    this.values = [];
    this.getOptionsValues();
    this.getParentElement();
    this.createSelectField();
    this.setController();
    this.setDefaultValue();
  }
  init() {
    this.getOptionsValues();
    this.getParentElement();
    this.createSelectField();
    this.removeSelect();
    this.setController();
    this.setDefaultValue();
  }
}


export default CustomSelect;
