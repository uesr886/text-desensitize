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
