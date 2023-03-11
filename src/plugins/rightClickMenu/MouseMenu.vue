<script lang="ts">
import {defineComponent, ref, computed, nextTick, PropType, Ref, watch, onUnmounted} from 'vue';
import {MenuCallback, MenuSetting} from './type';
import global_const from "../../utils/global_const";

const clone = function (obj: any) {
  let newObj: any = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === 'object') {
          newObj[key] = clone(obj[key]);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
  }
  return newObj;
};

export default defineComponent({
  name: 'MouseMenu',
  props: {
    appendToBody: {
      type: Boolean,
      default: true
    },
    menuWidth: {
      type: Number,
      default: 200
    },
    menuList: {
      type: Array as PropType<MenuSetting[]>,
      required: true
    },
    menuHiddenFn: {
      type: Function as PropType<MenuCallback>
    },
    hasIcon: {
      type: Boolean,
      default: false
    },
    iconType: {
      type: String,
      default: 'font-icon'
    },
    menuWrapperCss: Object as PropType<Record<string, string>>,
    menuItemCss: Object as PropType<Record<string, string>>,
    el: {
      type: Object as PropType<HTMLElement>,
      required: true
    },
    params: {
      type: [String, Number, Array, Object] as PropType<any>
    },
    useLongPressInMobile: Boolean,
    longPressDuration: Number,
    injectCloseListener: {
      type: Boolean,
      default: true
    },
    customClass: String,
    disabled: {
      type: Function as PropType<MenuCallback<boolean>>
    }
  },
  setup(props) {
    const subLeft = ref(0);
    const subTop = ref(0);
    const hoverFlag = ref(false);
    const menuTop = ref(0);
    const menuLeft = ref(0);
    const showMenu = ref(false);
    const clickDomEl = ref(null) as Ref<null | HTMLElement>;
    const calcMenuList = ref([] as MenuSetting[]);
    const hasSubMenu = computed(() => props.menuList.some(item => item.children && item.children.length > 0));
    const arrowSize = ref(10);
    const MenuWrapper = ref();

    watch(showMenu, async (val) => {
      if (val) {
        await nextTick();
        let el = MenuWrapper.value;
        if (props.menuWrapperCss) {
          Object.keys(props.menuWrapperCss).map(item => {
            el.style.setProperty(`--menu-${item}`, props.menuWrapperCss && props.menuWrapperCss[item]);
          });
        }
        if (props.menuItemCss) {
          Object.keys(props.menuItemCss).map(item => {
            el.style.setProperty(`--menu-item-${item}`, props.menuItemCss && props.menuItemCss[item]);
          });
        }
        let _arrowSize: RegExpMatchArray | null | undefined | number = props.menuItemCss?.arrowSize?.match(/\d+/);
        if (_arrowSize) {
          arrowSize.value = ~~_arrowSize[0] || 10;
        } else {
          arrowSize.value = 10;
        }
        el.style.setProperty('--menu-item-arrowRealSize', arrowSize.value / 2 + 'px');
      }
    });

    const handleMenuItemClick = (item: MenuSetting, $event: any) => {
      if (item.disabled) return;
      if (item.fn && typeof item.fn === 'function') {
        item.fn(props.params, clickDomEl.value, props.el, $event);
      }
      showMenu.value = false;
    };
    const handleSubMenuItemClick = (subItem: MenuSetting, $event: any) => {
      if (subItem.disabled) return;
      if (subItem.fn && typeof subItem.fn === 'function' && !subItem.disabled) {
        subItem.fn(props.params, clickDomEl.value, props.el, $event);
        hoverFlag.value = false;
      }
      showMenu.value = false;
    };
    const handleMenuMouseEnter = ($event: MouseEvent, item: MenuSetting) => {
      if (item.children && !item.disabled) {
        hoverFlag.value = true;
        const el = $event.currentTarget as HTMLElement;
        if (!el) return;
        const {offsetWidth} = el;
        const subEl = el.querySelector('.__menu__sub__wrapper') as HTMLElement;
        if (!subEl) return;
        const {offsetWidth: subOffsetWidth, offsetHeight: subOffsetHeight} = subEl;
        const {innerWidth: windowWidth, innerHeight: windowHeight} = window;
        const {top, left} = el.getBoundingClientRect();
        if (left + offsetWidth + subOffsetWidth > windowWidth - 5) {
          subLeft.value = left - subOffsetWidth + 5;
        } else {
          subLeft.value = left + offsetWidth;
        }
        if (top + subOffsetHeight > windowHeight - 5) {
          subTop.value = windowHeight - subOffsetHeight;
        } else {
          subTop.value = top + 5;
        }
      }
    };

    const formatterFnOption = (list: MenuSetting[], clickDomEl: HTMLElement, el: HTMLElement, params: any): MenuSetting[] => {
      return list.map(item => {
        if (item.children) {
          item.children = formatterFnOption(item.children, clickDomEl, el, params);
        }
        if (item.label && typeof item.label === 'function') {
          item.label = item.label(params, clickDomEl, el);
        }
        if (item.tips && typeof item.tips === 'function') {
          item.tips = item.tips(params, clickDomEl, el);
        }
        if (item.icon && typeof item.icon === 'function') {
          item.icon = item.icon(params, clickDomEl, el);
        }
        if (item.hidden && typeof item.hidden === 'function') {
          item.hidden = item.hidden(params, clickDomEl, el);
        }
        if (item.disabled && typeof item.disabled === 'function') {
          item.disabled = item.disabled(params, clickDomEl, el);
        }
        return item;
      });
    };


    // public methods
    const show = async (x = 0, y = 0) => {
      clickDomEl.value = document.elementFromPoint(x - 1, y - 1) as HTMLElement;
      if (props.menuHiddenFn) {
        showMenu.value = !props.menuHiddenFn(props.params, clickDomEl.value, props.el);
      } else {
        showMenu.value = true;
      }
      if (!showMenu.value) return;
      calcMenuList.value = clone(props.menuList);
      calcMenuList.value = formatterFnOption(calcMenuList.value, clickDomEl.value, props.el, props.params);
      await nextTick();
      const {innerWidth: windowWidth, innerHeight: windowHeight} = window;
      const menu = MenuWrapper.value;
      const menuHeight = menu.offsetHeight;
      const menuWidth = props.menuWidth || 200;
      menuLeft.value = x + menuWidth + 1 > windowWidth ? windowWidth - menuWidth - 5 : x + 1;
      menuTop.value = y + menuHeight + 1 > windowHeight ? windowHeight - menuHeight - 5 : y + 1;
    };
    const close = () => {
      showMenu.value = false;
    };

    // injectCloseListener
    const listenerFn = (e: MouseEvent) => {
      if (MenuWrapper.value && !MenuWrapper.value.contains(e.currentTarget)) {
        showMenu.value = false;
        document.oncontextmenu = null;
      }
    };
    watch(() => props.injectCloseListener, (val) => {
      if (val) {
        document.addEventListener('mousedown', listenerFn);
      } else {
        document.removeEventListener('mousedown', listenerFn);
      }
    }, {
      immediate: true
    });
    onUnmounted(() => {
      document.removeEventListener('mousedown', listenerFn);
    });

    return {
      subLeft,
      subTop,
      hoverFlag,
      menuTop,
      menuLeft,
      showMenu,
      clickDomEl,
      calcMenuList,
      arrowSize,
      hasSubMenu,
      MenuWrapper,
      handleMenuItemClick,
      handleSubMenuItemClick,
      handleMenuMouseEnter,
      show,
      close,
      global_const
    };
  }
});
</script>

