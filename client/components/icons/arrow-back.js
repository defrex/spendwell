
import Icon from 'components/icon';


export default class ArrowBackIcon extends Icon {
  type = 'arrow-back';

  renderInternal() {
    return (
      <g><path d='M20 11h-12.17l5.59-5.59-1.42-1.41-8 8 8 8 1.41-1.41-5.58-5.59h12.17v-2z'></path></g>
    );
  }
}
