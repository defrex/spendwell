
import { PropTypes, Component } from 'react'
import Relay from 'react-relay'
import { browserHistory } from 'react-router'

import Icon from 'components/icon'

import style from 'sass/components/header'

class Header extends Component {
  static propTypes = {
    viewer: PropTypes.object,
    title: PropTypes.string,
    toggleNav: PropTypes.func,
    plain: PropTypes.bool,
    back: PropTypes.bool,
    chatlioOpen: PropTypes.bool,
  };

  static defaultProps = {
    title: '',
    plain: false,
    back: false,
  };

  handleHandleClick (event) {
    event.preventDefault()
    if (this.props.toggleNav) {
      this.props.toggleNav()
    }
  }

  handleBackClick (event) {
    event.preventDefault()
    browserHistory.goBack()
  }

  render () {
    const { back, plain, title } = this.props

    return (
      <nav className={`mui-appbar ${style.root}`}>
        {!plain ?
          <div className='nav-handle'>
            {back ? (
              <a href='#' onClick={::this.handleBackClick}>
                <Icon type='arrow back' color='light'/>
              </a>
            ) : (
              <a href='#' onClick={::this.handleHandleClick}>
                <Icon type='menu' color='light'/>
              </a>
            )}
          </div>
        : null}

        <div className='title'>{title}</div>
      </nav>
    )
  }
}

Header = Relay.createContainer(Header, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        dummy
      }
    `,
  },
})

export default Header
