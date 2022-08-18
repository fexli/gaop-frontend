<script setup lang="ts">

import {appStore} from "../../../../store/app";
import {setLanguage} from "../../../../plugins/language";
const app = appStore()

</script>

<template>
  <div title="Change Language" class="dropdown dropdown-end">
    <label tabindex="0" class="gap-1 normal-case mx-2">
      <svg class="inline-block h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M363,176,246,464h47.24l24.49-58h90.54l24.49,58H480ZM336.31,362,363,279.85,389.69,362Z"></path>
        <path
            d="M272,320c-.25-.19-20.59-15.77-45.42-42.67,39.58-53.64,62-114.61,71.15-143.33H352V90H214V48H170V90H32v44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-32.68-43.44-47.14-75.88-47.33-76.22L143,152l-38,22,6.87,13.86c.89,1.56,17.19,37.9,54.71,86.57.92,1.21,1.85,2.39,2.78,3.57-49.72,56.86-89.15,79.09-89.66,79.47L64,368l23,36,19.3-11.47c2.2-1.67,41.33-24,92-80.78,24.52,26.28,43.22,40.83,44.3,41.67L255,362Z"></path>
      </svg>
      <svg class="inline-block h-6 w-2 fill-current opacity-60" xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 2048 2048">
        <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
      </svg>
    </label>
    <div
        class="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px mt-10 w-36 overflow-y-auto shadow-lg">
      <ul class="menu menu-compact gap-1 p-2" tabindex="0">
        <li>
          <button class="flex" :class="{'active':app.language === 'en'}" @click="setLanguage('en')">
            <img loading="lazy" width="20" height="20" alt="English"
                 src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/svg/1f1ec-1f1e7.svg">
            <span class="flex flex-1 justify-between">English </span>
          </button>
        </li>
        <li>
          <button class="flex" :class="{'active':app.language === 'zh_cn'}" @click="setLanguage('zh_cn')">
            <img loading="lazy" width="20" height="20" alt="中文"
                 src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/svg/1f1e8-1f1f3.svg">
            <span class="flex flex-1 justify-between">中文 </span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

