<script setup lang="ts">
import { computed, ref } from 'vue'

interface Option {
  value: string | number
  label: string
}
interface Props {
  options: Option[]
}
const props = defineProps<Props>()

const isOpen = ref<boolean>(false)

const selected = defineModel<string | number>()
const selectedOption = computed(() =>
  props.options.find((option) => option.value === selected.value),
)

const handleSelect = (option: Option) => {
  isOpen.value = false
  selected.value = option.value
}

const handleDropdown = () => {
  isOpen.value = !isOpen.value
}
</script>
<template>
  <div class="select">
    <div class="header" @click="handleDropdown">
      <span class="header__title">{{ selectedOption?.label }}</span>
      <div>
        <img
          src="@/assets/images/icon-arrow-down.svg"
          alt="arrow"
          :class="['header__arrow', { header__open: isOpen }]"
        />
      </div>
    </div>
    <ul class="options" v-if="isOpen">
      <li
        v-for="option in options"
        :key="option.value"
        @click="handleSelect(option)"
        class="option"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.select {
  position: relative;
  display: flex;
  width: 240px;
  height: 48px;
  @include text.text-styles('heading-s-variant');
  color: var(--color-08);
  cursor: pointer;

  .header {
    width: 100%;
    display: flex;
    border: 1px solid var(--color-01);
    border-radius: 4px;
    background-color: white;
    align-items: center;
    padding: 0 20px;

    &__title {
      flex: 1;
    }

    &__arrow {
      transition: transform 0.3s;
    }

    &__open {
      transform: rotate(180deg);
    }
  }

  .options {
    width: 100%;
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
    border-color: var(--color-13);
    border-radius: 8px;
    box-shadow: 0 10px 20px 0 var(--color-14);
    background-color: white;

    .option {
      padding: 15px 24px;
      border-bottom: 1px solid var(--color-05);
    }
  }
}
</style>
