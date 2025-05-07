<script setup lang="ts">
import StatusBadge from '@/components/StatusBadge'
</script>
<template>
  <div class="detail">
    <div class="back">
      <div><img src="@/assets/images/icon-arrow-left.svg" alt="Go back" /></div>
      <div class="back__title">Go back</div>
    </div>
    <header class="header">
      <div class="header__status">
        <div>Status</div>
        <StatusBadge status="pending" />
      </div>
      <div class="header__button">
        <button>Edit</button>
        <button>Delete</button>
        <button>Mask as Paid</button>
      </div>
    </header>
    <div class="container"></div>
  </div>
</template>
<style lang="scss" scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .back {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 7px;

    &__title {
      @include text.text-styles('heading-s-variant');
      color: var(--color-08);
    }
  }

  .header {
    display: flex;
    justify-content: space-between;

    &__status {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    &__button {
      display: flex;
      gap: 8px;
    }
  }
}
</style>
