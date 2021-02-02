import React from 'react';
import classNames from 'classnames';

import Button from '../UI/Button';
import Title from '../UI/Title';
import Modal from '../Event/Modal';

import withUserInterface from '../../utils/HOCs/withUserInterface';
import renderComponents from '../../utils/functions/renderComponents';

import './Panel.css';

class Panel extends React.PureComponent {
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
                <div className="Panel" style={userInterface.style}>
                    <div
                        className={classNames('Panel-modal', {
                            'Panel-modal-hidden': !modal.isOpen,
                        })}
                    >
                        <Modal global={global} />
                    </div>
                    <div className={classNames({ 'Panel-top-layer': !modal.isOpen })}>
                        {userInterface.components?.map(
                            renderComponents(Components, global, 'panel', 'row')
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="Panel">
                <Title props={{ label: '¯\\_(ツ)_/¯' }} />
            </div>
        );
    }
}

export default withUserInterface(Panel);