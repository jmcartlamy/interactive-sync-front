import React from 'react';
import classNames from 'classnames';

import Button from './UI/Button';
import Title from './UI/Title';
import Modal from './Event/Modal';

import withTwitch from '../utils/HOCs/withTwitch';

import './Panel.css';

class Panel extends React.PureComponent {
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

        const props = {
            auth,
            twitch,
            actions,
            userCooldown,
            setCooldownOnAction,
            modal,
        };

        if (userInterface) {
            return (
                <div className="Panel">
                    <div
                        className={classNames('Panel-modal', {
                            'Panel-modal-hidden': !modal.isOpen,
                        })}
                    >
                        <Modal modal={modal} actions={actions} userCooldown={userCooldown} />
                    </div>
                    {userInterface.components &&
                        userInterface.components.map(
                            ({ type, ...properties }) =>
                                Components[type] &&
                                React.createElement(Components[type], {
                                    ...properties,
                                    ...props,
                                    view: 'panel',
                                    direction: 'row',
                                })
                        )}
                </div>
            );
        }

        return (
            <div className="Panel">
                <Title label="¯\_(ツ)_/¯" />
            </div>
        );
    }
}

export default withTwitch(Panel, 'panel');
