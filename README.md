# text-desensitize
vue文本脱敏（text-desensiti,vue）
> 开发过程中，经常遇到一些数据需要加密，主要体现为身份证号码和手机号码，因此，在这给大家分享一个自己封装的脱敏组件：

**效果图**：

![image](https://github.com/user-attachments/assets/81d4ea94-5237-4549-83d9-3c1d4e0aef64)


**含输入框效果**：

![image](https://github.com/user-attachments/assets/dfec31f6-39e2-4e0c-a70d-0d8ed867a655)

输入框也做了可编辑的功能。

下面是其代码：

text-desensitize.vue

```vue
<template>
  <div>
    <div v-if="!isInput" class="text-desensitize-container">
      <!-- 数据展示 -->
      <div class="text-box">{{ text }}</div>
      <!-- 脱敏状态切换按钮 -->
      <div v-if="needEye" class="icon-box" @click="changeSecretState">
        <img :src="isEyeClose ? eyeCloseIcon : eyeOpenIcon" width="100" height="100" alt="">
      </div>
    </div>
    <!-- 输入框模式 -->
    <!-- 要编辑时，要选用v-model绑定数据 -->
    <div v-else class="input-container">
      <el-input
        ref="input"
        :value="isEyeClose ? desensitizedText : value"
        @input="$emit('input', $event)"
        :disabled="!editable" 
        @focus="isEyeClose = false"
        :placeholder="placeholder"
      > 
        <template #suffix>
          <div v-if="needEye" class="icon-box" @click="changeSecretState">
            <img :src="isEyeClose ? eyeCloseIcon : eyeOpenIcon" width="20" height="20" alt="">
          </div>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script>
import desensitizeUtil, { desensitizeTypeList } from '@/utils/util.desensitize'
import eye from '@/assets/icon/eye.png'
import eyeClose from '@/assets/icon/eye-close.png'
  export default {
    name: 'text-desensitize',
    props: {
      // 源数据
      value: {
        type: String,
        default: ''
      },
      // 脱敏类型：idCard 证件号、phone 手机号等，根据定义的脱敏工具类中的类型
      type: {
        type: String,
        default: 'idCard',
        validator: (val) => desensitizeTypeList.includes(val)
      },
      // 是否以input标签包裹
      isInput: {
        type: Boolean,
        default: false
      },
      // 是否可编辑
      editable: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        // 当前是否展示脱敏数据
        isEyeClose: true,
        // 切换脱敏的图标
        eyeOpenIcon: eye,
        eyeCloseIcon: eyeClose
      }
    },
    computed: {
      // 是否需要眼睛按钮
      needEye() {
        return this.value && !this.value.includes('****')
      },
      // 脱敏后的数据
      desensitizedText() {
        // return desensitizeUtil.idCard(this.value)
        if (this.value) {
          const desensitizeMethod = desensitizeUtil[this.type]
          return desensitizeMethod
            ? desensitizeMethod(this.value)
            : ''.padEnd(this.value.length, '*')
        }
        return this.value || ''
      },
      // 展示的数据
      text() {
        if (this.isEyeClose) {
          return this.desensitizedText
        }
        return this.value || ''
      }
    },
    methods: {
      // 切换当前脱敏状态
      changeSecretState() {
        this.isEyeClose = !this.isEyeClose
      },
      focusInput() {
        this.$refs.input.focus()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .text-desensitize-container {
    .text-box {
      display: inline-block;
      vertical-align: middle;
    }

    .icon-box {
      display: inline-block;
      vertical-align: middle;
      width: 20px;
      height: 20px;
      margin-left: 10px;
      font-weight: bold;
      fill: #333;
      cursor: pointer;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .input-container {
  position: relative;
}

.transparent-input {
  ::v-deep .el-input__inner {
    color: transparent;
    text-shadow: 0 0 0 #666; /* 保留文字占位空间 */
  }
}

.icon-box {
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 100%;
  padding-right: 8px;
}
</style>

```

```index.js
import TextDesensitize from './text-desensitize.vue'

export default TextDesensitize

```
组件结构如图；

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/436cd999e94541179355204393610ebe~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5rOh5rOhb08=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzExNjQ3MDE2MDMzMTQzMSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749632571&x-orig-sign=3e4hdAzAay4k4CgCm7nX2%2FY7bK8%3D)

需要用时直接`import TextDesensitize from "@/components/text-desensitize";`
具体位置看封装的位置

接下来是使用的示例：

1.el-table里使用
```vue
<el-table-column
  align="center"
  label="身份证号码"
  prop="zjhm"
  width="150"
  fixed
>
  <template slot-scope="scope">
    <text-desensitize :value="scope.row.zjhm"></text-desensitize>
  </template>
</el-table-column>

<el-table-column
  align="center"
  label="联系电话"
  prop="lxdh"
  width="120"
>
  <template slot-scope="scope">
    <text-desensitize :value="scope.row.lxdh" type="phone"></text-desensitize>
  </template>
</el-table-column>
```
2.正常使用：
```vue
// 无输入框
<span class="infos">身份证号：<text-desensitize :value="zjhm"></text-desensitize></span>
<span class="infos">手机号：<text-desensitize :value="lxdh" type="phone"></text-desensitize></span>
// 含输入框
<text-desensitize
  :value="info[item.prop]"
  :isInput="true"
/>
// 可编辑输入框
<text-desensitize
  v-model="form.sqrzjdm"
  :isInput="true"
  :editable="true"
  placeholder="请输入内容"
/>
```
3.对于封装后的el-table或el-form，不能直接加`<text-desensitize>`，**只能在数据中做处理**，如：el-table里的data、el-form里的model，这种情况可以使用下面这个组件来实现**单项数据中插槽以及自定义展示**：

scoped-slots.mixin.vue

```vue

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
```
将这个组件引入到封装的table或者form表单里，
```
import ScopedSlotsMixin from '../mixins/scoped-slots.mixin.vue'
...
mixins: [ScopedSlotsMixin],
```
这样就可以实现**单项数据中插槽以及自定义展示**，这时候的使用方式为：

```vue
// el-form的model
{
  ...
  tagName: 'text-desensitize', // 使用自定义组件
  tagProps: {
    isInput: true,     // 显示为输入框
    editable: true,    // 允许编辑
  }
},

// el-table的data
{
  ...
  customRender: ({ row }) => <text-desensitize value={row.cardNum} />
},
```

以上内容，涵盖了大多数脱敏组件使用的情景，同时提供了一个**实现单项数据中插槽以及自定义展示**的代码，读者可根据项目情况进行处理。

tips:
1. 本项目使用的是vue2，element-ui，vue3和element-plus的项目也可简单修改使用；
2. 使用的是scss，没有过多处理，less和sass的项目可直接使用；
