/* @flow */
import React from 'react';

import { connect } from 'react-redux';

import { signIn } from '../actions/auth';
import { validateEmail, isEmpty } from '../helpers/validation';

import Input from '../components/Input';
import { SecondaryButton } from '../components/Button';
import Container from '../components/Container';
import GoBack from '../components/GoBackButton';

import type { Error, User } from '../types/types';

type Props = {
  ValidationProps: ValidationProps,
  onClearError: () => void,
  error: Error,
};

type ValidationProps = {
  errorType: string,
  errorMessage: string,
  validateFunction: Function,
  data: string,
};

type State = {
  email: string,
  password: string,
  emailError: string,
  passwordError: string,
};

class SignIn extends React.Component<void, Props, State> {
  static navigationOptions = ({ navigation }) => ({
    title: 'Sign In',
    headerLeft: (
      <GoBack
        onPress={() => {
          navigation.navigate('Main');
        }}
      />
    ),
  });


  state = {
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    focusInput: false,
  };

  _validation = ({
    errorType,
    errorMessage,
    validateFunction,
    data,
  }: ValidationProps) => {
    if (validateFunction(data)) {
      this.setState({
        [errorType]: '',
      });
      return true;
    }
    this.setState({
      [errorType]: errorMessage,
    });
    return false;
  };

  _validateData = () => {
    const isValidEmail = this._validation({
      errorType: 'emailError',
      errorMessage: 'Wrong type of email',
      validateFunction: validateEmail,
      data: this.state.email,
    });
    const isValidPassword = this._validation({
      errorType: 'passwordError',
      errorMessage: 'This field cannot be empty',
      validateFunction: isEmpty,
      data: this.state.password,
    });
    return isValidEmail && isValidPassword;
  };

  _signIn = () => {
    const signInData = {
      email: this.state.email,
      password: this.state.password,
    };

    if (this._validateData()) {
      this.props.onSignIn(signInData);
    }
  };

  componentWillUnmount() {
    this.props.onClearError();
  }

  render() {
    return (
      <Container justify="center" title="Sign In">
        <Input
          name="text"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email.toLowerCase()}
          error={this.state.emailError || this.props.error}          
        />
        <Input
          name="password"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          error={this.state.passwordError || this.props.error}
          secureTextEntry          
        />
        <SecondaryButton title="login" onPress={this._signIn} />
      </Container>
    );
  }
}

export default connect(
  state => ({ error: state.error.signInError }),
  dispatch => ({
    onSignIn: data => {
      dispatch(signIn(data));
    },
    onClearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    },
  }),
)(SignIn);
