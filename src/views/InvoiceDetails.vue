<script setup lang="ts">
import StatusBadge from '@/components/StatusBadge'
import { useInvoiceStore } from '@/stores/invoice'
import { formatDate } from '@/utils/dateUtils'
import { useRouter } from 'vue-router'
import { formatNumber } from '@/utils/numberUtils'
import UpsertInvoice from './UpsertInvoice.vue'
import { ref } from 'vue'
import ConfirmationDialog from '@/components/ConfirmationDialog'

const router = useRouter()

const currentInvoice = useInvoiceStore().currentInvoice

const handleGoBack = () => {
  router.push('/')
}

const showEditInvoice = ref<boolean>(false)
const handleInvoiceEdit = () => {
  showEditInvoice.value = true
}

const showDeleteConfirm = ref<boolean>(false)
const handleInvoiceDelete = () => {
  showDeleteConfirm.value = true
}
const handleDeleteConfirm = () => {}

const handleInvoicePaid = () => {
  // currentInvoice?.status = 'paid'
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
            <div class="primary__content">{{ formatDate(currentInvoice?.createdAt ?? '') }}</div>
          </div>
          <div class="primary__wrapper">
            <div class="primary__title">Payment Due</div>
            <div class="primary__content">{{ formatDate(currentInvoice?.paymentDue ?? '') }}</div>
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

    <UpsertInvoice v-model="showEditInvoice" :data="currentInvoice" />
    <ConfirmationDialog
      v-model="showDeleteConfirm"
      title="Confirm Deletion"
      :message="`Are you sure you want to delete invoice #${currentInvoice?.id}?This action cannot be undone.`"
      confirm-text="Delete"
      @confirm="handleDeleteConfirm"
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
      color: var(--color-08);
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    height: 88px;
    background-color: white;
    padding: 24px 32px;
    border-radius: 8px;

    &__status {
      display: flex;
      align-items: center;
      gap: 20px;
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
        background-color: #f9fafe;
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
    background-color: white;
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
          color: var(--color-08);
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
        color: var(--color-08);
      }
    }
  }
  .items {
    margin-top: 26px;
    .table {
      display: flex;
      flex-direction: column;
      gap: 32px;
      background-color: #f9fafe;
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
            color: var(--color-08);
          }
        }
      }
    }

    &__price {
      background-color: #373b53;
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
