//选择上传头像
import React, {Component}from 'react'
import {Row,Col,Button,message,Upload,Icon} from 'antd';
const Dragger = Upload.Dragger;



export default class SelectUploadPic extends Component {
    constructor(props){
        super(props);
        this.state={
            fileName:''
        };
        this.click=this.click.bind(this)
    }
    componentDidMount() {
        require.ensure([],function(){
            require('../../assets/scss/commonComp.scss');
        },"commonComp");
        console.log('componentDidMount')
    }
    click(){
        alert('click')
    }
    render() {
        const {fileName}=this.state;
        const _this=this;
        return <div id="updateUserImg">
            <Button type="primary">click</Button>
            <div className="userImg">
                <img src={"/static/img/"+(fileName?fileName:'164855f64f96ed42bd285b0592d538e0.jpg')} width="250" height="250"/>
            </div>
            <Dragger {...{
                name: 'file',
                multiple: false,
                action: '/api/uploadUserImg',
                data:(file)=>{return {userId:1}},
                onChange(info) {
                    const status = info.file.status;
                    if (status !== 'uploading') {
                        console.log(info.file, info.fileList);
                    }
                    if (status === 'done') {
                        if(info.file.response&&info.file.response.isException){
                            message.success(`${info.file.name} file uploaded successfully.`);
                            _this.setState({fileName:info.file.name});
                        }
                    } else if (status === 'error') {
                        message.error(`${info.file.name} file upload failed.`);
                    }
                },
            }}>
                <Icon type="inbox" /><br /><span>Click Or Drag Picture Here To Upload</span>
            </Dragger>
        </div>
    }
}
