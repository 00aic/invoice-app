<script setup lang="ts">
import StatusBadge from '@/components/StatusBadge'
import { formatIntlDate } from '@/utils/dateUtils'
import { useRouter, useRoute } from 'vue-router'
import { formatNumber } from '@/utils/numberUtils'
import UpsertInvoice from './UpsertInvoice.vue'
import { onMounted, ref } from 'vue'
import ConfirmationDialog from '@/components/ConfirmationDialog'
import { deleteInvoiceById, getInvoiceById, updateInvoice } from '@/api/invoice'
import type { Invoice } from '@/types/invoice'

const router = useRouter()
const route = useRoute()

const currentInvoice = ref<Invoice>()

const handleGoBack = () => {
  router.push('/')
}

const showEditInvoice = ref<boolean>(false)
const upsertInvoiceRef = ref<InstanceType<typeof UpsertInvoice> | null>(null)
const handleInvoiceEdit = () => {
  upsertInvoiceRef.value?.resetForm()
  showEditInvoice.value = true
}

const showDeleteConfirm = ref<boolean>(false)
const handleInvoiceDelete = () => {
  showDeleteConfirm.value = true
}
const handleDeleteConfirm = async () => {
  await deleteInvoiceById(currentInvoice.value?.id ?? '')
  router.push('/')
}

const refreshInvoice = async (data: Invoice) => {
  currentInvoice.value = (await getInvoiceById(data.id ?? '')).data
}

onMounted(async () => {
  currentInvoice.value = (await getInvoiceById(route.params.id as string)).data
})

const showPaidConfirm = ref(false)

const handleInvoicePaid = async () => {
  showPaidConfirm.value = true
}

