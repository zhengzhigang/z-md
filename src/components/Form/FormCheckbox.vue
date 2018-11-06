<script>
export default {
  name: 'form-checkbox',
  data () {
    return {
      inputValue: this.value
    }
  },
  props: {
    value: {
      required: false
    },
    disabled: Boolean,
    label: [Number, String, Boolean]
  },
  computed: {
    isActive () {
      if ((Array.isArray(this.value))) {
        return this.value.indexOf(this.label) !== -1
      }
      if (typeof (this.value) === 'boolean') {
        return this.value
      }
      return this.label === this.value
    },
    classes () {
      return {
        'v-form-checkbox': true,
        'v-form-checkbox__disabled': this.disabled,
        'v-form-checkbox__active': this.isActive
      }
    },
    iconClasses () {
      return {
        'v-form-checkbox__icon': true,
        'icon': this.disabled,
        'ion-ios-checkmark-outline': !this.isActive,
        'ion-ios-checkmark': this.isActive
      }
    }
  },
  render (h) {
    const children = []
    children.push(h('i', {
      'class': this.iconClasses
    }))
    children.push(h('span', {
      'class': 'v-form-checkbox__text'
    }, this.$slots.default))
    return h('div', {
      'class': this.classes,
      on: {
        click: () => {
          if (!this.disabled) {
            if (Array.isArray(this.inputValue)) {
              let isHasValue = this.inputValue.indexOf(this.label)
              if (isHasValue === -1) {
                this.inputValue.push(this.label)
              } else {
                this.inputValue.splice(isHasValue, 1)
              }
            } else if (typeof (this.value) === 'boolean') {
              this.inputValue = !this.value
            } else {
              this.inputValue = !this.label
            }
            this.$emit('input', this.inputValue)
          }
        }
      }
    }, children)
  }
}
</script>

<style lang="less">
.v-form-checkbox {
  display: inline-block;
  vertical-align: middle;
  line-height: 28px;
  margin: 6px 10px 0 0;
  padding-right: 10px;
  cursor: pointer;
  font-size: 0;
  i {
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
    font-size: 22px;
    color: #5FB878;
  }
  &__text {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
  }
  &__active {

  }
}
</style>
