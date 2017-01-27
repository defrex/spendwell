
import { Component, PropTypes } from 'react'
import Relay from 'react-relay'

import A from 'components/a'
import Icon from 'components/icon'
import style from 'sass/components/nav'

import { handleMutationError } from 'utils/network-layer'
import { AutodetectBillsMutation, AssignTransactionsMutation } from 'mutations/buckets'
import eventEmitter from 'utils/event-emitter'

import logoGreen from 'img/logo-green.svg'
import logoWhite from 'img/logo-white.svg'

const isActive = (path) => document.location.pathname.indexOf(path) === 0

class Nav extends Component {
  static propTypes = {
    viewer: PropTypes.object,
    open: PropTypes.bool.isRequired,
    toggleNav: PropTypes.func.isRequired,
  };

  render () {
    const { viewer, toggleNav, open } = this.props

    return (
      <div className={`${style.root} ${open ? 'open' : ''}`}>

        <div className='account-info'>
          <img src={logoWhite} alt='Spendwell' className='logo'/>
          <div className='account-email'>{viewer.email}</div>
        </div>

        <div className='logo-green'>
          <img src={logoGreen} alt='Spendwell'/>
        </div>

        <ul className='list-unstyled'>
          <li className={isActive('/app/dashboard') ? 'active' : ''}>
            <A onClick={toggleNav} href='/app/dashboard'>
              <Icon type='network check'/>
              <div className='label'>Dashboard</div>
            </A>
          </li>
          <li className={isActive('/app/transactions') ? 'active' : ''}>
            <A onClick={toggleNav} href='/app/transactions'>
              <Icon type='view list'/>
              <div className='label'>Transactions</div>
            </A>
          </li>
          <li className={isActive('/app/accounts') ? 'active' : ''}>
            <A onClick={toggleNav} href='/app/accounts'>
              <Icon type='account balance'/>
              <div className='label'>Accounts</div>
            </A>
          </li>
          <li>
            <a href='/logout?next=/login'>
              <Icon type='power settings new'/>
              <div className='label'>Logout</div>
            </a>
          </li>
          <li className='divider'/>
          <li>
            <A onClick={() => {
              Relay.Store.commitUpdate(new AutodetectBillsMutation({ viewer }), {
                onFailure: handleMutationError,
                onSuccess: () => eventEmitter.emit('forceFetch'),
              })
            }}>
              <Icon type='find replace'/>
              <div className='label'>Autodetect Bills</div>
            </A>
          </li>
          <li>
            <A onClick={() => {
              Relay.Store.commitUpdate(new AssignTransactionsMutation({ viewer }), {
                onFailure: handleMutationError,
                onSuccess: () => eventEmitter.emit('forceFetch'),
              })
            }}>
              <Icon type='move to inbox'/>
              <div className='label'>Assign Transactions</div>
            </A>
          </li>
        </ul>
      </div>
    )
  }
}

Nav = Relay.createContainer(Nav, {
  fragments: {
    viewer () {
      return Relay.QL`
        fragment on Viewer {
          ${AutodetectBillsMutation.getFragment('viewer')}
          ${AssignTransactionsMutation.getFragment('viewer')}

          email
          isAdmin
        }
      `
    },
  },
})

export default Nav
