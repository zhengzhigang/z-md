<script>
export default {
  name: 'form-select',
  data () {
    return {
      inputValue: this.value,
      isBooted: false,
      menuActive: false,
      searchValue: null,
      content: [],
      filteredItems: null
    }
  },
  props: {
    autocomplete: Boolean,
    items: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: 'text'
    },
    itemValue: {
      type: String,
      default: 'value'
    },
    maxHeight: {
      type: [Number, String],
      default: 300
    },
    filter: Function,
    multiple: Boolean,
    chips: Boolean,
    label: [String, Number],
    disabled: Boolean,
    value: {
      required: false
    }
  },

  computed: {
    classes () {
      return {
        'v-form-select': true,
        'v-form-select__chips': this.chips,
        'v-form-select__multiple': this.multiple,
        'v-form-select__disabled': this.disabled,
        'v-form-select__active': this.menuActive
      }
    }
  },

  watch: {
    inputValue (val) {
      this.$emit('input', val)
    },
    value (val, oldVal) {
      this.inputValue = val
    }
  },
  created () {
    this.fillDefaults()
  },
  methods: {
    fillDefaults () {
      let items = []
      if (this.inputValue === null) {
        this.inputValue = []
        this.content = []
      }
      if (!this.multiple) {
        this.content = []
        this.items.find((item) => {
          if (this.value === this.getValue(item)) {
            this.content.push(this.getText(item))
          }
        })
        this.menuActive = false
        this.filteredItems = this.searchValue ? this.filterSearch() : this.items
      } else if (this.multiple) {
        this.inputValue = this.value
        this.content = []
        this.items.map((item, index) => {
          if (this.value[index] === this.getValue(item)) {
            items.push({
              text: item.text,
              value: item.value,
              active: true
            })
            this.content.push(this.getText(item))
          }
        })
        this.menuActive = false
        this.filteredItems = this.searchValue ? this.filterSearch() : items
      }
    },
    filterSearch () {
      return this.items.filter(i => {
        const text = this.getText(i)
        if (typeof text === 'undefined') return false
        return text.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1
      })
    },
    selectItem (item) {
      let activeItemValue = this.getValue(item)
      let activeItemText = this.getText(item)
      if (this.inputValue === null) {
        this.inputValue = []
        this.content = []
      }
      if (!this.multiple) {
        this.inputValue = [activeItemValue]
        this.content = [activeItemText]
        this.menuActive = false
      } else {
        const currentInputValue = this.inputValue.slice()
        const currentInputText = this.content.slice()
        const i = currentInputValue.findIndex(i => i === activeItemValue)
        i !== -1 && (currentInputValue.splice(i, 1), currentInputText.splice(i, 1)) || (currentInputValue.push(activeItemValue), currentInputText.push(activeItemText))
        this.inputValue = currentInputValue
        this.content = currentInputText
        if (typeof item.active === 'undefined') {
          item.active = true
        } else {
          item.active = !item.active
        }
      }
    },
    getText (item) {
      return item === Object(item) ? item[this.itemText] : item
    },
    getValue (item) {
      return item === Object(item) ? item[this.itemValue] : item
    },
    genChipSelection () {
    },
    genSelectWrap () {
      const inputWrap = this.$createElement('input', {
      })
      return this.$createElement('div', {
        'class': 'v-form-select__trigger',
        domProps: {
          innerHTML: this.content.join(',')
        },
        on: {
          click: () => {
            if (!this.disabled) {
              this.menuActive = !this.menuActive
            }
          }
        }
      }, [inputWrap, this.$slots.icon])
    },
    genSelectSearch () {
    },
    genSelectMenus () {
      const listItems = this.filteredItems.map(item => {
        return this.$createElement('li', {
          'class': {
            'v-form-select__menus__item': true,
            'v-form-select__menus__item__active': item.active
          },
          on: {
            click: () => this.selectItem(item)
          }
        }, [this.$createElement('div', {}, [this.getText(item)])])
      })
      return this.$createElement('ul', {
        'class': 'v-form-select__menus'
      }, listItems)
    }
  },
  render (h) {
    return h('div', {
      'class': this.classes
    }, [this.genSelectWrap(), this.genSelectMenus()])
  },
  beforeDestroy () {
  }
}
</script>

<style lang="less">
.v-form-select{
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin: 0 20px;
  &__trigger {
    width: 200px;
    height: 38px;
    padding: 0 10px;
    line-height: 38px;
    line-height: 36px\9;
    border: 1px solid #e6e6e6;
    background-color: #fff;
    border-radius: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__menus {
    display: none;
    position: absolute;
    top: 44px;
    left: 0px;
    min-width: 100%;
    max-height: 300px;
    padding: 5px 0;
    z-index: 999;
    border: 1px solid #d2d2d2;
    box-sizing: border-box;
    overflow-y: auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0,0,0,.12);
    &__item {
      padding: 0 10px;
      line-height: 36px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      &__active {
        // background-color: #23d160;
        color: #23d160;
      }
    }
  }
  &__active {
    .v-form-select__menus {
      display: block;
    }
  }
}

</style>
