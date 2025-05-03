<script setup lang="ts">
import { computed } from 'vue'
import data from '@/assets/data.json'
import { formatDate } from '@/utils/dateUtils'

type Status = 'paid' | 'pending' | 'draft'

const statusColor = computed(() => {
  return (status: string) => {
    const colors = {
      paid: {
        '--bg-color': 'rgba(51, 214, 159, 0.0571)',
        '--text-color': '#33d69f',
      },
      pending: {
        '--bg-color': 'rgba(255, 143, 0, 0.0571)',
        '--text-color': '#FF8F00',
      },
      draft: {
        '--bg-color': 'rgba(55, 59, 83, 0.0571)',
        '--text-color': '#373B53',
      },
    }
    return colors[status as Status]
  }
})
</script>

<template>
  <div class="container">
    <nav class="nav">
      <div class="logo">
        <div class="logo__wrapper">
          <div class="logo__wrapper-bg1"></div>
          <div class="logo__wrapper-bg2"></div>
          <img class="logo__wrapper-img" src="@/assets/images/logo.svg" alt="Logo" />
        </div>
      </div>
      <div class="nav__theme">
        <img src="@/assets/images/icon-moon.svg" alt="Theme" />
      </div>
      <div class="nav__avatar">
        <img class="nav__avatar-img" src="@/assets/images/image-avatar.jpg" alt="Avatar" />
      </div>
    </nav>
    <main class="page">
      <div class="header">
        <div class="summary">
          <div class="summary__title">Invoices</div>
          <div class="summary__total">There are {{ data.length }} tatal invoices</div>
        </div>
        <div class="operation">
          <div class="operation__filter">
            <div class="operation__filter-title">Filter by status</div>
            <div><img src="@/assets/images/icon-arrow-down.svg" alt="Filter" /></div>
          </div>

          <div class="operation__plus">
            <div class="operation__plus-plus">
              <img src="@/assets/images/icon-plus.svg" alt="Plus" />
            </div>
            <span class="operation__plus-name">New Invoice</span>
          </div>
        </div>
      </div>

      <div class="table">
        <div class="table__row" v-for="item in data" :key="item.id">
          <div class="table__row-id"><span>#</span>{{ item.id }}</div>
          <div class="table__row-due">{{ formatDate(item.paymentDue) }}</div>
          <div class="table__row-client">{{ item.clientName }}</div>
          <div class="table__row-total">${{ item.total }}</div>
          <div class="table__row-status" :style="statusColor(item.status)">
            <div class="table__row-status-dot"></div>
            <div class="table__row-status-name">{{ item.status }}</div>
          </div>
          <div class="table__row-arrow">
            <img src="@/assets/images/icon-arrow-right.svg" alt="" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;

  .nav {
    display: flex;
    flex-direction: column;
    background-color: #373b53;
    width: 103px;
    height: 100vh;
    align-items: center;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;

    .logo {
      flex: 1;
      width: 100%;

      &__wrapper {
        height: 103px;
        position: relative;
        display: flex;
        flex-direction: column;

        &-bg1 {
          height: 65%;
          background-color: var(--color-01);
          border-top-right-radius: 20px;
        }
        &-bg2 {
          height: 50%;
          width: 100%;
          background-color: var(--color-02);
          border-bottom-right-radius: 20px;
          border-top-left-radius: 20px;
          position: absolute;
          top: 52px;
        }

        &-img {
          position: absolute;
          top: 33.29px;
          left: 32px;
          width: 40px;
          height: 40px;
        }
      }
    }

    &__theme {
    }

    &__avatar {
      padding: 24px 0;
      border-top: 1px solid #494e6e;
      margin-top: 32px;
      width: 100%;
      display: flex;
      justify-content: center;

      &-img {
        display: block;
        height: 40px;
        width: 40px;
        border-radius: 50%;
      }
    }
  }

  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 77px 355px 0 252px;
    background-color: var(--color-11);
    // flex-wrap: wrap;

    .header {
      display: flex;
      justify-content: space-between;

      .summary {
        // flex: 1 1 50%;
        height: 55px;

        &__title {
          color: var(--color-08);
          @include text.text-styles('heading-l');
        }

        &__total {
          color: var(--color-06);
          @include text.text-styles('body-variant');
        }
      }

      .operation {
        // flex: 1 1 50%;
        display: flex;
        gap: 40px;
        height: 55px;
        align-items: center;
        justify-content: flex-end;

        &__filter {
          display: flex;
          gap: 14px;
          align-items: center;

          &-title {
            color: var(--color-08);
            @include text.text-styles('heading-s-variant');
          }
        }

        &__plus {
          display: flex;
          gap: 16px;
          background-color: var(--color-01);
          border-radius: 24px;
          justify-content: center;
          align-items: center;
          padding: 8px;

          &-plus {
            background-color: white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              display: block;
            }
          }

          &-name {
            color: white;
          }
        }
      }
    }

    .table {
      flex: 1;
      margin-top: 64px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      &__row {
        display: flex;
        background-color: white;
        height: 72px;
        border-radius: 8px;
        box-shadow: 0 10px 10px -10px rgba(72, 84, 159, 0.1004);
        align-items: center;
        text-align: center;

        &-id {
          flex: 1;
          @include text.text-styles('heading-s-variant');
          color: var(--color-08);

          span {
            color: var(--color-07);
          }
        }

        &-due {
          flex: 1;
          @include text.text-styles('body-variant');
          color: var(--color-07);
        }

        &-client {
          flex: 1;
          @include text.text-styles('body-variant');
          color: #858bb2;
        }

        &-total {
          flex: 1;
          @include text.text-styles('heading-s');
          color: var(--color-08);
        }

        &-status {
          flex: 0 1 104px;
          background-color: var(--bg-color);
          border-radius: 6px;
          height: 40px;
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;

          &-dot {
            height: 8px;
            width: 8px;
            border-radius: 50%;
            background-color: var(--text-color);
          }

          &-name {
            color: var(--text-color);
            text-transform: capitalize; /* 每个单词首字母大写 */
            @include text.text-styles('heading-s-variant');
          }
        }

        &-arrow {
          flex: 0 1 0;
          padding: 0 24px 0 20px;
        }
      }
    }
  }
}
</style>
