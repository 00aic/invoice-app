<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Invoice } from '@/types/invoice'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import DrawerWrapper from '@/components/DrawerWrapper'
import FormItem from '@/components/FormItem'
import { formatNumber } from '@/utils/numberUtils'
import { addInvoice, updateInvoice } from '@/api/invoice'
import { cloneDeep } from 'lodash'
import SelectPicker from '@/components/SelectPicker'

const emit = defineEmits<{ edit: [data: Invoice]; add: [] }>()

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
  status: 'draft',
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
})

const isEdit = ref<boolean>(false)

const schema = yup.object({
  // id: yup.string().required("Can't be empty"),
  // email: yup.string().required("Can't be empty"),
})

// 使用表单hooks
const { handleSubmit } = useForm<Invoice>({
  validationSchema: schema,
})

const handleFormDiscard = () => {
  visible.value = false
}

const handleFormDraft = handleSubmit(async () => {
  formData.status = 'draft'
  await addInvoice(formData)
  visible.value = false
  emit('add')
})

const handleFormAdd = handleSubmit(async () => {
  formData.status = 'pending'
  await addInvoice(formData)
  visible.value = false
  emit('add')
})

const handleItemAdd = () => {
  formData.items.push({
    name: '',
    quantity: 0,
    price: 0,
    total: 0,
  })
}

const handleFormCancel = () => {
  visible.value = false
}

const handleFormEdit = handleSubmit(async () => {
  await updateInvoice(formData)
  visible.value = false
  emit('edit', formData)
})
const handleItemDelete = (index: number) => {
  formData.items.splice(index, 1)
}

// 只计算不生成新数组
const calculateTotals = () => {
  let grandTotal = 0
  formData.items.forEach((item) => {
    const newTotal = item.quantity * item.price
    if (item.total !== newTotal) {
      item.total = newTotal
    }
    grandTotal += newTotal
  })
  formData.total = grandTotal
}

// 监听items及其内部变化
watch(
  () => [...formData.items], // 浅拷贝触发监听
  calculateTotals,
  { deep: true, immediate: true },
)
watch(
  () => props.data,
  (newVal) => {
    if (newVal) {
      Object.assign(formData, cloneDeep(newVal))
    }
    isEdit.value = !!formData.id
  },
)

const resetForm = () => {
  Object.assign(formData, cloneDeep(props.data))
}

defineExpose({ resetForm })

const paymentTermOptions = [
  {
    value: 1,
    label: 'Net 1 Day',
  },
  {
    value: 7,
    label: 'Net 7 Days',
  },
  {
    value: 14,
    label: 'Net 14 Days',
  },
  {
    value: 30,
    label: 'Net 30 Days',
  },
]
</script>

<template>
  <div>
    <DrawerWrapper
      v-model="visible"
      :title="isEdit ? `Edit #${formData.id}` : 'New Invoice'"
      :width="616"
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
              <SelectPicker
                v-bind="field"
                :model-value="field.value"
                :options="paymentTermOptions"
              />
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
            <label>Total</label>
            <label></label>
          </div>
          <div
            class="group item"
            v-for="(item, index) in formData.items"
            :key="`item.name${index}`"
          >
            <FormItem
              class="item__name"
              v-model="item.name"
              :name="`items[${index}].name`"
            ></FormItem>
            <FormItem
              class="item__quantity"
              v-model="item.quantity"
              :name="`items[${index}].quantity`"
            ></FormItem>
            <FormItem
              class="item__price"
              v-model="item.price"
              :name="`items[${index}].price`"
            ></FormItem>
            <FormItem v-model="item.total" :name="`items[${index}].total`">
              <div>{{ formatNumber(item.total, { style: 'decimal' }) }}</div>
            </FormItem>

            <FormItem name="">
              <div @click="handleItemDelete(index)" class="item__delete">
                <img src="@/assets/images/icon-delete.svg" alt="Delete Item" />
              </div>
            </FormItem>
          </div>

          <div class="item__add" @click="handleItemAdd">+ Add New Item</div>
        </div>
      </form>

      <template #footer>
        <div class="footer" v-if="!isEdit">
          <button class="footer__cancel" @click="handleFormDiscard">Discard</button>
          <button class="footer__draft" @click="handleFormDraft">Save as Draft</button>
          <button class="footer__save" @click="handleFormAdd">Save & Send</button>
        </div>

        <div class="footer" v-if="isEdit">
          <button class="footer__cancel" @click="handleFormCancel">Cancel</button>
          <button class="footer__save" @click="handleFormEdit">Save Changes</button>
        </div>
      </template>
    </DrawerWrapper>
  </div>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  margin-right: 24px;
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

    :last-child {
      margin-bottom: 0px;
    }

    &__name {
      flex-basis: 214px;
    }

    &__quantity {
      flex-basis: 70px;
    }

    &__price {
      flex-basis: 100px;
    }

    // &__total {
    //   // padding: 0 20px 0 0;
    // }

    &__delete {
      cursor: pointer;
    }

    &__add {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      background-color: #f9fafe;
      border-color: var(--color-13);
      border-radius: 24px;
      width: 100%;
      @include text.text-styles('heading-s-variant');
      color: var(--color-07);
      cursor: pointer;
      margin-top: 15px;

      &:hover {
        background-color: var(--color-05);
      }
    }

    &-label {
      @include text.text-styles('body-variant');
      color: var(--color-07);
    }
  }
}

:deep(.drawer__footer) {
  padding: 39px 56px;
  background-color: white;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  border-color: var(--color-13);
}

.footer {
  display: flex;
  justify-content: end;
  @include text.text-styles('heading-s-variant');
  height: 48px;
  gap: 8px;

  button {
    padding: 16px 24px;
    border: none;
    border-radius: 24px;
    border-color: var(--color-13);
    cursor: pointer;
  }

  &__cancel {
    background-color: #f9fafe;
    color: var(--color-07);
    justify-self: start;
  }

  &__draft {
    background-color: #373b53;
    color: var(--color-06);
    margin-left: auto;
  }

  &__save {
    background-color: var(--color-01);
    color: white;
  }
}
</style>
