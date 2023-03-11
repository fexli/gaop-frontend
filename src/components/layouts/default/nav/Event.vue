<script setup lang="ts">
import global_const from "../../../../utils/global_const";
import {createUserEvents, deleteUserEvents, getUserEvents, updateUserEvents} from "../../../../plugins/axios";
import {Ref} from "vue";
import TransitionOverlay from "../../../element/TransitionOverlay.vue";
import VueTailwindDatePicker from "../../../../thirdparty/VueTailwindDatePicker.vue";
import {ColorPicker} from "vue-color-kit";
import {useToast} from "../../../../hooks/toast";

const {showMessage} = useToast();

const eventGetOk = ref(false)
const sketchdSkadi = ref(true)
const editMode = ref(false)
const saveLoading = ref(false)
const eventNewOverlay: Ref<boolean> = ref(false)
const currentItem: Ref<Record<string, any>> = ref({})
const eventsInfo: Ref<Array<any>> = ref([])
const eventIcon = computed(() => {
  return eventGetOk.value ? eventsInfo.value.length ? 'calendar-text' : 'calendar-check' : 'calendar-alert'
})
const eventColor = computed(() => {
  return eventGetOk.value ? hasEventTsExpire() ? 'badge-primary' : '' : 'badge-error'
})

function hasEventTsExpire() {
  return eventsInfo.value.some((i: any) => {
    return i.noticeTime && new Date(i.noticeTime).getTime() < new Date().getTime()
  })
}

function deleteEvent(i: any) {
  console.log("deleteEv", i)
  deleteUserEvents(i.eventId).then(
      (res: any) => {
        showMessage(res.msg, 600, 'info')
        getEvents()
      }
  ).catch(
      (err) => {
        showMessage(err.data.msg, 4000, 'danger')
      }
  )
}

function editEvent(i: any) {
  console.log("editEv", i)
  currentItem.value = i
  editMode.value = true
  eventNewOverlay.value = true
}

function changeRemarkColor(c: any) {
  currentItem.value.color = c.hex + Math.round(c.rgba.a * 255).toString(16).padStart(2, '0')
}

function createEvent() {
  currentItem.value = {
    content: '',
    associate: '',
    noticeTime: '',
    color: '#FFFFFFFF'
  }
  editMode.value = false
  eventNewOverlay.value = true
}

function saveEvent() {
  saveLoading.value = true
  if (editMode.value) {
    updateUserEvents(currentItem.value).then(
        (res: any) => {
          showMessage(res.msg, 600, 'info')
          getEvents()
          eventNewOverlay.value = false
        }
    ).catch(
        (err) => {
          showMessage(err.data.msg, 4000, 'danger')
        }
    ).finally(() => {
      saveLoading.value = false
    })
  } else {
    createUserEvents(currentItem.value).then(
        (res: any) => {
          showMessage(res.msg, 600, 'info')
          getEvents()
          eventNewOverlay.value = false
        }
    ).catch(
        (err) => {
          showMessage(err.data.msg, 4000, 'danger')
        }
    ).finally(() => {
      saveLoading.value = false
    })
  }
}

function getEvents() {
  getUserEvents().then(
      (res: any) => {
        console.log(res)
        eventGetOk.value = true
        eventsInfo.value = res.data
      }
  ).catch(
      (err) => {
        eventGetOk.value = false
        console.log(err)
      }
  )
}

function compDate(a: Record<string, any>, b: Record<string, any>) {
  if (a.noticeTime && b.noticeTime) {
    return new Date(a.noticeTime).getTime() - new Date(b.noticeTime).getTime()
  } else if (a.noticeTime) {
    return -1
  } else if (b.noticeTime) {
    return 1
  } else {
    return 0
  }
}

onMounted(() => {
  getEvents()
})

</script>

