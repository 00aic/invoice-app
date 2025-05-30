<script setup lang="ts">
import { ref } from 'vue'
interface Option {
  value: string | number
  label: string
}
interface Props {
  title?: string
  options: Option[]
}
withDefaults(defineProps<Props>(), {
  title: 'Filter',
})

const isOpen = ref(false)
const handleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selected = defineModel<string[] | number[]>({ default: () => [] })

const emit = defineEmits<{ filter: [selected: string[] | number[]] }>()

const handleChange = () => {
  emit('filter', selected.value)
}
</script>
<template>
  <div class="filter">
    <div class="header" @click="handleDropdown">
      <div class="header__title">{{ title }}</div>
      <div>
        <img
          src="@/assets/images/icon-arrow-down.svg"
          alt="Filter"
          :class="['header__arrow', { header__open: isOpen }]"
        />
      </div>
    </div>
    <div class="options" v-if="isOpen">
      <label v-for="option in options" :key="option.value" class="option">
        <input type="checkbox" :value="option.value" v-model="selected" @change="handleChange" />
        <div class="option__check">
          <img src="@/assets/images/icon-check.svg" alt="Checkbox" />
        </div>
        <span class="option__label">{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.filter {
  position: relative;
  display: flex;

  .header {
    display: flex;
    gap: 14px;
    align-items: center;
    cursor: pointer;

    &__title {
      color: var(--color-text);
      @include text.text-styles('heading-s-variant');
    }
    &__arrow {
      transition: transform 0.3s;
    }
    &__open {
      transform: rotate(180deg);
    }
  }

  .options {
    position: absolute;
    top: calc(100% + 22px); // 放在 header 下面: top: 100%
    left: 50%; // 起点是 header 中点
    transform: translateX(-50%); // 向左平移自身宽度的一半，实现居中
    border-color: var(--color-13);
    border-radius: 8px;
    box-shadow: 0 10px 20px 0 var(--color-14);
    background-color: var(--color-background-1);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    .option {
      display: flex;
      gap: 13px;
      min-width: 192px;
      align-items: center;
      cursor: pointer;

      input[type='checkbox'] {
        display: none;
      }

      &__check {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 2px;
        border: 1px solid var(--color-01);
        background-color: var(--color-background-4);

        img {
          display: none;
        }
      }

      input[type='checkbox']:checked + .option__check {
        background-color: var(--color-01);
        img {
          display: inline-block;
        }
      }

      &__label {
        @include text.text-styles('heading-s-variant');
        color: var(--color-03);
      }
    }
  }
}
</style>
