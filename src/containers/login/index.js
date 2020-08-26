import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Row, Col } from 'antd';
import { useLocation, useHistory } from 'react-router-dom';

import styles from './Login.module.css';
import '../../assets/fonts/fonts.css'
import AuthenticationService from '../../utils/AuthenticateService';
import { LoginForm, ImageForm, LoadingIndicator } from '../../components';
import { emailVerification, emptyStringVerification } from '../../utils';
import { ErrorComponent } from '../../components'

const Login = () => {
    const location = useLocation();
    const history = useHistory();

    const [isLoading, updateLoading] = useState(false);
    const [error, updateError] = useState({});
    const [email, updateEmail] = useState('');
    const [password, updatePassword] = useState('');

    const authenticate = async () => {
        const data = {
            email,
            password,
        };
        updateLoading(true);
        const response = await AuthenticationService.authenticate(data);
        if (!response.isError) {
            const { from } = location.state || { from: { pathname: "/adminHome" } };
            history.replace(from);
        } else {
            updateErrorState(true);
            updateError(response);
        }
        updateLoading(false);
    }

    const enableLoginButton = () => {
        return emailVerification(email) && emptyStringVerification(password) && !isLoading;
    }

    const renderData = () => {
        return (
            <div className={styles.login}>
                <Row style={{ height: '100%' }} gutter={16}>
                    <Col span={12}>
                        <LoginForm
                            signInAction={authenticate}
                            emailValue={email}
                            passwordValue={password}
                            emailOnChange={e => { updateEmail(e.target.value) }}
                            passwodOnChange={e => { updatePassword(e.target.value) }}
                            emailVerification={emailVerification}
                            passwordVerification={emptyStringVerification}
                            enableLoginButton={enableLoginButton()}
                        />
                    </Col>
                    <Col span={12}>
                        <ImageForm
                            text1="Nec ei solet dicam"
                            text2="Growinn allows you to lorem ipsum dolor sit amet, ludus virtute id sea, ut nam atqui nobis animal. Sea te altera consequuntur."
                        />
                    </Col>
                </Row>
            </div>
        )
    }

    const [errorState, updateErrorState] = useState(false);

    const renderError = () => {
        if (error.isError) {
            return (
                <ErrorComponent
                    description={error.data.errors.message}
                    open={errorState}
                    handleClose={() => {updateErrorState(false)}}
                />
            );
        }
        return null;
    }

    return (
        <div>
            <div className={styles.container}>
                {isLoading && <LoadingIndicator />}
                {renderData()}
            </div>
            {renderError()}
        </div>
    );
}

export default Login;

