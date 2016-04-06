
import { Component, PropTypes } from 'react';

import Card from 'components/card';
import SubtreeContainer from 'components/subtree-container';

import style from 'sass/components/dialog';


export default class Dialog extends Component {
  static propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
  };

  static defaultProps = {
    visible: false,
    size: 'md',
    className: '',
  };

  render() {
    const { size, onRequestClose, className, children } = this.props;

    return (
      <SubtreeContainer>
        <Card className={`${style.root} ${size} ${className}`}>{children}</Card>
        <div className='overlay' onClick={onRequestClose}/>
      </SubtreeContainer>
    );
  }
}
