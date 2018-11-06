<script>
export default {
  props: {
    trigger: {
      type: String,
      default: 'click'
    }
  },
  data () {
    return {
      visible: false
    }
  },
  render (h) {
    let header = h('div', {
      'class': 'ms-dropdown-title',
      on: {
        click: this.toggle
      }
    }, [this.$slots.title])

    let content = h('div', {
      'class': 'ms-dropdown-content',
      directives: [
        {
          name: 'show',
          value: this.visible
        }
      ]
    }, [this.$slots.default])

    return h('li', {
      'class': 'ms-dropdown'
    }, [header, content])
  },
  methods: {
    toggle () {
      this.visible ? this.hide() : this.show()
    },

    show () {
      this.visible = true
      if (this.trigger === 'click') {
        document.addEventListener('click', this.closeOnDocumentClick, false)
      }
    },

    hide () {
      this.visible = false
      if (this.trigger === 'click') {
        document.removeEventListener('click', this.closeOnDocumentClick, false)
      }
    },

    closeOnDocumentClick (e) {
      if (!this.$el.contains(e.target)) {
        this.hide()
      }
    }
  },
  beforeDestroy () {
    this.hide()
  }
}
</script>

<style lang="less">
.ms-dropdown {
  position: relative;
}
.ms-dropdown-title {
  height: 100%;
}
.ms-dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
}
</style>
