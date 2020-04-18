import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {
  Form,
  Icon,
  Input,
  Button,
} from 'antd'
import {connect} from 'react-redux'

import './login.less'
import logo from '../../assets/images/logo.png'
import {login} from '../../redux/actions'

const Item = Form.Item 
class Login extends Component {
  handleSubmit = (event) => {    
    event.preventDefault()    
    this.props.form.validateFields(async (err, values) => {     
      if (!err) {      
        const {username, password} = values        
        this.props.login(username, password)
      } else {
        console.log('检验失败!')
      }
    }); 
  }

  validatePwd = (rule, value, callback) => {
    console.log('validatePwd()', rule, value)
    if(!value) {
      callback('密码必须输入')
    } else if (value.length<4) {
      callback('密码长度不能小于4位')
    } else if (value.length>12) {
      callback('密码长度不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      callback() 
    }    
  }
  render () {
    const user = this.props.user
    if(user && user._id) {
      return <Redirect to='/home'/>
    }    
    const form = this.props.form
    const { getFieldDecorator } = form
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-content">
          <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>              
              {
                getFieldDecorator('username', { 
                  
                  rules: [
                    { required: true, whitespace: true, message: '用户名必须输入' },
                    { min: 4, message: '用户名至少4位' },
                    { max: 12, message: '用户名最多12位' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                  ],
                  initialValue: 'admin', 
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />
                )
              }
            </Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.validatePwd
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }

            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登陆
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}
const WrapLogin = Form.create()(Login)
export default connect(
  state => ({user: state.user}),
  {login}
)(WrapLogin)