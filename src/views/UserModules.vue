<script setup lang="ts">

import {useTranslate} from "../hooks/translate";
import StatusInfo from "../components/parts/accountManage/StatusInfo.vue";
import global_const from "../utils/global_const";
import {addByShareModule, deleteUserModule, getUserModuleList, uploadUserModule} from "../plugins/axios";
import {Ref} from "vue";

import {useToast} from "../hooks/toast";
import TransitionOverlay from "../components/element/TransitionOverlay.vue";
import formatter from "../utils/formatter";
import ModuleInfo from "../components/userModule/ModuleInfo.vue";

const {showMessage} = useToast();

const {translate} = useTranslate();

const userModuleLists: Ref<Array<any>> = ref([])
const userModuleDetails: Ref<Array<any>> = ref([])
const uploadNewModuleOverlay: Ref<boolean> = ref(false)
const createScriptName: Ref<string> = ref('')
const createScriptDesc: Ref<string> = ref('')
const createScriptFile: Ref<File | null> = ref(null)
const createScriptFileInfo: Ref<string> = ref("")
const loadingUploadNewScript: Ref<boolean> = ref(false)

const deleteModuleInfo: Ref<Record<string, any>> = ref({})
const deleteModuleOverlay: Ref<boolean> = ref(false)

const shareModuleOverlay: Ref<boolean> = ref(false)
const shareNewHash: Ref<string> = ref('')
const loadingShareNew: Ref<boolean> = ref(false)
const addNewSharedModule = () => {
  loadingShareNew.value = true
  let hashes = shareNewHash.value.split("\n")
  console.log("addNewSharedModule", hashes)
  for (let hash of hashes) {
    addByShareModule(hash.toLowerCase()).then((res: any) => {
      console.log("uploadUserModule", res)
      showMessage(res.msg, 3000, 'info')
      shareModuleOverlay.value = false
      shareNewHash.value = ''
      fetchUserModuleList()
    }).catch((err: any) => {
      console.log("uploadUserModuleErr", err)
      showMessage(err.data.msg, 3000, 'danger')
    }).finally(()=>{
      loadingShareNew.value = false
    })
  }
}

const fetchUserModuleList = () => {
  getUserModuleList().then((res: any) => {
    console.log("fetchUserModuleList", res);
    userModuleLists.value = res.data.info
    userModuleDetails.value = res.data.details
  }).catch((err) => {
    console.log("fetchUserModuleListErr", err);
  })
}

const onSelectNewFile = async (e: any) => {
  const file: File = e.target.files[0]
  if (file) {
    createScriptFile.value = file
    createScriptFileInfo.value = await file.text()
  } else {
    createScriptFile.value = null
    createScriptFileInfo.value = ""
  }
}

function findModuleDetails(hash: string) {
  for (let module of userModuleDetails.value) {
    if (module.scriptHash === hash) {
      return module
    }
  }
  return null
}

const uploadNewScript = () => {
  if (createScriptFile.value == null) {
    showMessage("module.error.no_script_selected", 2000, "danger")
    return
  }
  if (createScriptName.value == '') {
    showMessage("module.error.no_script_name", 2000, "danger")
    return
  }
  if (createScriptFileInfo.value.length == 0) {
    showMessage("module.error.no_script_content", 2000, "danger")
    return
  }
  uploadUserModule(createScriptFileInfo.value, createScriptName.value, createScriptDesc.value).then((res: any) => {
    console.log("uploadNewScript", res);
    showMessage(res.msg, 2000, "success")
    fetchUserModuleList()
    uploadNewModuleOverlay.value = false
  }).catch((err) => {
    console.log("uploadNewScriptErr", err);
    showMessage(err.data.msg, 2000, "danger")
  })
}

function onDeleteModule(hash: any) {
  console.log("onDeleteModule", hash);
  deleteModuleInfo.value = hash
  deleteModuleOverlay.value = true
}

function onConfirmDeleteModule() {
  console.log("onConfirmDeleteModule", deleteModuleInfo.value);
  deleteUserModule(deleteModuleInfo.value.scriptHash).then((res: any) => {
    console.log("onConfirmDeleteModule", res);
    showMessage(res.msg, 10000, "success")
    fetchUserModuleList()
    deleteModuleOverlay.value = false
  }).catch((err) => {
    console.log("onConfirmDeleteModuleErr", err);
    showMessage(err.data.msg, 6000, "danger")
  })
  deleteModuleOverlay.value = false
}