<template>
  <div class="dropdown">
    <label tabindex="0" class="gap-1 normal-case mx-2 py-2 indicator">
      <span v-if="eventColor" class="indicator-item badge h-1.5 px-0.5 mt-2 animate-pulse" :class="eventColor"></span>
      <svg class="inline-block flex-shrink-0 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path stroke-width="1" :d="global_const.mdiPath[eventIcon]"/>
      </svg>
    </label>
    <div
        class="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px mt-9 w-80 overflow-y-auto shadow-lg -ml-[8.5rem] lg:-ml-24">
      <div class="relative bg-base-100 pt-1">
        <div class="text-primary text-lg font-bold w-full text-center">事件提醒</div>
        <div class="overflow-y-auto max-h-[30rem] min-h-[5rem]">
          <template v-if="eventGetOk && eventsInfo.length">
            <template v-for="(item,idx) in eventsInfo.sort((a,b)=>compDate(a,b))" v-bind:key="idx">
              <div class="w-full flex relative hover:bg-base-200 transition-all my-1 items-center">
                <div class="flex flex-col justify-center mx-2 text-title font-bold font-mono">
                  #{{ idx + 1 }}
                  <span v-if="item.color" class="badge badge-sm" :style="`background-color: ${item.color}`"/>
                </div>
                <div class="text-left">
                  <template v-for="line in item['content'].split('\n')">
                    <div class="break-all text-title">{{ line }}</div>
                  </template>
                  <div v-if="item['associate']" class="flex items-center gap-1">
                    <svg class="inline-block flex-shrink-0 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path stroke-width="1" :d="global_const.mdiPath['transit-connection-variant']"/>
                    </svg>
                    <span>{{ item['associate'] }}</span>
                  </div>
                  <div v-if="item['noticeTime']" class="flex items-center gap-1">
                    <svg class="inline-block flex-shrink-0 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path stroke-width="1" :d="global_const.mdiPath['timer']"/>
                    </svg>
                    <span>{{ item['noticeTime'] }}</span>
                  </div>
                </div>
                <div class="spacer"/>
                <button
                    v-if="item.__del"
                    class="fe-btn fe-btn_evt w-24 absolute right-9 top-4"
                    @click="deleteEvent(item)"
                >确认删除
                </button>
                <div class="flex flex-col justify-center mx-2 gap-1">
                  <button class="btn btn-ghost btn-circle btn-xs mr-1" @click="editEvent(item)">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" :d="global_const.mdiPath['book-edit']"/>
                    </svg>
                  </button>
                  <button class="btn btn-ghost btn-circle btn-xs mr-1" @click="item.__del = !item.__del">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" :d="global_const.mdiPath['delete-forever-outline']"/>
                    </svg>
                  </button>
                </div>
              </div>
            </template>
            <div class="h-20 text-secondary font-bold pr-2 w-full flex flex-col justify-center">
              <p>您当前有{{ eventsInfo.length }}个提醒</p>
              <p>(拿小本本记下来)</p>
            </div>
          </template>
          <div class="text-secondary font-bold pr-2 w-full flex flex-col justify-center h-20" v-else>
            <template v-if="eventGetOk && !eventsInfo.length">
              <p>这里什么都没有啦</p>
              <p>请先创建一个提醒</p>
            </template>
            <template v-if="!eventGetOk">
              <p>事件获取出错啦！</p>
              <p>请刷新或联系管理员</p>
            </template>
          </div>
        </div>
        <button @click="createEvent" class="fe-btn w-[70%] mr-1 mb-1">新建事件</button>
      </div>
      <div
          class="h-[7.25rem] w-16 absolute bottom-0 rounded-tr-[3.2rem] bg-base-100"
          @mouseenter.capture="sketchdSkadi = true"
          @mouseleave.passive="sketchdSkadi = false"
      />
      <div class="h-32 w-32 absolute bottom-0 pointer-events-none transition-all"
           :class="sketchdSkadi ? 'opacity-70' : 'opacity-30'"
           :style="`background-image: url('static/im/peep.png');background-size: contain;background-repeat: no-repeat;background-position: center`"/>
    </div>
  </div>
  <teleport to="body">
    <TransitionOverlay :show="eventNewOverlay" class="overlay bg-base-200 bg-opacity-50">
      <div class="card overflow-visible w-96 bg-neutral text-neutral-content ring-1 ring-secondary"
           v-if="eventNewOverlay">
        <div class="card-body p-3">
          <div class="flex gap-1 justify-center items-center">
            <h2 class="card-title text-secondary">{{ editMode ? '修改事件' : '创建事件' }}</h2>
          </div>
          <div class="flex gap-2">
            <div>事件时间</div>
            <div class="w-28">
              <div class="fixed w-28 z-10">
                <VueTailwindDatePicker
                    v-model="currentItem.noticeTime"
                    class="h-5"
                    :shortcuts="false"
                    :formatter="{
                    date: 'YYYY-MM-DD',
                    month: 'MM'
                  }"
                    placeholder="未选择时间"
                    i18n="zh-cn"
                    separator="~"
                    :use-range="false"
                    as-single
                />
              </div>
            </div>
          </div>
          <div class="flex gap-2 h-20">
            <div>事件信息</div>
            <textarea type="text" class="input ring-1 ring-secondary w-[17rem] h-20"
                      v-model="currentItem.content"></textarea>
          </div>
          <div class="flex gap-2">
            <div>关联账号</div>
            <input type="text" class="input ring-1 ring-secondary w-[17rem] h-7"
                   v-model="currentItem.associate">
          </div>
          <div class="flex gap-2 h-7">
            <div>事件颜色</div>
            <div title="Change Color" class="dropdown dropdown-right dropdown-top w-24">
              <label tabindex="0" :style="`background-color: ${currentItem.color}`"
                     class="gap-1 normal-case mr-2 rounded-md p-0.5 px-1">
                {{ currentItem.color || "点我设置" }}
              </label>
              <div
                  class="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px mt-10 w-36 overflow-visible shadow-lg">
                <ColorPicker
                    @changeColor="changeRemarkColor"
                    class="fixed -mt-40" :sucker-hide="true" theme="light"
                    :color="currentItem.color"
                />
              </div>
            </div>
          </div>
          <div class="card-actions w-full justify-end">
            <button :class="saveLoading ? 'loading' : ''" class="btn btn-sm btn-primary" @click="saveEvent">保存
            </button>
            <button class="btn btn-sm btn-ghost" @click="eventNewOverlay = false">取消
            </button>
          </div>
        </div>
      </div>
    </TransitionOverlay>
  </teleport>
</template>

