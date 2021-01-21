import React from 'react';
import classNames from 'classnames';

import Button from './UI/Button';
import Title from './UI/Title';
import Header from './UI/Header';
import Modal from './Event/Modal';

import withTwitch from '../utils/HOCs/withTwitch';
import renderComponents from '../utils/functions/renderComponents';

import './Mobile.css';

class Mobile extends React.PureComponent {
    render() {
        const {
            auth,
            twitch,
            userInterface,
            actions,
            userCooldown,
            setCooldownOnAction,
            modal,
        } = this.props;

        const Components = {
            title: Title,
            button: Button,
        };

        const global = {
            auth,
            twitch,
            actions,
            userCooldown,
            setCooldownOnAction,
            modal,
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
                        />
                    )}

                    {userInterface.components?.map(
                        renderComponents(Components, global, 'mobile', 'row')
                    )}
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

export default withTwitch(Mobile, 'mobile');
