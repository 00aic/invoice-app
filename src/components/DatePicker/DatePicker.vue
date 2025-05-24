<script setup lang="ts">
import { formatDate, formatIntlDate } from '@/utils/dateUtils'
import { computed, ref } from 'vue'

interface Props {
  format?: string
}
const props = withDefaults(defineProps<Props>(), {
  format: 'yyyy-MM-dd',
})

const selectedDate = defineModel({ type: String })

const isOpen = ref<boolean>(false)
const handleDropdown = () => {
  isOpen.value = !isOpen.value
}

const weekdayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const currentDate = ref<Date>(new Date())
const year = ref<number>(currentDate.value.getFullYear())
const month = ref<number>(currentDate.value.getMonth())

const currentMonth = computed(() =>
  formatIntlDate(new Date(year.value, month.value), {
    month: 'short',
    year: 'numeric',
  }),
)

const calendarDays = computed(() => {
  // 当月第一天
  const firstDay = new Date(year.value, month.value, 1)
  // 当月最后一天
  const lastDay = new Date(year.value, month.value + 1, 0)
  // 上个月最后几天
  const prevMonthLastDay = new Date(year.value, month.value, 0).getDate()
  // 当月第一天是星期几
  const firstDayOfWeek = firstDay.getDay()

  const days = []

  // 添加上个月的几天
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year.value, month.value - 1, prevMonthLastDay - i)
    days.push({
      date,
      isCurrentMonth: false,
    })
  }

  // 添加当月的所有天
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year.value, month.value, i)
    days.push({
      date,
      isCurrentMonth: true,
    })
  }

  const remainingDays = 7 - (days.length % 7)
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year.value, month.value + 1, i)
      days.push({
        date,
        isCurrentMonth: false,
      })
    }
  }

  return days
})

const handlePrevMonth = () => {
  if (month.value === 0) {
    month.value = 11
    year.value--
  } else {
    month.value--
  }
}

const handleNextMonth = () => {
  if (month.value === 11) {
    month.value = 0
    year.value++
  } else {
    month.value++
  }
}
const selectedShowDate = computed(() =>
  selectedDate.value
    ? formatIntlDate(selectedDate.value, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '',
)
const handleSelect = (day: { date: Date; isCurrentMonth: boolean }) => {
  if (day.isCurrentMonth) {
    selectedDate.value = formatDate(day.date, props.format)
    isOpen.value = false
  }
}
</script>
<template>
  <div class="date">
    <div class="header vee-form" @click="handleDropdown">
      <span class="header__title">{{ selectedShowDate }}</span>
      <div><img src="@/assets/images/icon-calendar.svg" alt="calendar" /></div>
    </div>
    <div class="picker" v-if="isOpen">
      <div class="month">
        <div class="month__arrow" @click="handlePrevMonth">
          <img src="@/assets/images/icon-arrow-left.svg" alt="" />
        </div>
        <div>
          {{ currentMonth }}
        </div>
        <div class="month__arrow" @click="handleNextMonth">
          <img src="@/assets/images/icon-arrow-right.svg" alt="" />
        </div>
      </div>
      <div class="week">
        <div v-for="day in weekdayNames" :key="day">{{ day }}</div>
      </div>
      <div class="days">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="day"
          :class="{ 'current-month': day.isCurrentMonth }"
          @click="handleSelect(day)"
        >
          {{ day.date.getDate() }}
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.date {
  position: relative;
  display: flex;
  width: 240px;
  height: 48px;
  @include text.text-styles('heading-s-variant');
  color: var(--color-text);

  .header {
    display: flex;
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background-color: var(--color-background-1);
    align-items: center;
    padding: 0 20px;
    cursor: pointer;

    &:hover {
      border-color: var(--color-01);
    }

    &__title {
      flex: 1;
    }
  }
  .picker {
    width: 100%;
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: 0 10px 20px var(--color-14);
    background-color: var(--color-background-1);
    border-color: var(--color-13);
    padding: 26px 19px;
    // transform: translateZ(0); // 强制新图层
    // opacity: 1;
    z-index: 1000;

    .month {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;

      &__arrow {
        display: flex;
        justify-content: center;
        cursor: pointer;
      }
    }

    .week {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      row-gap: 16px;
      column-gap: 15px;
      margin-bottom: 5px;
    }

    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      row-gap: 16px;
      column-gap: 15px;

      .day {
        &:not(.current-month) {
          opacity: 0.0814;
        }
      }
      .current-month:hover {
        color: var(--color-02);
        cursor: pointer;
      }
    }
  }
}
</style>
