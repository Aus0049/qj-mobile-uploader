/**
 * Created by Aus on 2017/12/27.
 */
import React from 'react';
import Uploader from '../../src/Uploader';
import '../../style/uploader.scss'
import 'font-awesome/css/font-awesome.css'

class UploaderPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    render () {
        return (
            <div className="page uploader">
                <Uploader
                    uploadUrl={'https://jsonplaceholder.typicode.com/posts/'}
                    max={9}
                />
            </div>
        )
    }
}

export default UploaderPage