<script setup lang="ts">
const visible = defineModel({ type: Boolean, default: false })
interface Props {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}
withDefaults(defineProps<Props>(), {
  title: 'Tip',
  message: "Are you sure you're ready to do this?",
  confirmText: 'Confirm',
  cancelText: 'Cancel',
})

const emit = defineEmits<{ cancel: []; confirm: [] }>()

const handleCancel = () => {
  visible.value = false
  emit('cancel')
}

const handleConfirm = () => {
  visible.value = false
  emit('confirm')
}
</script>
<template>
  <Transition name="fade">
    <div class="dialog-mask" v-if="visible">
      <Transition name="slide-up">
        <div class="dialog-container" v-if="visible">
          <div class="dialog__header">
            <div class="dialog__header-title">{{ title }}</div>
          </div>
          <div class="dialog__body">
            <slot>
              <div class="dialog__body-msg">{{ message }}</div>
            </slot>
          </div>
          <div class="dialog__footer">
            <button class="dialog__footer-cancel" @click="handleCancel">{{ cancelText }}</button>
            <button class="dialog__footer-confirm" @click="handleConfirm">{{ confirmText }}</button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
<style lang="scss" scoped>
.dialog {
  &-mask {
    z-index: 1000;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4984);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-container {
    background-color: white;
    padding: 48px;
    border-radius: 8px;
    border-color: var(--color-13);
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 480px;
  }

  &__header {
    display: flex;
    &-title {
      font-weight: bold;
      font-size: 24px;
      line-height: 32px;
      letter-spacing: -0.5px;
      color: var(--color-08);
    }
  }

  &__body {
    &-msg {
      font-weight: 500;
      font-size: 13px;
      line-height: 22px;
      letter-spacing: -0.1px;
      color: var(--color-06);
    }
  }

  &__footer {
    @include text.text-styles('heading-s-variant');
    display: flex;
    gap: 8px;
    justify-content: end;
    margin-top: 2px;

    button {
      height: 48px;
      border: none;
      border-radius: 24px;
      padding: 16px 24px;
      cursor: pointer;
    }
    &-cancel {
      color: var(--color-07);
      background-color: #f9fafe;
    }

    &-confirm {
      color: white;
      background-color: var(--color-09);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
