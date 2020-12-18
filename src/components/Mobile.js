import React from 'react';
import classNames from 'classnames';

import Button from './UI/Button';
import Title from './UI/Title';
import Header from './UI/Header';
import Modal from './Event/Modal';

import withTwitch from '../utils/HOCs/withTwitch';
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
            action,
            modal,
        } = this.props;

        const Components = {
            title: Title,
            button: Button,
        };

        const props = {
            auth,
            twitch,
            actions,
            userCooldown,
            setCooldownOnAction,
            action,
            modal,
        };

        if (userInterface) {
            return (
                <div className="Mobile">
                    <div
                        className={classNames('Mobile-modal', {
                            'Mobile-modal-hidden': !modal.isOpen,
                        })}
                    >
                        <Modal modal={modal} action={action} userCooldown={userCooldown} />
                    </div>
                    {userInterface.title && <Header className label={userInterface.title} />}

                    {userInterface.components &&
                        userInterface.components.map(({ type, ...properties }) =>
                            React.createElement(Components[type], {
                                ...properties,
                                ...props,
                                view: 'mobile',
                                direction: 'row',
                            })
                        )}
                </div>
            );
        }

        return (
            <div className="Mobile">
                <Title label="¯\_(ツ)_/¯" />
            </div>
        );
    }
}

export default withTwitch(Mobile, 'mobile');
