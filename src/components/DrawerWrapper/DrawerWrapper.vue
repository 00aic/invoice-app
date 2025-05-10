<script setup lang="ts">
import { computed } from 'vue'
import SimpleBar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'

const visible = defineModel({ type: Boolean, default: false })

interface Props {
  maskClosable?: boolean
  closable?: boolean
  width?: string | number
  title?: string
  placement?: 'left' | 'right' | 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
  maskClosable: true,
  closable: false,
  width: '50%',
  placement: 'left',
})

const transitionName = computed(() => {
  return `slide-${props.placement}`
})

const emit = defineEmits<{ close: [] }>()

const handleClose = () => {
  visible.value = false
  emit('close')
}

const handleMaskClick = () => {
  if (props.maskClosable) {
    handleClose()
  }
}
</script>
<template>
  <!-- 遮罩层 -->
  <Transition name="fade">
    <div v-if="visible" class="drawer-mask" @click="handleMaskClick"></div>
  </Transition>

  <Transition :name="transitionName">
    <div
      v-if="visible"
      class="drawer"
      :class="[`drawer-${placement}`]"
      :style="{ width: typeof width === 'number' ? `${width}px` : width }"
    >
      <div class="drawer__header">
        <slot name="header">
          <div class="drawer__header-title">{{ title }}</div>
          <button v-if="closable" class="drawer__header-close" @click="handleClose">&times;</button>
        </slot>
      </div>
      <SimpleBar class="scroll">
        <div class="drawer__body">
          <slot></slot>
        </div>
      </SimpleBar>

      <div v-if="$slots.footer" class="drawer__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </Transition>
</template>
<style lang="scss" scoped>
.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4984);
  z-index: 1000;
}

.drawer {
  position: fixed;
  z-index: 1001;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 59px 40px 0 56px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 46px;

    &-title {
      font-weight: bold;
      font-size: 24px;
      line-height: 32px;
      letter-spacing: -0.5px;
      color: var(--color-08);
    }

    &-close {
      border: 0;
      background-color: white;
      @include text.text-styles('heading-s');
      cursor: pointer;
    }
  }

  &__body {
    flex: 1;
    // overflow: hidden;
    //
  }

  &__footer {
    margin: 0 -40px 0 -56px;
  }

  &-left {
    top: 0;
    left: 103px;
    height: 100%;
  }

  &-right {
    // top: 0;
    // right: 0;
    height: 100%;
  }

  &-top {
    top: 0;
    left: 103px;
    width: 100%;
  }

  &-bottom {
    bottom: 0;
    left: 103px;
    width: 100%;
  }
}

// 遮罩动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 左侧动画
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

// 右侧动画
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

// 顶部抽屉动画
.slide-top-enter-active,
.slide-top-leave-active {
  transition: transform 0.3s ease;
}

.slide-top-enter-from,
.slide-top-leave-to {
  transform: translateY(-100%);
}

// 底部抽屉动画
.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: transform 0.3s ease;
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
  transform: translateY(100%);
}

.scroll {
  // overflow: auto;
  // max-height: 600px;
  max-height: calc(100vh - 110px - 137px);
}

// /* 隐藏原生滚动条 */
// .custom-scroll ::v-deep(.simplebar-content-wrapper) {
//   scrollbar-width: none; /* Firefox */
//   -ms-overflow-style: none; /* IE/Edge */
// }

// 覆盖 simplebar 样式
.scroll :deep(.simplebar-scrollbar:before) {
  background: var(--color-05); // 浅蓝色
  border-radius: 4px;
  width: 6px;
}

.scroll :deep(.simplebar-scrollbar) {
  // left: 2px;
}

.custom-scroll :deep(.simplebar-track.simplebar-vertical) {
  width: 8px;
  background: transparent;
}
</style>
