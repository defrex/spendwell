
import _ from 'lodash';
import { Component, PropTypes } from 'react';
import Relay from 'react-relay';

import { handleMutationError } from 'utils/network-layer';
import TextInput from 'components/text-input';
import Button from 'components/button';
import Dialog from 'components/dialog';
import DialogActions from 'components/dialog-actions';

import track from 'utils/track';
import { ConnectFinicityInstitutionMutation } from 'mutations/finicity';

import style from 'sass/components/finicity-account-dialog';


class FinicityAccountDialog extends Component {
  static propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    onConnected: PropTypes.func.isRequired,
    onConnecting: PropTypes.func,
    sync: PropTypes.bool,
  };

  static defaultProps = {
    sync: false,
  };

  state = {
    credentials: {},
    mfaAnswers: [],
    mfaExpired: false,
    loading: false,
  };

  setCredentialValue(name, id, value) {
    const { credentials } = this.state;
    this.setState({
      credentials: Object.assign({}, credentials, { [id]: { value, name } }),
    });
  }

  setMfaValue(challenge, index, value, event) {
    if (event) event.preventDefault();

    const { mfaAnswers } = this.state;
    mfaAnswers[index] = value;
    this.setState({ mfaAnswers });
  }

  handleSubmit(event) {
    if (event) event.preventDefault();

    const { viewer, institutionTemplate, onConnected, onConnecting, sync } = this.props;
    const { credentials, mfaAnswers } = this.state;

    if (onConnecting)
      onConnecting();

    this.setState({ loading: true });
    Relay.Store.commitUpdate(new ConnectFinicityInstitutionMutation({
      viewer,
      institutionTemplate,
      credentials,
      mfaAnswers,
      sync,
    }), {
      onFailure: (transaction)=> {
        console.log('Failure: ConnectFinicityInstitutionMutation');

        this.setState({ loading: false });

        const errors = transaction.getError().source.errors;
        const error = (testMessage)=> errors.find(({ message })=> message.indexOf(testMessage) === 0);

        const mfaError = error('finicity-mfa-required');
        const mfaExpired = error('finicity-mfa-expired');
        const invalidCredentials = error('finicity-invalid-credentials');
        const userActionRequired = error('finicity-user-action-required');

        if (mfaError) {
          this.setState({
            mfaChallenges: JSON.parse(mfaError.message.split(':').slice(1).join(':')),
            invalidCredentials: !!invalidCredentials,
            userActionRequired: !!userActionRequired,
            mfaExpired: false,
          });

        } else if (mfaExpired) {
          this.setState({
            mfaChallenges: null,
            invalidCredentials: !!invalidCredentials,
            userActionRequired: !!userActionRequired,
            mfaExpired: true,
          });

        } else {
          this.setState({
            invalidCredentials: !!invalidCredentials,
            userActionRequired: !!userActionRequired,
            mfaExpired: false,
          });

          track('connect-error', {
            provider: 'finicity',
            institution: institutionTemplate.name,
          });

          if (!invalidCredentials && !userActionRequired)
            handleMutationError(transaction);
        }
      },
      onSuccess: ()=> {
        console.log('Success: ConnectFinicityInstitutionMutation');

        this.setState({
          loading: false,
          invalidCredentials: false,
          userActionRequired: false,
        });

        track('connect-success', {
          provider: 'finicity',
          institution: institutionTemplate.name,
        });

        onConnected();
      },
    });
  }

  render() {
    const { institutionTemplate, onRequestClose } = this.props;
    const {
      loading,
      mfaChallenges,
      credentials,
      mfaAnswers,
      mfaExpired,
      invalidCredentials,
      userActionRequired,
    } = this.state;

    const formFields = _.sortBy(institutionTemplate.loginForm, 'displayOrder');

    return (
      <Dialog size='sm' onRequestClose={onRequestClose} className={style.root}>
        <form onSubmit={::this.handleSubmit}>
          <div className='body'>
            <h3>Connect {institutionTemplate.name}</h3>

            {invalidCredentials ?
              <span className='form-error'>
                We're having trouble connecting to your account with this
                login information.
              </span>
            : userActionRequired ?
              <span className='form-error'>
                You need to login to your bank and complete an action to continue.
              </span>
            : mfaExpired ?
              <span className='form-error'>
                Your login session has expired. Please try again.
              </span>
            : null}

            {mfaChallenges ? mfaChallenges.map((challenge, index)=>
              <div className='form-field' key={index}>
                {challenge.image ?
                  <div className='mfa-question'><img src={challenge.image} alt={challenge.text}/></div>
                : null}

                {(challenge.choice || challenge.imageChoice) && challenge.text ?
                  <div className='mfa-question'><strong>{challenge.text}</strong></div>
                : null}

                {challenge.choice ?
                  <ul className='mfa-choices'>
                    {challenge.choice.map((choice)=>
                      <li key={choice['@value']}>
                        {mfaAnswers[index] === choice['@value'] ?
                          <i className='fa fa-dot-circle-o'/>
                        :
                          <i className='fa fa-circle-o'/>
                        }
                        <a href='#' onClick={this.setMfaValue.bind(this, challenge, index, choice['@value'])}>
                          {choice['#text']}
                        </a>
                      </li>
                    )}
                  </ul>
                : challenge.imageChoice ?
                  <ul className='mfa-choices'>
                    {challenge.imageChoice.map((choice)=>
                      <li key={choice['@value']}>
                        {mfaAnswers[index] === choice['@value'] ?
                          <i className='fa fa-dot-circle-o'/>
                        :
                          <i className='fa fa-circle-o'/>
                        }
                        <a href='#' onClick={this.setMfaValue.bind(this, challenge, index, choice['@value'])}>
                          <img src={choice['#text']} alt={choice['@value']}/>
                        </a>
                      </li>
                    )}
                  </ul>
                :
                  <TextInput
                    label={challenge.text ? challenge.text : 'Answer'}
                    onChange={this.setMfaValue.bind(this, challenge, index)}
                    value={mfaAnswers[index] || ''}
                  />
                }
              </div>
            ) : formFields.map((field)=>
              <div className='form-field' key={field.name}>
                <TextInput
                  label={field.description}
                  onChange={this.setCredentialValue.bind(this, field.name, field.id)}
                  type={field.mask ? 'password' : 'text'}
                  value={credentials[field.id] ? credentials[field.id].value : ''}
                />
              </div>
            )}
          </div>

          <DialogActions>
            <Button onClick={onRequestClose}>Cancel</Button>
            <Button type='submit' loading={loading}>Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}


FinicityAccountDialog = Relay.createContainer(FinicityAccountDialog, {
  fragments: {
    viewer: ()=> Relay.QL`
      fragment on Viewer {
        ${ConnectFinicityInstitutionMutation.getFragment('viewer')}
      }
    `,
    institutionTemplate: ()=> Relay.QL`
      fragment on InstitutionTemplateNode {
        ${ConnectFinicityInstitutionMutation.getFragment('institutionTemplate')}

        id
        finicityId
        name

        loginForm {
          id
          name
          description
          displayOrder
          mask
        }
      }
    `,
  },
});

export default FinicityAccountDialog;
