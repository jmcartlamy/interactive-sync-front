import React from 'react';
import Button from './UI/Button';
import Title from './UI/Title';

import withAuth from '../utils/HOCs/withAuth';
import getUserInterface from '../api/getUserInterface';
import getAllActions from '../api/getAllActions';


class Mobile extends React.Component {
    constructor(props) {
        super(props);

        this.setCooldownForUser = this.setCooldownForUser.bind(this);

        this.state = {
            userInterface: null,
            actions: null,
            userIsInCooldown: false,
        };
    }

    async componentDidMount() {
        const { auth, twitch } = this.props;

        if (twitch) {
            const userInterface = await getUserInterface(auth, twitch);
            if (userInterface && userInterface.panel) {
                this.setState({
                    userInterface: userInterface.panel,
                });
            }

            const actions = await getAllActions(auth, twitch);
            this.setState({
                actions,
            });

            twitch.listen('broadcast', (target, contentType, body) => {
                const parseData = JSON.parse(body);
                if (parseData.type === 'action') {
                    const { actionId, actionCooldown } = parseData.data;
                    this.setState({
                        actions: {
                            ...this.state.actions,
                            [actionId]: Date.now() + actionCooldown,
                        },
                    });
                } else if (parseData.type === 'user_interface') {
                    twitch.rig.log('Received broadcast user_interface', parseData.data);
                    this.setState({
                        userInterface: parseData.data.panel,
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.props.twitch) {
            this.props.twitch.unlisten('broadcast', () =>
                twitch.rig.log('Successfully unlistened')
            );
        }
    }

    setCooldownForUser(value, time) {
        this.setState({
            userIsInCooldown: value,
        });

        if (time) {
            const timeout = setTimeout(() => {
                this.setState({
                    userIsInCooldown: !value,
                });
                clearTimeout(timeout);
            }, 3000);
        }
    }

    render() {
        const { userInterface, actions, userIsInCooldown } = this.state;
        const { auth, twitch } = this.props;
        const userCooldown = { set: this.setCooldownForUser, value: userIsInCooldown };

        const Components = {
            title: Title,
            button: Button,
        };

        if (userInterface) {
            return (
                <div className="Panel">
                    {userInterface.components &&
                        userInterface.components.map(({ type, ...props }) =>
                            React.createElement(Components[type], {
                                ...props,
                                auth,
                                twitch,
                                actions,
                                userCooldown,
                                direction: 'row'
                            })
                        )}
                </div>
            );
        }

        return <Title label="¯\_(ツ)_/¯" />;
    }
}

export default withAuth(Mobile);
