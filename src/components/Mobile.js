import React from 'react';
import Button from './UI/Button';
import Title from './UI/Title';
import Header from './UI/Header';

import withTwitch from '../utils/HOCs/withTwitch';
import './Mobile.css';

class Mobile extends React.PureComponent {
    render() {
        const {
            auth,
            twitch,
            userInterface,
            actions,
            setCooldownForUser,
            userIsInCooldown,
            setCooldownOnAction,
        } = this.props;

        const userCooldown = { set: setCooldownForUser, value: userIsInCooldown };
        const Components = {
            title: Title,
            button: Button,
        };

        if (userInterface) {
            return (
                <div className="Mobile">
                    {userInterface.title && <Header className label={userInterface.title} />}

                    {userInterface.components &&
                        userInterface.components.map(({ type, ...properties }) =>
                            React.createElement(Components[type], {
                                ...properties,
                                auth,
                                twitch,
                                actions,
                                userCooldown,
                                setCooldownOnAction,
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
