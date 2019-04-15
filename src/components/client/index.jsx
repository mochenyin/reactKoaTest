import React,{Component} from 'react';
import SelectUploadPic from '../commonComp/selectUploadPic.jsx'
export default class ClientIndex extends Component{
    render(){
        return (
           <div>
               <h1>Client Page</h1>
               <SelectUploadPic />
           </div>
        )
    }
}