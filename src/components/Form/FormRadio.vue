<script>
export default {
  name: 'form-radio',
  props: {
    value: {
      required: false
    },
    disabled: Boolean,
    label: [Number, String]
  },
  computed: {
    isActive: function () {
      return this.label === this.value
    },
    classes: function () {
      return {
        'ms-form-radio': true,
        'ms-form-radio__disabled': this.disabled,
        'ms-form-radio__active': this.isActive
      }
    },
    iconClasses: function () {
      return {
        'ms-form-radio__icon': true,
        'icon': this.disabled,
        'ms-form-radio__icon-outline': !this.isActive,
        'ms-form-radio__icon-checkmark': this.isActive
      }
    }
  },
  render: function (h) {
    var self = this
    var children = []
    children.push(h('i', {
      'class': this.iconClasses
    }))
    children.push(h('span', {
      'class': 'ms-form-radio__text'
    }, this.$slots.default))
    return h('div', {
      'class': this.classes,
      on: {
        click: function () {
          if (!self.disabled) {
            self.$emit('input', self.label)
          }
        }
      }
    }, children)
  }
}
</script>

<style lang="less">
.ms-form-radio {
  display: inline-block;
  vertical-align: middle;
  margin: 8px 10px 0 0;
  cursor: pointer;
}
.ms-form-radio .ms-form-radio__icon{
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  font-size: 22px;
  color: #5FB878;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #999;
  position: relative;
}
.ms-form-radio .ms-form-radio__icon::after {
  position: absolute;
  content: '';
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.ms-form-radio .ms-form-radio__icon-checkmark::after {
  background: #5FB878;
}
.ms-form-radio__text {
  display: inline-block;
  vertical-align: middle;
}
.ms-form-radio__active  {
  display: inline-block;
  vertical-align: middle;
}
.ms-form-radio .ms-form-radio__icon-checkmark {
  background: #fff;
  border: 1px solid #5FB878;
}
</style>
