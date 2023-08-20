import EventBus from '@/eventBus';

export default function gotoPage(pageName, pageParams) {
  EventBus.$emit('gotoPage', pageName, pageParams);
}
