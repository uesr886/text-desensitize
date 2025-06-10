<script>
export default {
  name: 'scoped-slots-mixin',
  methods: {
    /**
     * 返回插槽
     * @param {Object} item
     * @param {String} slotName 插槽名称
     * @return {*}
     */
    getScopedSlot(item, slotName = 'default') {
      const { customRender, customRenderLabel, scopedSlots } = item
      let content = {}
      if (scopedSlots) {
        Object.keys(scopedSlots).forEach((key) => {
          let slotKey = key.replace('customRender', '').toLowerCase()
          if (!slotKey) {
            slotKey = 'default'
          }
          const slotValue = scopedSlots[key]
          if (slotValue && this.$scopedSlots[slotValue]) {
            content[slotKey] = this.getSlotFunc(this.$scopedSlots[slotValue])
          }
        })
        // if (scopedSlots.customRender) {
        //   content[slotName] = this.getSlotFunc(this.$scopedSlots[scopedSlots.customRender])
        // }
        // if (scopedSlots.customRenderLabel) {
        //   content['label'] = this.getSlotFunc(this.$scopedSlots[scopedSlots.customRenderLabel])
        // }
      }
      if (!content[slotName] && customRender) {
        content[slotName] = this.getSlotFunc(customRender)
      }
      if (!content['label'] && customRenderLabel) {
        content['label'] = this.getSlotFunc(customRenderLabel)
      }

      if (Object.keys(content).length) {
        return content
      }
      return null
    },
    /**
     * 返回插槽
     * @param {Function} newCustomRender
     * @return {Function}
     */
    getSlotFunc(newCustomRender) {
      return (scope) => newCustomRender(scope)
    }
  }
}
</script>
