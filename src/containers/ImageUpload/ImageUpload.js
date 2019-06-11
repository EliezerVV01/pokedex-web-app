import React, { Component } from 'react'
import Button from '../../components/Button/Button';
import './ImageUpload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            imagePreviewUrl: this.props.src,
        };
        this._handleImageChange = this._handleImageChange.bind(this);
    }


    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        if (file.size< 5 * 1024 * 1024 &&
            (file.type === 'image/jpeg' || file.type === 'image/png' 
            || file.type === 'image/jpp')) {
            reader.onloadend = () => {
                this.setState({
                    file: file,
                    imagePreviewUrl: reader.result
                });
            }
    
            reader.readAsDataURL(file);
        } else {
            this.props.setError("That type of file doesn't satisfy the requirements!");
        }

    }

    render() {
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img alt="profilePic" style={this.props.style} src={imagePreviewUrl} />);
        }

        return (
            <div>
                {$imagePreview}
                <div style={{ margin: '20px' }}>
                    <Button style={{ borderRadius: '50%' }} className="btn btn-success picButtons" clicked={() => this.props.uploadPicture(this.state.file)}>
                        <FontAwesomeIcon icon="save"></FontAwesomeIcon>
                    </Button>
                    <input type="file" name="file" id="file"
                        onChange={this._handleImageChange}
                        className="upload" />
                    <label className="btn btn-dark picButtons" htmlFor="file">
                        <FontAwesomeIcon icon="camera-retro"></FontAwesomeIcon>
                    </label>
                    <Button style={{ borderRadius: '50%' }} className="btn btn-danger picButtons" clicked={this.props.cancel}>
                        <FontAwesomeIcon icon="times"></FontAwesomeIcon>
                    </Button>
                </div>
            </div>
        )
    }

}

export default ImageUpload;