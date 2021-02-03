import React from 'react';
import classNames from 'classnames';

import Button from '../UI/Button';
import Title from '../UI/Title';
import Header from '../UI/Header';
import Image from '../UI/Image';
import Text from '../UI/Text';
import Modal from '../Event/Modal';

import withUserInterface from '../../utils/HOCs/withUserInterface';
import renderComponents from '../../utils/functions/renderComponents';

import './Mobile.css';

class Mobile extends React.PureComponent {
    render() {
        const {
            auth,
            twitch,
            userInterface,
            configUI,
            actions,
            userCooldown,
            setCooldownOnAction,
            modal,
        } = this.props;

        const Components = {
            title: Title,
            button: Button,
            image: Image,
            text: Text,
        };

        const global = {
            auth,
            twitch,
            actions,
            userCooldown,
            setCooldownOnAction,
            modal,
            configUI,
        };

        if (userInterface) {
            return (
                <div className="Mobile" style={userInterface.style}>
                    <div
                        className={classNames('Mobile-modal', {
                            'Mobile-modal-hidden': !modal.isOpen,
                        })}
                    >
                        <Modal global={global} />
                    </div>
                    {userInterface.title?.label && (
                        <Header
                            label={userInterface.title.label}
                            style={userInterface.title.style}
                            transparent={configUI.transparent}
                        />
                    )}
                    <div className={classNames({ 'Mobile-top-layer': !modal.isOpen })}>
                        {userInterface.components?.map(
                            renderComponents(Components, global, 'mobile', 'row')
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="Mobile">
                <Title props={{ label: '¯\\_(ツ)_/¯' }} />
            </div>
        );
    }
}

export default withUserInterface(Mobile);
