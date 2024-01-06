import { defineComponent, computed} from 'vue';
import {createNamespace, makeArrayProp} from '@/utils';
import Popover from '../popover';
import {OAvatar} from '@/components';

const [name, bem] = createNamespace('surplus');

const props = {
  surplusList: makeArrayProp([])
};

export default defineComponent({
  name,
  props,
  emits: ['menuClick'],
  setup(props, {emit, attrs, slots}) {
    const renderSurplusMember = (length) => {
      return (
        <div class={bem('surplus-num')}>
          <p>+{length}</p>
        </div>
      );
    };
    const surplusMembers = computed(() => props.surplusList.slice(5, props.surplusList.length));

    const skipMember = (member) => {
      emit('menuClick', member);
    };

    return () => {
      return (
        <Popover
          placement='top'
          theme='light'
          trigger='click'
          v-slots={{
            reference: () => renderSurplusMember(surplusMembers.value.length)
          }}
        >
          <div class={bem('showBox')}>
            {surplusMembers.value.map((item) => {
              const sign = item.online ? 'online' : '';
              return (
                <div class={bem('surplus-item')} onclick={() => skipMember(item)}>
                  <div
                    class={'owner'}
                  >
                    <div class={sign} />
                  </div>
                  <OAvatar
                    src={item.avatar}
                    name={item.nickname}
                    email={item.email}
                  />
                  <p v-tooltip={item.nickname}>{item.nickname}</p>
                </div>
              );
            })
            }
          </div>
        </Popover>

      );
    };
  }
});
