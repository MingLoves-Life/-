import React, {PureComponent} from 'react'
import {
  Card,
  Icon,
  Form,
  Input,
  Cascader,
  Button,
  message
} from 'antd'

import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api'
import memoryUtils from "../../utils/memoryUtils";

const {Item} = Form
const { TextArea } = Input

class ProductAddUpdate extends PureComponent {

  state = {
    options: [],
  }

  constructor (props) {
    super(props)    
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  initOptions = async (categorys) => {    
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false, 
    }))    
    const {isUpdate, product} = this
    const {pCategoryId} = product
    if(isUpdate && pCategoryId!=='0') {      
      const subCategorys = await this.getCategorys(pCategoryId)      
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))      
      const targetOption = options.find(option => option.value===pCategoryId)      
      targetOption.children = childOptions
    }    
    this.setState({
      options
    })
  }
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)   
    if (result.status===0) {
      const categorys = result.data      
      if (parentId==='0') {
        this.initOptions(categorys)
      } else { 
        return categorys  
      }
    }
  }

  validatePrice = (rule, value, callback) => {
    console.log(value, typeof value)
    if (value*1 > 0) {
      callback() 
    } else {
      callback('价格必须大于0') 
    }
  }
  loadData = async selectedOptions => {    
    const targetOption = selectedOptions[0]    
    targetOption.loading = true    
    const subCategorys = await this.getCategorys(targetOption.value)    
    targetOption.loading = false    
    if (subCategorys && subCategorys.length>0) {      
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))      
      targetOption.children = childOptions
    } else { 
      targetOption.isLeaf = true
    }    
    this.setState({
      options: [...this.state.options],
    })
  }

  submit = () => {    
    this.props.form.validateFields(async (error, values) => {
      if (!error) {        
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length===1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}        
        if(this.isUpdate) {
          product._id = this.product._id
        }        
        const result = await reqAddOrUpdateProduct(product)        
        if (result.status===0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
        }
      }
    })
  }

  componentDidMount () {
    this.getCategorys('0')
  }

  componentWillMount () {    
    const product = memoryUtils.product      
    this.isUpdate = !!product._id    
    this.product = product || {}
  }

  componentWillUnmount () {
    memoryUtils.product = {}
  }

  render() {
    const {isUpdate, product} = this
    const {pCategoryId, categoryId, imgs, detail} = product    
    const categoryIds = []
    if(isUpdate) {      
      if(pCategoryId==='0') {
        categoryIds.push(categoryId)
      } else {        
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }    
    const formItemLayout = {
      labelCol: { span: 2 },  
      wrapperCol: { span: 8 }, 
    }    
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize: 20}}/>
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )

    const {getFieldDecorator} = this.props.form

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [
                  {required: true, message: '必须输入商品名称'}
                ]
              })(<Input placeholder='请输入商品名称'/>)
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [
                  {required: true, message: '必须输入商品描述'}
                ]
              })(<TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }} />)
            }

          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  {required: true, message: '必须输入商品价格'},
                  {validator: this.validatePrice}
                ]
              })(<Input type='number' placeholder='请输入商品价格' addonAfter='元'/>)
            }
          </Item>
          <Item label="商品分类">
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
                rules: [
                  {required: true, message: '必须指定商品分类'},
                ]
              })(
                <Cascader
                  placeholder='请指定商品分类'
                  options={this.state.options}  
                  loadData={this.loadData} 
                />
              )
            }
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs}/>
          </Item>
          <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
            <RichTextEditor ref={this.editor} detail={detail}/>
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)
