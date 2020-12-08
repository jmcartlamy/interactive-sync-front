import React from 'react';
import Button from './UI/Button';
import Title from './UI/Title';

import withTwitch from '../utils/HOCs/withTwitch';

import './Panel.css';

class Panel extends React.PureComponent {
    render() {
        const {
            auth,
            twitch,
            setCooldownForUser,
            userInterface,
            actions,
            userIsInCooldown,
        } = this.props;

        const userCooldown = { set: setCooldownForUser, value: userIsInCooldown };
        const Components = {
            title: Title,
            button: Button,
        };

        if (userInterface) {
            return (
                <div className="Panel">
                    {userInterface.components &&
                        userInterface.components.map(({ type, ...properties }) =>
                            React.createElement(Components[type], {
                                ...properties,
                                auth,
                                twitch,
                                actions,
                                userCooldown,
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
