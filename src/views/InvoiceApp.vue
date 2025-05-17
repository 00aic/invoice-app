<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import jsonData from '@/assets/data.json'
import { formatDate } from '@/utils/dateUtils'
import UpsertInvoice from './UpsertInvoice.vue'
import type { Invoice } from '@/types/invoice'
import { useRouter } from 'vue-router'
import StatusBadge from '@/components/StatusBadge'
import { formatNumber } from '@/utils/numberUtils'
import { getInvoices, getInvoiceByStatus } from '@/api/invoice'
import FilterWrapper from '@/components/FilterWrapper'

const router = useRouter()

const data = ref<Invoice[]>()
// const data = ref<Invoice[]>(jsonData as Invoice[])

// type Status = 'paid' | 'pending' | 'draft'

// const statusColor = computed(() => {
//   return (status: string) => {
//     const colors = {
//       paid: {
//         '--bg-color': 'rgba(51, 214, 159, 0.0571)',
//         '--text-color': '#33d69f',
//       },
//       pending: {
//         '--bg-color': 'rgba(255, 143, 0, 0.0571)',
//         '--text-color': '#FF8F00',
//       },
//       draft: {
//         '--bg-color': 'rgba(55, 59, 83, 0.0571)',
//         '--text-color': '#373B53',
//       },
//     }
//     return colors[status as Status]
//   }
// })

const showNewInvoice = ref<boolean>(false)
const handleNewInvoice = () => {
  showNewInvoice.value = true
}

const handleDetail = (invoice: Invoice) => {
  // useInvoiceStore().setCurrentInvoice(invoice)
  router.push(`/invoiceDetails/${invoice.id}`)
}

onMounted(async () => {
  data.value = (await getInvoices()).data
})

const refreshInvoices = async () => {
  data.value = (await getInvoices()).data
}

const statusList = [
  {
    value: 'draft',
    label: 'Draft',
  },
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'paid',
    label: 'Paid',
  },
]
const filterSelected = ref<string[]>(['draft', 'pending', 'paid'])
const handleFilter = async (selected: string[]) => {
  filterSelected.value = selected
  data.value = selected.length !== 0 ? (await getInvoiceByStatus(selected)).data : []
}

// const onStatusChange = () => {}
</script>

<template>
  <div class="page">
    <div class="header">
      <div class="summary">
        <div class="summary__title">Invoices</div>
        <div class="summary__total">
          {{ data && data.length > 0 ? `There are ${data.length} tatal invoices` : 'No Invoices' }}
        </div>
      </div>
      <div class="operation">
        <FilterWrapper
          title="Filter by status"
          v-model="filterSelected"
          :data="statusList"
          @filter="handleFilter"
        />

        <button class="operation__plus" @click="handleNewInvoice">
          <div class="operation__plus-wrapper">
            <img src="@/assets/images/icon-plus.svg" alt="Plus" />
          </div>
          <span class="operation__plus-name">New Invoice</span>
        </button>
      </div>
    </div>

    <div class="table" v-if="data && data.length > 0">
      <div class="table__row" v-for="item in data" :key="item.id" @click="handleDetail(item)">
        <div class="table__row-id"><span>#</span>{{ item.id }}</div>
        <div class="table__row-due">{{ formatDate(item.paymentDue) }}</div>
        <div class="table__row-client">{{ item.clientName }}</div>
        <div class="table__row-total">{{ formatNumber(item.total) }}</div>
        <!-- <div class="table__row-status" :style="statusColor(item.status)">
          <div class="table__row-status-dot"></div>
          <div class="table__row-status-name">{{ item.status }}</div>
        </div> -->
        <StatusBadge :status="item.status" />
        <div class="table__row-arrow">
          <img src="@/assets/images/icon-arrow-right.svg" alt="" />
        </div>
      </div>
    </div>
    <div class="table table__empty" v-if="!data || data.length === 0">
      <img class="table__empty-img" src="@/assets/images/illustration-empty.svg" alt="Empty" />
      <div class="table__empty-title">There is nothing here</div>
      <div class="table__empty-desc">
        Create an invoice by clicking the <br /><span>New Invoice</span> button and get started
      </div>
    </div>
  </div>

  <UpsertInvoice v-model="showNewInvoice" @add="refreshInvoices"></UpsertInvoice>
</template>

<style lang="scss" scoped>
.page {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

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
      justify-content: end;

      &__plus {
        display: flex;
        gap: 16px;
        background-color: var(--color-01);
        border: none;
        border-radius: 24px;
        justify-content: center;
        align-items: center;
        padding: 8px;
        cursor: pointer;

        &-wrapper {
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
      cursor: pointer;

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

      // &-status {
      //   flex: 0 1 104px;
      //   background-color: var(--bg-color);
      //   border-radius: 6px;
      //   height: 40px;
      //   display: flex;
      //   gap: 8px;
      //   align-items: center;
      //   justify-content: center;

      //   &-dot {
      //     height: 8px;
      //     width: 8px;
      //     border-radius: 50%;
      //     background-color: var(--text-color);
      //   }

      //   &-name {
      //     color: var(--text-color);
      //     text-transform: capitalize; /* 每个单词首字母大写 */
      //     @include text.text-styles('heading-s-variant');
      //   }
      // }

      &-arrow {
        flex: 0 1 0;
        padding: 0 24px 0 20px;
      }
    }

    &__empty {
      justify-self: center;
      align-self: center;
      width: 241.34px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &-img {
        display: block;

        height: 200px;
      }

      &-title {
        @include text.text-styles('heading-m');
        color: var(--color-08);
      }

      &-desc {
        @include text.text-styles('body-variant');
        color: var(--color-06);

        span {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
