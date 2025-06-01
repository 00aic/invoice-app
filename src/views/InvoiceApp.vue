<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
// import jsonData from '@/assets/data.json'
import { formatIntlDate } from '@/utils/dateUtils'
import UpsertInvoice from './UpsertInvoice.vue'
import type { Invoice } from '@/types/invoice'
import { useRouter } from 'vue-router'
import StatusBadge from '@/components/StatusBadge'
import { formatNumber } from '@/utils/numberUtils'
import { getInvoices, getInvoiceByStatus } from '@/api/invoice'
import FilterWrapper from '@/components/FilterWrapper'
import { useMediaQuery } from '@vueuse/core'

const router = useRouter()

const data = ref<Invoice[]>()

const isPhone = useMediaQuery('(max-width: 767px)')

const totalTitle = computed(() => {
  if (isPhone.value) {
    return data.value && data.value.length > 0 ? `${data.value.length} invoices` : 'No Invoices'
  } else {
    return data.value && data.value.length > 0
      ? `There are ${data.value.length} total invoices`
      : 'No Invoices'
  }
})

const filterTitle = computed(() => (isPhone.value ? 'Filter' : 'Filter by status'))

const newInvoiceTitle = computed(() => (isPhone.value ? 'New' : 'New Invoice'))

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
//         '--bg-color': 'var(--color-status-draft-bg)',
//         '--text-color': 'var(--color-status-draft)',
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

const statusOptions = [
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
const handleFilter = async (selected: string[] | number[]) => {
  filterSelected.value = selected as string[]
  data.value = selected.length !== 0 ? (await getInvoiceByStatus(selected as string[])).data : []
}

// const onStatusChange = () => {}
</script>

<template>
  <div class="page">
    <div class="header">
      <div class="summary">
        <div class="summary__title">Invoices</div>
        <div class="summary__total">
          {{ totalTitle }}
        </div>
      </div>
      <div class="operation">
        <FilterWrapper
          :title="filterTitle"
          v-model="filterSelected"
          :options="statusOptions"
          @filter="handleFilter"
        />

        <button class="operation__plus" @click="handleNewInvoice">
          <div class="operation__plus-wrapper">
            <img src="@/assets/images/icon-plus.svg" alt="Plus" />
          </div>
          <span class="operation__plus-name">{{ newInvoiceTitle }}</span>
        </button>
      </div>
    </div>

    <div class="table" v-if="data && data.length > 0">
      <div class="table__row" v-for="item in data" :key="item.id" @click="handleDetail(item)">
        <div class="table__row-id"><span>#</span>{{ item.id }}</div>
        <div class="table__row-due">{{ formatIntlDate(item.paymentDue, { prefix: 'Due' }) }}</div>
        <div class="table__row-client">{{ item.clientName }}</div>
        <div class="table__row-total">{{ formatNumber(item.total) }}</div>
        <!-- <div class="table__row-status" :style="statusColor(item.status)">
          <div class="table__row-status-dot"></div>
          <div class="table__row-status-name">{{ item.status }}</div>
        </div> -->
        <StatusBadge class="table__row-status" :status="item.status" />
        <div class="table__row-arrow" v-if="!isPhone">
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
  justify-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: var(--width-main);
  padding: 0 24px;
  margin: 77px 0;

  // flex-wrap: wrap;

  .header {
    display: flex;
    justify-content: space-between;

    .summary {
      // flex: 1 1 50%;
      height: 55px;

      &__title {
        color: var(--color-text);
        @include text.text-styles('heading-l');
      }

      &__total {
        color: var(--color-text-1);
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
    // padding: 0 24px;

    &__row {
      display: flex;
      background-color: var(--color-background-1);
      height: 72px;
      border-radius: 8px;
      box-shadow: 0 10px 10px -10px rgba(72, 84, 159, 0.1004);
      align-items: center;
      text-align: center;
      cursor: pointer;

      &-id {
        flex: 1;
        @include text.text-styles('heading-s-variant');
        color: var(--color-text);

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
        color: var(--color-client);
      }

      &-total {
        flex: 1;
        @include text.text-styles('heading-s');
        color: var(--color-text);
      }

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
        color: var(--color-text);
      }

      &-desc {
        @include text.text-styles('body-variant');
        color: var(--color-text-1);

        span {
          font-weight: bold;
        }
      }
    }
  }
}

@media (max-width: 767px) {
  .page {
    margin: 32px 0;
    .header {
      .operation {
        &__plus {
          gap: 8px;
        }
      }
    }

    .table {
      &__row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(3, 1fr);
        grid-template-areas:
          'id client'
          'due status'
          'total status';
        // align-items: center;
        // justify-items: center;
        gap: 9px;
        height: unset;
        padding: 24px;

        &-id {
          grid-area: id;
          justify-self: start;
        }
        &-due {
          grid-area: due;
          justify-self: start;
          margin-top: 17px;
        }
        &-client {
          grid-area: client;
          justify-self: end;
        }
        &-total {
          grid-area: total;
          justify-self: start;
        }
        &-status {
          grid-area: status;
          justify-self: end;
          margin-top: 17px;
        }
      }
    }
  }
}
</style>
