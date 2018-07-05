import * as React from 'react';
import * as firebase from 'firebase';
import {Redirect} from 'react-router';
import {Row, Col, Form, Input, Icon, Button, Alert, notification} from 'antd';
import GithubCorner from 'react-github-corner';
import {LoginContainer, LogoContainer, FooterContainer, BodyWrapper} from '../components/app'
import firebaseConfig from '../config-firebase';

const FormItem = Form.Item;

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

class CMSApp extends React.Component {
  state = {
    redirectToReferrer: false
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        firebase.auth().signInWithEmailAndPassword(values.email, values.password)
          .then((result) => {
            this.setState({redirectToReferrer: true})
          })
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            notification.error({
              message: errorCode,
              description: errorMessage
            })
          });
      }
    });
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={"/dashboard"} />;
    }

    return (
      <BodyWrapper>
        <GithubCorner href="https://github.com/canner/canner-firebase-cms" />
        <Row type="flex" justify="space-around" align="middle" style={{height: '100%'}}>
          <Col span={12}>
            <LogoContainer>
              <img src="/static/logo-word-white.png" alt="logo"/>
            </LogoContainer>
            <LoginContainer>
              <Form onSubmit={this.handleSubmit}>
                <FormItem>
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please input your Email!' }],
                  })(
                    <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your password!' }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                  )}
                </FormItem>
                <FormItem>
                  <Button type="primary" htmlType="submit" style={{width: "100%"}}>
                    Log in
                  </Button>
                </FormItem>
              </Form>
            </LoginContainer>
            <FooterContainer>
              Powered by <a href="https://www.canner.io/" target="_blank" rel="noopener noreferrer">CannerIO</a>. License under Apache License 2.0
            </FooterContainer>
            {
              // DELETE HERE !!!!!!! This section is some information for demo.
            }
            <Alert
              style={{marginTop: '20px'}}
              message="Demo version"
              description={
                <div>
                  Username: <b>admin-test@canner.io</b><br/>
                  Password: <b>admin-test</b>
                </div>
              }
              type="info"
              showIcon
            />
          </Col>
        </Row>
      </BodyWrapper>
    );
  }
}

export default Form.create()(CMSApp);
