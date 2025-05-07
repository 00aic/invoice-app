<script setup lang="ts">
import { reactive } from 'vue'
import type { Invoice } from '@/types/invoice'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import DrawerWrapper from '@/components/DrawerWrapper'
import FormItem from '@/components/FormItem'

const visible = defineModel({ type: Boolean, default: false })

interface Props {
  data?: Invoice
}

const props = defineProps<Props>()

const formData = reactive<Invoice>({
  id: '',
  createdAt: '',
  paymentDue: '',
  description: '',
  paymentTerms: 0,
  clientName: '',
  clientEmail: '',
  status: '',
  senderAddress: {
    street: '',
    city: '',
    postCode: '',
    country: '',
  },
  clientAddress: {
    street: '',
    city: '',
    postCode: '',
    country: '',
  },
  items: [],
  total: 0,
  ...props.data,
})

const schema = yup.object({
  id: yup.string().required("Can't be empty"),
  email: yup.string().required("Can't be empty"),
})

// 使用表单hooks
const { handleSubmit } = useForm({
  validationSchema: schema,
})

const handleFormSubmit = handleSubmit((values) => {
  console.log('提交数据:', values)
  // API调用...
  visible.value = false
})

const handleDrawerClose = () => {
  console.log('抽屉已关闭')
}

const handleItemAdd = () => {
  formData.items.push({
    name: '',
    quantity: 0,
    price: 0,
    total: 0,
  })
}

const handleItemDelete = (index: number) => {
  formData.items.splice(index, 1)
}
</script>

<template>
  <div>
    <DrawerWrapper
      v-model="visible"
      :title="formData.id ? `Edit #${formData.id}` : 'New Invoice'"
      :width="616"
      @close="handleDrawerClose"
    >
      <form class="form">
        <div class="fieldset">
          <div class="legend">Bill From</div>
          <FormItem
            v-model="formData.senderAddress.street"
            name="senderAddress.street"
            label="Street Address"
          ></FormItem>

          <div class="group">
            <FormItem
              v-model="formData.senderAddress.city"
              name="senderAddress.city"
              label="City"
            ></FormItem>

            <FormItem
              v-model="formData.senderAddress.postCode"
              name="senderAddress.postCode"
              label="Post Code"
            ></FormItem>

            <FormItem
              v-model="formData.senderAddress.country"
              name="senderAddress.country"
              label="Country"
            ></FormItem>
          </div>
        </div>
        <div class="fieldset">
          <div class="legend">Bill To</div>
          <FormItem
            v-model="formData.clientName"
            name="clientName"
            label="Client's Name"
          ></FormItem>

          <FormItem
            v-model="formData.clientEmail"
            name="clientEmail"
            label="Client's Email"
            placeholder="e.g. email@example.com"
          ></FormItem>

          <FormItem
            v-model="formData.clientAddress.street"
            name="clientAddress.street"
            label="Street Address"
          ></FormItem>

          <div class="group">
            <FormItem
              v-model="formData.clientAddress.city"
              name="clientAddress.city"
              label="City"
            ></FormItem>

            <FormItem
              v-model="formData.clientAddress.postCode"
              name="clientAddress.postCode"
              label="Post Code"
            ></FormItem>

            <FormItem
              v-model="formData.clientAddress.country"
              name="clientAddress.country"
              label="Country"
            ></FormItem>
          </div>

          <div class="group">
            <FormItem
              v-model="formData.createdAt"
              name="createdAt"
              label="Invoice Date"
              v-slot="{ field }"
            >
              <input v-bind="field" type="date" id="createdAt" />
            </FormItem>
            <FormItem
              v-model="formData.paymentTerms"
              name="paymentTerms"
              label="Payment Terms"
              v-slot="{ field }"
            >
              <select v-bind="field">
                <option :value="1">Net 1 Day</option>
                <option :value="7">Net 7 Days</option>
                <option :value="14">Net 14 Days</option>
                <option :value="30">Net 30 Days</option>
              </select>
            </FormItem>
          </div>

          <FormItem
            v-model="formData.description"
            name="description"
            label="Project Description"
            placeholder="e.g. Graphic Design Service"
          ></FormItem>
        </div>

        <div class="fieldset">
          <div class="table">Item List</div>
          <div class="group item item-label">
            <label class="item__name">Item Name</label>
            <label class="item__quantity">Qty.</label>
            <label class="item__price">Price</label>
            <label class="item__total">Total</label>
            <label class="item__delete"></label>
          </div>
          <div
            class="group item"
            v-for="(item, index) in formData.items"
            :key="`item.name${index}`"
          >
            <FormItem class="item__name" v-model="item.name" :name="`itemName${index}`"></FormItem>
            <FormItem
              class="item__quantity"
              v-model="item.quantity"
              :name="`itemQty${index}`"
            ></FormItem>
            <FormItem
              class="item__price"
              v-model="item.price"
              :name="`itemPrice${index}`"
            ></FormItem>
            <div class="item__total">{{ item.total }}</div>
            <div class="item__delete" @click="handleItemDelete(index)">
              <img src="@/assets/images/icon-delete.svg" alt="Delete Item" />
            </div>
          </div>

          <div class="item__add" @click="handleItemAdd">+ Add New Item</div>
        </div>
      </form>

      <template #footer>
        <button @click="visible = false">取消</button>
        <button class="submit-btn" @click="handleFormSubmit">提交</button>
      </template>
    </DrawerWrapper>
  </div>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  margin-right: 16px;
}
.fieldset {
  border: none;
  display: flex;
  flex-direction: column;

  .legend {
    margin-bottom: 24px;
    @include text.text-styles('heading-s-variant');
    color: var(--color-01);
  }

  .table {
    margin-bottom: 14px;
    font-weight: bold;
    font-size: 18px;
    line-height: 32px;
    letter-spacing: -0.38px;
    color: #777f98;
  }

  .group {
    display: flex;
    gap: 24px;
    flex: 0 1 0;
  }

  .item {
    gap: 16px;
    align-items: center;

    &__name {
      flex-basis: 214px;
    }

    &__quantity {
      flex-basis: 70px;
    }

    &__price {
      flex-basis: 100px;
    }

    &__total {
      padding: 0 20px 0 0;
    }

    &__delete {
    }

    &__add {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      background-color: #f9fafe;
      border-color: #979797;
      border-radius: 24px;
      width: 100%;
      @include text.text-styles('heading-s-variant');
      color: var(--color-07);
      cursor: pointer;
    }

    &-label {
      @include text.text-styles('body-variant');
      color: var(--color-07);
    }
  }
}
</style>