onMounted(() => {
  console.log('mounted')
  fetchUserModuleList()
})
</script>
<template>
  <div class="flex flex-col lg:flex-row overflow-hidden">
    <div class="flex flex-wrap flex-row lg:flex-col">
      <StatusInfo class="mr-1 lg:mr-0" title="module.module_cnt"
                  :content="userModuleLists.filter((v)=> v.source === 0).length">
        <template v-slot:icon>
          <svg class="w-6 h-6" stroke="currentColor" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M38 30H10C6.68629 30 4 32.6863 4 36C4 39.3137 6.68629 42 10 42H38C41.3137 42 44 39.3137 44 36C44 32.6863 41.3137 30 38 30Z M36 22C40.4183 22 44 18.4183 44 14C44 9.58172 40.4183 6 36 6C31.5817 6 28 9.58172 28 14C28 18.4183 31.5817 22 36 22Z M4 14L13 5L22 14L13 23L4 14Z"
                fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </template>
      </StatusInfo>
      <StatusInfo class="mr-1 lg:mr-0 mt-0 lg:mt-1" title="module.remain_ts" content="∞h">
        <template v-slot:icon>
          <svg class="h-6 w-6" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                :d="global_const.mdiPath[false ? 'timer-off-outline' : 'timer-play-outline']"/>
          </svg>
        </template>
      </StatusInfo>
    </div>
    <div class="ml-0 lg:ml-1 mt-1 lg:mt-0 w-full">
      <div class="overflow-hidden rounded-xl">
        <div class="flex items-center bg-base-200 py-2 px-1 font-bold">
          <div class="text-xl ml-2 py-2 nowrap-hidden-ellipsis">{{ translate('module.list.title') }}</div>
          <div class="spacer"></div>
          <!--          <div class="table-head-btn" @click="changeMinotorType">-->
          <!--            <svg style="width:24px;height:24px" viewBox="0 0 24 24">-->
          <!--              <path fill="currentColor"-->
          <!--                    d="M3 4V16H21V4H3M3 2H21C22.1 2 23 2.89 23 4V16C23 16.53 22.79 17.04 22.41 17.41C22.04 17.79 21.53 18 21 18H14V20H16V22H8V20H10V18H3C2.47 18 1.96 17.79 1.59 17.41C1.21 17.04 1 16.53 1 16V4C1 2.89 1.89 2 3 2M10.84 8.93C11.15 8.63 11.57 8.45 12 8.45C12.43 8.46 12.85 8.63 13.16 8.94C13.46 9.24 13.64 9.66 13.64 10.09C13.64 10.53 13.46 10.94 13.16 11.25C12.85 11.56 12.43 11.73 12 11.73C11.57 11.73 11.15 11.55 10.84 11.25C10.54 10.94 10.36 10.53 10.36 10.09C10.36 9.66 10.54 9.24 10.84 8.93M10.07 12C10.58 12.53 11.28 12.82 12 12.82C12.72 12.82 13.42 12.53 13.93 12C14.44 11.5 14.73 10.81 14.73 10.09C14.73 9.37 14.44 8.67 13.93 8.16C13.42 7.65 12.72 7.36 12 7.36C11.28 7.36 10.58 7.65 10.07 8.16C9.56 8.67 9.27 9.37 9.27 10.09C9.27 10.81 9.56 11.5 10.07 12M6 10.09C6.94 7.7 9.27 6 12 6C14.73 6 17.06 7.7 18 10.09C17.06 12.5 14.73 14.18 12 14.18C9.27 14.18 6.94 12.5 6 10.09Z"/>-->
          <!--            </svg>-->
          <!--            <div class="hidden md:flex">{{ translate('account.change_type') }}</div>-->
          <!--          </div>-->
          <!--          <div class="table-head-btn" :class="loadingReload ? 'loading disabled' : ''" @click="reloadGameAccount">-->
          <!--            <svg v-show="!loadingReload" style="width:24px;height:24px" viewBox="0 0 24 24">-->
          <!--              <path fill="currentColor"-->
          <!--                    d="M21.5 9H16.5L18.36 7.14C16.9 5.23 14.59 4 12 4C7.58 4 4 7.58 4 12C4 13.83 4.61 15.5 5.64 16.85C6.86 15.45 9.15 14.5 12 14.5C14.85 14.5 17.15 15.45 18.36 16.85C19.39 15.5 20 13.83 20 12H22C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C15.14 2 17.95 3.45 19.78 5.72L21.5 4V9M12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7Z"/>-->
          <!--            </svg>-->
          <!--            <div class="hidden sm:flex">{{ translate('account.reload_account') }}</div>-->
          <!--          </div>-->
          <div class="table-head-btn" @click="shareModuleOverlay = true">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="currentColor" :d="global_const.mdiPath['share-variant']"/>
            </svg>
            <div class="hidden sm:flex">{{ translate('module.addsre') }}</div>
          </div>
          <div class="table-head-btn mr-1" @click="uploadNewModuleOverlay = true">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="currentColor" :d="global_const.mdiPath['cloud-upload-outline']"/>
            </svg>
            <div class="hidden sm:flex">{{ translate('module.upload_new') }}</div>
          </div>
        </div>
      </div>
      <div class="flex flex-col overflow-auto overscroll-x-contain mt-1" style="height: calc(100vh - 10rem)">
        <template v-for="(i,k) of userModuleLists" v-bind:key="k">
          <ModuleInfo
              class="mb-1"
              :module-details="findModuleDetails(i.scriptHash)"
              :module-info="i"
              :index="k+1"
              :delete="onDeleteModule"
              :fetch="fetchUserModuleList"
          />
        </template>
      </div>
    </div>
  </div>
  <TransitionOverlay
      :show="uploadNewModuleOverlay"
      class="overlay bg-base-200 bg-opacity-50"
  >
    <div class="card w-96 max-w-md glass rounded-2xl min-h-[30rem]" v-if="uploadNewModuleOverlay">
      <figure class="select-none rounded-2xl"><img :src="`static/im/upload_module.jpg`" alt="upload"></figure>
      <div class="absolute right-0 top-0 p-2" @click="uploadNewModuleOverlay = false">
        <svg class="w-8 h-8" viewBox="0 0 24 24">
          <path fill="currentColor"
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
        </svg>
      </div>
      <div class="create-user-card-body rounded-b-2xl" style="padding: 1rem 2em 2rem 2rem!important;">
        <h2 class="card-title text-neutral">{{ translate('module.upload_new') }}</h2>
        <p class="text-neutral">{{ translate('module.upload_info') }}</p>

        <div class="relative  h-16">
          <input
              v-model="createScriptName"
              :placeholder="translate('module.name')"
              class="fe-input"
          />
          <label class="label mt-[-0.1rem]">
              <span class="label-text-alt text-error">
                {{ createScriptName === '' ? translate("module.error.name_empty") : "" }}
              </span>
          </label>
        </div>

        <div class="relative h-16">
          <textarea
              class="textarea text-neutral textarea-primary bg-gray-100 min-h-16 max-h-16 text-sm w-full px-2 py-1 rounded-xl"
              :placeholder="translate('module.desc')" v-model="createScriptDesc"
          ></textarea>
        </div>

        <div class="relative form-control w-full">
          <input
              type="file"
              @change="onSelectNewFile"
              accept=".ts"
              class="file-input file-input-md file-input-primary file-input-bordered w-full bg-gray-100 text-neutral rounded-xl"
          />
          <label class="label -my-1">
            <span class="label-text-alt text-neutral">{{ translate('module.upload.ts') }}</span>
            <span class="label-text-alt text-neutral">{{
                createScriptFile ? formatter.formatFileSize(createScriptFile.size) : translate('no_file_selected')
              }}</span>
          </label>
        </div>
        <div class="card-actions flex flex-row">
          <div class="spacer"></div>
          <button @click="uploadNewScript" :class="loadingUploadNewScript ? 'loading disabled pl-6':''"
                  class="btn rounded-xl btn-md h-8 btn-primary">
            {{ loadingUploadNewScript ? '' : translate('module.upload_new') }}
          </button>
        </div>
      </div>
    </div>
  </TransitionOverlay>
  <TransitionOverlay
      :show="deleteModuleOverlay"
      class="overlay bg-base-200 bg-opacity-50"
  >
    <div class="card w-96 bg-neutral text-neutral-content" v-if="deleteModuleOverlay">
      <div class="card-body items-center text-center">
        <div class="flex gap-1 items-center">
          <svg class="text-warning w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor"
                  d="M8.27,3L3,8.27V15.73L8.27,21H15.73C17.5,19.24 21,15.73 21,15.73V8.27L15.73,3M9.1,5H14.9L19,9.1V14.9L14.9,19H9.1L5,14.9V9.1M11,15H13V17H11V15M11,7H13V13H11V7"/>
          </svg>
          <h2 class="card-title text-warning">{{ translate('module.delete_title', deleteModuleInfo.scriptName) }}</h2>
        </div>
        <p class="text-warning">{{ translate('module.delete_confirm') }}</p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary" @click="onConfirmDeleteModule">{{ translate('module.delete_btn') }}</button>
          <button class="btn btn-ghost" @click="deleteModuleOverlay = false">{{
              translate('account.delete_deny')
            }}
          </button>
        </div>
      </div>
    </div>
  </TransitionOverlay>
  <TransitionOverlay
      :show="shareModuleOverlay"
      class="overlay bg-base-200 bg-opacity-50"
  >
    <div class="card w-96 max-w-md rounded-2xl" v-if="shareModuleOverlay">
      <div class="absolute right-0 top-0 p-2" @click="shareModuleOverlay = false">
        <svg class="w-8 h-8" viewBox="0 0 24 24">
          <path fill="currentColor"
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
        </svg>
      </div>
      <div class="card-body bg-base-200 rounded-2xl" style="padding: 1rem 2em 2rem 2rem!important;">
        <h2 class="card-title text-primary">{{ translate('module.share_new') }}</h2>
        <p class="text-primary">{{ translate('module.enable_info') }}</p>

        <div class="relative h-32">
          <textarea
              class="textarea text-neutral textarea-primary bg-gray-100 min-h-[8rem] max-h-32 text-sm w-full px-2 py-1 rounded-xl"
              :placeholder="translate('module.enable_desc')" v-model="shareNewHash"
          ></textarea>
        </div>

        <div class="card-actions flex flex-row justify-center">
          <button @click="addNewSharedModule" :class="loadingShareNew ? 'loading disabled pl-6':''"
                  class="btn rounded-xl btn-md h-8 btn-primary">
            {{ loadingShareNew ? '' : translate('module.upload_new') }}
          </button>
        </div>
      </div>
    </div>
  </TransitionOverlay>
</template>