const handlePaidConfirm = async () => {
  if (currentInvoice.value) {
    currentInvoice.value.status = 'paid'
    await updateInvoice(currentInvoice.value)
  }
}
</script>
<template>
  <div class="detail">
    <div class="back" @click="handleGoBack">
      <div><img src="@/assets/images/icon-arrow-left.svg" alt="Go back" /></div>
      <div class="back__title">Go back</div>
    </div>
    <header class="header">
      <div class="header__status">
        <div>Status</div>
        <StatusBadge :status="currentInvoice?.status ?? 'draft'" />
      </div>
      <div class="header__button">
        <button class="header__button-edit" @click="handleInvoiceEdit">Edit</button>
        <button class="header__button-delete" @click="handleInvoiceDelete">Delete</button>
        <button class="header__button-paid" @click="handleInvoicePaid">Mask as Paid</button>
      </div>
    </header>
    <div class="container">
      <div class="basic">
        <div class="basic__info">
          <div class="basic__info-id">
            <span class="basic__info-prefix">#</span>{{ currentInvoice?.id }}
          </div>
          <div class="basic__info-desc">{{ currentInvoice?.description }}</div>
        </div>
        <div class="basic__address">
          <div>{{ currentInvoice?.senderAddress.street }}</div>
          <div>{{ currentInvoice?.senderAddress.city }}</div>
          <div>{{ currentInvoice?.senderAddress.postCode }}</div>
          <div>{{ currentInvoice?.senderAddress.country }}</div>
        </div>
      </div>
      <div class="primary">
        <div class="primary__date">
          <div class="primary__wrapper">
            <div class="primary__title">Invoice Date</div>
            <div class="primary__content">
              {{ formatIntlDate(currentInvoice?.createdAt ?? '') }}
            </div>
          </div>
          <div class="primary__wrapper">
            <div class="primary__title">Payment Due</div>
            <div class="primary__content">
              {{ formatIntlDate(currentInvoice?.paymentDue ?? '') }}
            </div>
          </div>
        </div>

        <div class="primary__bill">
          <div class="primary__wrapper">
            <div class="primary__title">Bill To</div>
            <div class="primary__content">{{ currentInvoice?.clientName }}</div>
          </div>
          <div class="primary__bill-address">
            <div>{{ currentInvoice?.clientAddress.street }}</div>
            <div>{{ currentInvoice?.clientAddress.city }}</div>
            <div>{{ currentInvoice?.clientAddress.postCode }}</div>
            <div>{{ currentInvoice?.clientAddress.country }}</div>
          </div>
        </div>
        <div class="primary__wrapper">
          <div class="primary__title">Sent to</div>
          <div class="primary__content">{{ currentInvoice?.clientEmail }}</div>
        </div>
      </div>

      <div class="items">
        <table class="table">
          <thead class="table__head">
            <tr>
              <th>Item Name</th>
              <th>QTY.</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody class="table__body">
            <tr v-for="(item, index) in currentInvoice?.items" :key="`item${index}`">
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatNumber(item.price) }}</td>
              <td>{{ formatNumber(item.total) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="items__price">
          <div class="items__price-title">Amount Due</div>
          <div class="items__price-total">{{ formatNumber(currentInvoice?.total ?? 0) }}</div>
        </div>
      </div>
    </div>

    <UpsertInvoice
      ref="upsertInvoiceRef"
      v-model="showEditInvoice"
      :data="currentInvoice"
      @edit="refreshInvoice"
    />
    <ConfirmationDialog
      v-model="showDeleteConfirm"
      title="Confirm Deletion"
      :message="`Are you sure you want to delete invoice #${currentInvoice?.id}?This action cannot be undone.`"
      confirm-text="Delete"
      @confirm="handleDeleteConfirm"
    />

    <ConfirmationDialog
      v-model="showPaidConfirm"
      title="Confirm Mask"
      :message="`Are you sure you want to mask the status of invoice #${currentInvoice?.id} to paid?`"
      @confirm="handlePaidConfirm"
    />
  </div>
</template>
<style lang="scss" scoped>
$primary-gap: 13px;

.detail {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .back {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 7px;
    cursor: pointer;

    &__title {
      @include text.text-styles('heading-s-variant');
      color: var(--color-text);
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    height: 88px;
    background-color: var(--color-background-1);
    padding: 24px 32px;
    border-radius: 8px;

    &__status {
      display: flex;
      align-items: center;
      gap: 20px;
      color: var(--color-status);
    }

    &__button {
      display: flex;
      gap: 8px;
      height: 48px;

      button {
        border: none;
        border-radius: 24px;
        border-color: var(--color-13);
        @include text.text-styles('heading-s-variant');
        cursor: pointer;
      }

      &-edit {
        width: 73px;
        background-color: var(--color-background-2);
        color: var(--color-07);
      }

      &-delete {
        width: 89px;
        background-color: var(--color-09);
        color: white;
      }

      &-paid {
        width: 131px;
        background-color: var(--color-01);
        color: white;
      }
    }
  }

  .container {
    background-color: var(--color-background-1);
    display: flex;
    flex-direction: column;
    padding: 48px;
    gap: 21px;
    height: calc(100vh - 158px);

    .basic {
      display: flex;
      justify-content: space-between;

      &__info {
        display: flex;
        flex-direction: column;
        gap: $primary-gap;

        @include text.text-styles('heading-s');
        &-prefix {
          color: var(--color-06);
        }

        &-id {
          color: var(--color-text);
        }

        &-desc {
          @include text.text-styles('body-variant');
          color: var(--color-07);
        }
      }

      &__address {
        display: flex;
        flex-direction: column;
        align-items: end;
        @include text.text-styles('body');
        color: var(--color-07);
      }
    }

    .primary {
      display: flex;
      justify-content: space-between;

      &__date {
        display: flex;
        flex-direction: column;
        gap: 31px;
        flex: 1;
      }

      &__bill {
        display: flex;
        flex-direction: column;
        flex: 1;

        &-address {
          @include text.text-styles('body');
          color: var(--color-07);
        }
      }

      // &__send {
      //   display: flex;
      //   flex-direction: column;
      //   flex: 1;
      // }

      &__wrapper {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: $primary-gap;
      }

      &__title {
        @include text.text-styles('body-variant');
        color: var(--color-07);
      }

      &__content {
        font-weight: bold;
        font-size: 15px;
        line-height: 20px;
        letter-spacing: -0.25px;
        color: var(--color-text);
      }
    }
  }
  .items {
    margin-top: 26px;
    .table {
      display: flex;
      flex-direction: column;
      gap: 32px;
      background-color: var(--color-background-2);
      padding: 32px;
      border-top-right-radius: 8px;
      border-top-left-radius: 8px;

      &__head,
      &__body {
        display: flex;
        flex-direction: column;
        gap: 32px;
      }

      &__head {
        @include text.text-styles('body');
        color: var(--color-07);
      }

      &__body {
        @include text.text-styles('heading-s-variant');
      }
      tr {
        display: flex;
        th,
        td {
          flex: 1;
          text-align: right;

          &:first-child {
            text-align: left;
          }
        }
        td {
          color: var(--color-07);
          &:first-child,
          &:last-child {
            color: var(--color-text);
          }
        }
      }
    }

    &__price {
      background-color: var(--color-background-3);
      height: 80px;
      color: white;
      display: flex;
      justify-content: space-between;
      padding: 0 32px;
      align-items: center;
      border-bottom-right-radius: 8px;
      border-bottom-left-radius: 8px;

      &-title {
        @include text.text-styles('body');
      }

      &-total {
        font-weight: bold;
        font-size: 24px;
        line-height: 32px;
        letter-spacing: -0.5px;
      }
    }
  }
}
</style>
