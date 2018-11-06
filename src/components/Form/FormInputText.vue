<script>
export default {
  name: 'form-input-text',
  data () {
    return {
      hasFocused: false,
      inputHeight: null,
      errors: [],
      focused: false,
      tabFocused: false,
      lazyValue: this.value
    }
  },
  props: {
    autofocus: Boolean,
    autogrow: Boolean,
    autocomplete: Boolean,
    disabled: Boolean,
    counter: Boolean,
    label: String,
    multiLine: Boolean, // 多行textarea
    singleLine: Boolean, // 单行 text
    hint: String,
    rules: {
      type: Array,
      default: () => []
    },
    tabindex: {
      default: 0
    },
    value: {
      required: false
    },
    maxlength: [Number, String],
    min: {
      type: [Number, String],
      default: 0
    },
    max: {
      type: [Number, String],
      default: 25
    },
    type: {
      type: String,
      default: 'text'
    },
    name: String,
    readonly: Boolean,
    rows: {
      default: 5
    }
  },
  watch: {
    focused () {
      this.hasFocused = true
      if (!this.focused) {
        this.$emit('blur')
        this.$emit('change', this.lazyValue)
      } else {
        this.$emit('focus')
      }
    },
    value () {
      this.lazyValue = this.value
      this.validate()
      this.multiLine && this.autogrow && (this.calculateInputHeight(), this.decreaseInputHeight())
    },
    rules () {
      this.validate()
    }
  },
  computed: {
    inputClasses () {
      return {
        'ms-form_base': true,
        'ms-form__text': true,
        'ms-form__single-line': this.singleLine,
        'ms-form__multi-line': this.multiLine,
        'ms-form__focused': this.focused,
        'ms-form__dirty': this.isDirty,
        'ms-form__error': this.hasError || this.errors.length > 0,
        'ms-form__required': this.required,
        'ms-form__disabled': this.disabled
      }
    },
    hasError () {
      return this.errors.length !== 0 ||
        !this.validateIsValid()
    },
    isDirty () {
      return this.lazyValue !== null &&
        typeof this.lazyValue !== 'undefined' &&
        this.lazyValue.toString().length > 0
    },
    inputValue: {
      get () {
        return this.value
      },
      set (val) {
        this.lazyValue = val
      }
    }
  },
  mounted () {
    this.validate()
    this.multiLine && this.autogrow && (this.calculateInputHeight(), this.decreaseInputHeight())
    this.autofocus && this.focus()
  },
  methods: {
    calculateInputHeight () {
      const height = this.$refs.input.scrollHeight
      const minHeight = this.rows * 24
      this.inputHeight = height < minHeight ? minHeight : height
    },
    decreaseInputHeight () {
      const enterNums = this.value.split('\n').length
      const minHeight = this.rows * 24
      const decreaseHeight = enterNums * 24
      this.inputHeight = decreaseHeight > minHeight ? decreaseHeight : minHeight
    },
    onInput (e) {
      this.inputValue = e.target.value
      this.multiLine && this.autogrow && (this.calculateInputHeight(), this.decreaseInputHeight())
      this.$emit('input', e.target.value)
    },
    blur () {
      this.validate()
      this.$nextTick(() => (this.focused = false))
    },
    focus () {
      this.focused = true
      this.$refs.input.focus()
    },
    validate () {
      this.errors = []
      this.rules.forEach(rule => {
        const valid = typeof rule === 'function'
          ? rule(this.value)
          : rule

        if (valid !== true) {
          this.errors.push(valid)
        }
      })
    },
    validateIsValid () {
      return (!this.required ||
        (this.required &&
          this.inputValue) ||
        !this.hasFocused ||
        (this.hasFocused && this.focused))
    },
    genLabel (h) {
      return h('label', {
        'class': {
          'ms-form__label': true
        }
      }, this.label)
    },
    toggle () {},
    genMessages () {
      let messages = []

      if ((this.hint &&
            this.focused ||
            this.hint &&
            this.persistentHint) &&
          this.errors.length === 0
      ) {
        messages = [this.genHint()]
      } else if (this.errors.length) {
        messages = this.errors.map(i => this.genError(i))
      }

      return this.$createElement(
        'transition-group',
        {
          'class': {
            'v-input__messages': true
          },
          props: {
            tag: 'div',
            name: 'slide-y-transition'
          }
        },
        messages
      )
    },
    genHint () {
      return this.$createElement('div', {
        'class': 'v-input__hint',
        key: this.hint
      }, this.hint)
    },
    genError (error) {
      return this.$createElement(
        'div',
        {
          'class': 'v-input__error',
          key: error
        },
        error
      )
    },
    genInput (h) {
      const tag = this.multiLine ? 'textarea' : 'input'
      const inputData = {
        style: {
          'height': this.inputHeight && `${this.inputHeight}px`
        },
        domProps: {
          disabled: this.disabled,
          required: this.required,
          value: this.lazyValue,
          autofucus: this.autofocus
        },
        attrs: {
          tabindex: this.tabindex,
          readonly: this.readonly
        },
        on: {
          blur: this.blur,
          input: this.onInput,
          focus: this.focus
        },
        ref: 'input'
      }
      if (this.autocomplete) inputData.domProps.autocomplete = true
      if (this.name) inputData.attrs = { name: this.name }
      if (this.maxlength) inputData.attrs.maxlength = this.maxlength

      if (this.multiLine) {
        inputData.domProps.rows = this.rows
      } else {
        inputData.domProps.type = this.type
      }

      return h(tag, inputData)
    }
  },
  render (h) {
    const children = []
    if (this.label) {
      children.push(this.genLabel(h))
    }
    children.push(
      h('div', {
        'class': 'ms-form__input'
      }, [this.genInput(h)])
    )
    children.push(
      h('div', {
        'class': 'ms-form__infos'
      }, [this.genMessages()])
    )
    return h('div', {
      'class': this.inputClasses,
      attrs: {
        tabindex: -1
      },
      on: {
        blur: () => (this.tabFocused = false),
        click: () => (this.tabFocused = false),
        keyup: e => {
          if ([9, 16].includes(e.keyCode)) {
            this.tabFocused = true
          }

          if (e.keyCode === 13) {
            this.toggle()
          }
        }
      }
    }, children)
  }
}
</script>