<style lang="scss" scoped>

.__menu__wrapper {
  --menu-boxShadow: 0 1px 5px #888;
  --menu-item-iconSize: 20px;
  --menu-item-iconFontSize: 14px;
  --menu-item-iconColor: #484852;
  --menu-item-labelFontSize: 14px;
  --menu-item-tipsColor: #889;
  --menu-item-tipsFontSize: 12px;
  --menu-item-arrowColor: #484852;
  --menu-item-arrowColorHover: #aeaeb9;
  --menu-item-disabledColor: #bcc;
  --menu-lineColor: #ccc;
}

.__menu__wrapper {
  @apply fixed bg-base-100 rounded-md ring-1 ring-secondary w-44 py-1;
  z-index: 99999;
}

.__menu__line,
.__menu__sub__line {
  @apply my-1;
  border-top: 1px solid var(--menu-lineColor);
}

.__menu__item,
.__menu__sub__item {
  @apply flex items-center cursor-pointer px-3 h-7;

  .__menu__item-icon {
    @apply flex items-center content-center w-5 h-5;
    color: var(--menu-item-iconColor);
    //width: var(--menu-item-iconSize);
    //height: var(--menu-item-iconSize);

    i {
      font-size: var(--menu-item-iconFontSize);
    }

    .__menu__item-icon-svg {
      @apply w-full h-full flex items-center content-center text-base-content;
    }
  }

  .__menu__item-label,
  .__menu__sub__item-label {
    @apply w-full max-h-full overflow-ellipsis whitespace-nowrap mr-1 overflow-hidden;
    flex: 1;
    font-size: var(--menu-item-labelFontSize);
  }

  .__menu__item-tips,
  .__menu__sub__item-tips {
    font-size: var(--menu-item-tipsFontSize);
    color: var(--menu-item-tipsColor);
  }

  .__menu__item-arrow {
    width: 10px;
    height: 10px;
    margin-left: 5px;
    position: relative;
  }

  &.disabled {
    cursor: not-allowed;

    .__menu__item-icon,
    .__menu__item-label,
    .__menu__sub__item-label,
    .__menu__item-tips,
    .__menu__sub__item-tips {
      color: var(--menu-item-disabledColor);
    }

    .__menu__item-arrow {
      .__menu__item-arrow-after {
        border-left: var(--menu-item-arrowRealSize) solid var(--menu-item-disabledColor);
      }
    }
  }
}

