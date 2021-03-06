import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';

export default class TextField extends React.PureComponent {
    static propTypes = {
        value: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool
    };

    choosePhoto() {
        if (!window.wp || !window.wp.media) {
            console.error('WP Media is missing. Maybe you forgot to enque it in the plugin config? Or are you outside of WordPress?');
            return;
        }

        const { label, onChange } = this.props;

        const image = window.wp.media({
            title: `Upload a ${label}`,
            multiple: false,
            library: {
                type: 'image'
            }
        })
        .open()
        .on('select', () => {
            const uploaded_image = image.state().get('selection').first();
            const val = uploaded_image.toJSON().url;

            onChange(val);
        })
        .on('close', () => {
            // the media picker uses the same 'modal-open' class as boostrap modals, replace the class when the modal closes
            document.body.classList.add('modal-open');
        });
    }

    render() {
        const { name, value, disabled, onChange } = this.props;

        return (
            <div className="photo-field input-group">
                {
                value && value !== ''
                ?   <span className="input-group-btn">
                        <img src={value} alt="Preview" className="photo-picker-thumb" />
                    </span>
                :   null
                }
                <input
                    disabled={disabled}
                    type="text"
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="form-control"
                />
                <span className="input-group-btn">
                    <Button color="primary" className="btn-sm" disabled={disabled} onClick={() => this.choosePhoto()}>Upload</Button>
                </span>
            </div>
        );
    }
}