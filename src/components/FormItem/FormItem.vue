<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'
import { computed } from 'vue'
const modelValue = defineModel()
interface Props {
  label?: string
  name: string
  placeholder?: string
}
defineProps<Props>()

const showError = computed(() => {
  return (meta: { touched: boolean }, errors: string[]) => {
    return meta.touched && errors[0]
  }
})
</script>
<template>
  <div class="form-group">
    <Field v-model="modelValue" :name="name" v-slot="{ field, meta, errors }">
      <div class="form-title">
        <label :for="name" :class="['form-label', { 'error-label': showError(meta, errors) }]">{{
          label
        }}</label>
        <ErrorMessage :name="name" class="error-message" />
      </div>
      <!-- 包裹插槽内容的容器 -->
      <div :class="['input-wrapper', { 'error-border': showError(meta, errors) }]">
        <slot
          v-bind="{
            field,
            meta,
            errors,
          }"
        >
          <input v-bind="field" type="text" :id="name" :placeholder="placeholder" />
        </slot>
      </div>
    </Field>
  </div>
</template>
<style lang="scss" scoped>
.form-group {
  display: flex;
  flex-direction: column;
  // flex: 1;
}

.form-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 9px;
}

.form-label {
  @include text.text-styles('body-variant');
  color: var(--color-07);
  text-align: center;
}

// .form-input {
// }

.input-wrapper {
  width: 100%;
  margin-bottom: 25px;

  :deep(input),
  :deep(select),
  :deep(textarea) {
    width: 100%;
    border-radius: 4px;
    height: 48px;
    border: 1px solid var(--color-05);
    padding: 0 20px;
    @include text.text-styles('heading-s-variant');
    color: var(--color-08);

    &:focus {
      border-color: var(--color-02);
      outline: none; /* 去除默认的聚焦外框 */
    }
  }

  :deep(input::placeholder),
  :deep(select::placeholder),
  :deep(textarea::placeholder) {
    @include text.text-styles('heading-s-variant');
    color: var(--color-08);
    opacity: 0.4;
  }

  &.error-border {
    :deep(input),
    :deep(select),
    :deep(textarea) {
      border-color: var(--color-09);
    }
  }
}

.error-label {
  color: var(--color-09);
}

.error-message {
  color: var(--color-09);
  font-weight: 600;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: -0.21px;
}

// .error-border {
//   border-color: var(--color-09);
// }
</style>