.__menu__item {
  &:not(.disabled):hover {
    @apply bg-base-200;

    .__menu__item-icon {
      @apply text-inherit;

    }

    .__menu__item-label {
      @apply text-inherit;
    }

    .__menu__item-tips {
      @apply text-inherit;
    }

    .__menu__item-arrow {
      @apply text-inherit;
    }

    .__menu__item-arrow-after {
      border-left: var(--menu-item-arrowRealSize) solid var(--menu-item-arrowColorHover);
    }
  }
}

.__menu__sub__item {
  &:not(.disabled):hover {
    @apply bg-base-200;

    .__menu__sub__item-label {
      @apply text-inherit;
    }

    .__menu__sub__item-tips {
      @apply text-inherit;
    }
  }
}

.__menu__item-icon {
  @apply w-5 h-5 text-center mr-1;
  line-height: 20px;
}

.__menu__item-arrow.show .__menu__item-arrow-after {
  position: absolute;
  width: 0;
  height: 0;
  left: 8px;
  border-left: var(--menu-item-arrowRealSize) solid var(--menu-item-arrowColor);
  border-top: var(--menu-item-arrowRealSize) solid transparent;
  border-bottom: var(--menu-item-arrowRealSize) solid transparent;
}

.__menu__sub__wrapper {
  @apply fixed invisible bg-base-100 rounded-md ring-1 ring-secondary w-44 py-1;
}

.__menu__item:hover .__menu__sub__wrapper {
  @apply visible;
}
</style>
<template>
  <teleport to="body" :disabled="!appendToBody">
    <div
        v-if="showMenu"
        ref="MenuWrapper"
        :class="['__menu__wrapper', customClass]"
        :style="{width: `${menuWidth}px`, top: `${menuTop}px`, left: `${menuLeft}px`}"
    >
      <template v-for="(item,index) in calcMenuList">
        <div
            v-if="!item.hidden && !item.line"
            :key="index"
            :class="['__menu__item', item.disabled && 'disabled', item.customClass]"
            @mousedown.stop="handleMenuItemClick(item, $event)"
            @mouseenter="handleMenuMouseEnter($event,item)"
        >
          <div v-if="hasIcon" class="__menu__item-icon">
            <svg class="__menu__item-icon-svg" viewBox="0 0 24 24">
              <path fill="currentColor" :d="global_const.mdiPath[item.icon]"/>
            </svg>
          </div>
          <span class="__menu__item-label">{{ item.label }}</span>
          <span class="__menu__item-tips">{{ item.tips || '' }}</span>
          <span
              v-if="hasSubMenu"
              class="__menu__item-arrow"
              :class="{show: hasSubMenu && item.children}"
              :style="{width: arrowSize + 'px',height: arrowSize + 'px'}"
          >
            <span v-show="hasSubMenu && item.children" class="__menu__item-arrow-after"></span>
          </span>
          <div
              v-show="hoverFlag"
              v-if="item.children && item.children.length > 0"
              class="__menu__sub__wrapper"
              :style="{top: `${subTop}px`, left: `${subLeft}px`}"
          >
            <template v-for="(subItem,subIndex) in item.children">
              <div
                  v-if="!subItem.hidden && !subItem.line"
                  :key="subIndex"
                  :class="['__menu__sub__item', subItem.disabled && 'disabled', subItem.customClass]"
                  @mousedown.stop="handleSubMenuItemClick(subItem, $event)"
              >
                <span class="__menu__sub__item-label">{{ subItem.label }}</span>
                <span class="__menu__sub__item-tips">{{ subItem.tips || '' }}</span>
              </div>
              <div v-if="subItem.line" :key="subIndex" class="__menu__line"></div>
            </template>
          </div>
        </div>
        <div v-if="!item.hidden && item.line" :key="index" class="__menu__line"></div>
      </template>
    </div>
  </teleport>
</template>

