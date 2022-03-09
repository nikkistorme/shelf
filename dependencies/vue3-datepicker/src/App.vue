<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div>
    <datepicker
      v-model="selected"
      class="picker"
      :locale="locale"
      :upper-limit="to"
      :lower-limit="from"
      :clearable="true"
      minimum-view="day"
      :disabled-dates="{ predicate: isToday }"
    >
      <template #clear="{ onClear }">
        <button @click="onClear">x</button>
      </template>
    </datepicker>
  </div>
  <div>
    <datepicker
      v-model="time"
      class="picker"
      :locale="locale"
      starting-view="time"
      minimum-view="time"
      input-format="HH:mm"
      placeholder="selectTime"
      :disabled-time="{ predicate: isMorning }"
    />
  </div>
  <div>
    <datepicker
      v-model="full"
      class="picker"
      :locale="locale"
      minimum-view="time"
      input-format="HH:mm dd.MM.yyyy"
      placeholder="date & time"
      :disabled-time="{ dates: disabledTime }"
    />
  </div>
  <div>
    <datepicker
      v-model="from"
      class="picker"
      weekday-format="iiiiii"
      month-list-format="LLLL"
      :locale="locale"
      placeholder="from"
    />
  </div>
  <div>
    <datepicker v-model="to" class="picker" placeholder="to" />
  </div>
  <div>
    <datepicker
      v-model="to"
      class="picker"
      :locale="locale"
      disabled
      placeholder="disabled"
    />
  </div>
  <div>
    <datepicker
      v-model="yearSelected"
      class="picker"
      :locale="locale"
      minimum-view="year"
      placeholder="selectYear"
    />
  </div>
  <div>
    <datepicker
      v-model="monthSelected"
      class="picker"
      :locale="locale"
      minimum-view="month"
      starting-view="year"
      placeholder="selectMonth"
    />
  </div>
</template>

<script>
import Datepicker from './datepicker/Datepicker.vue'
import { defineComponent } from 'vue'
import { enUS } from 'date-fns/locale'
import { isSameDay, set } from 'date-fns'

export default defineComponent({
  name: 'App',
  components: {
    Datepicker,
  },
  data() {
    return {
      time: null,
      full: null,
      selected: null,
      from: null,
      to: null,
      yearSelected: null,
      monthSelected: null,
      disabledTime: [
        set(new Date(), { hours: 11, minutes: 12 }),
        set(new Date(), { hours: 12, minutes: 30 }),
      ],
    }
  },
  computed: {
    locale: () => enUS,
  },
  watch: {
    selected: (value) => console.log(value),
  },
  methods: {
    isToday(date) {
      return isSameDay(date, new Date())
    },
    isMorning(date) {
      const newDate = set(new Date(date.getTime()), { hours: 11, minutes: 0 })
      return date < newDate
    },
  },
})
</script>

<style>
.picker {
  color: #3c4a5a;
}
</style>