<style lang="less">
.ms-form{
  &_base {
    position: relative;
    width: 100%;
    min-width: 24px;
    margin: 18px 0;
    outline: none;
  }
  &__label {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    min-width: 0;
    max-width: 80%;
    height: 30px;
    line-height: 32px;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: left;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-transform-origin: top left;
    transform-origin: top left;
    -webkit-transition: .4s cubic-bezier(.25,.8,.25,1);
    transition: .4s cubic-bezier(.25,.8,.25,1);
    z-index: 0;
  }

  &__input {
    min-width: 0;
    min-height: 30px;
    input {
      min-width: 0;
      width: 100%;
      height: 30px;
      margin: 0;
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border: 0;
      outline: 0;
    }
    textarea {
      width: 100%;
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border: 0;
      outline: 0;
      line-height: 24px;
      padding: 0;
    }
  }
  &__infos {
    display: flex;
    position: relative;
    width: 100%;
    min-height: 22px;
    padding-top: 4px;
    font-size: 12px;
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: rgba(0,0,0,.12);
      content: "";
      z-index: 0;
    }
    &::after {
      position: absolute;
      top: -1px;
      left: 0;
      width: 0;
      height: 2px;
      content: "";
      background-color: #2196f3;
      -webkit-transition: .3s cubic-bezier(.4,0,.2,1);
      transition: .3s cubic-bezier(.4,0,.2,1);
      z-index: 1;
    }
  }
  &__dirty {
    .ms-form__label {
      -webkit-transform: translate3d(0,-18px,0) scale(.75);
      transform: translate3d(0,-18px,0) scale(.75)
    }
    .ms-form__infos {
      &::after {
        width: 100%;
      }
    }
  }
  &__focused{
    .ms-form__label {
      -webkit-transform: translate3d(0,-18px,0) scale(.75);
      transform: translate3d(0,-18px,0) scale(.75)
    }
    .ms-form__infos {
      &::after {
        width: 100%;
      }
    }
  }
}
</style>
