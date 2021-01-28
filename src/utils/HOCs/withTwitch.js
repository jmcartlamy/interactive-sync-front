import React from 'react';

import getUserInterface from '../../api/getUserInterface';
import getAllActions from '../../api/getAllActions';
import Title from '../../components/UI/Title';

function withTwitch(WrappedComponent, view) {
    class withTwitch extends React.Component {
        constructor(props) {
            super(props);

            this.setCooldownForUser = this.setCooldownForUser.bind(this);
            this.setCooldownOnAction = this.setCooldownOnAction.bind(this);

            this.state = {
                userInterface: null,
                configUI: {},
                actions: null,
                loading: false,
                userIsInCooldown: false,
            };
        }

        async componentDidMount() {
            const { auth, twitch } = this.props;

            if (twitch) {
                this.setState({ loading: true });
                const userInterface = await getUserInterface(auth, twitch);
                if (userInterface) {
                    this.setState({
                        userInterface: userInterface[view] || null,
                        configUI: userInterface.config || {},
                    });
                }

                const actions = await getAllActions(auth, twitch);
                this.setState({
                    actions,
                    loading: false,
                });

                twitch.listen('broadcast', (target, contentType, body) => {
                    const parseData = JSON.parse(body);
                    if (parseData.type === 'input') {
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
                            userInterface: (parseData.data && parseData.data[view]) || null,
                            configUI: parseData.data?.config || {},
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

        setCooldownForUser(boolean, cooldown) {
            this.setState({
                userIsInCooldown: boolean,
            });

            if (cooldown) {
                const timeout = setTimeout(() => {
                    this.setState({
                        userIsInCooldown: !boolean,
                    });
                    clearTimeout(timeout);
                }, cooldown);
            }
        }

        setCooldownOnAction(actionId, cooldown) {
            this.setState({
                actions: {
                    ...this.state.actions,
                    [actionId]: Date.now() + cooldown,
                },
            });
        }

        render() {
            if (this.state.loading) {
                return <Title props={{ label: 'Loading' }} />;
            }

            const actions = { ...this.props.actions, ...this.state.actions };
            const { userInterface, userIsInCooldown, configUI } = this.state;
            const userCooldown = { set: this.setCooldownForUser, value: userIsInCooldown };

            return (
                <WrappedComponent
                    {...this.props}
                    userInterface={userInterface}
                    configUI={configUI}
                    actions={actions}
                    userCooldown={userCooldown}
                    setCooldownOnAction={this.setCooldownOnAction}
                />
            );
        }
    }

    // For better debugging
    withTwitch.displayName = `WithTwitch(${
        WrappedComponent.displayName || WrappedComponent.name || 'Component'
    })`;

    return withTwitch;
}

export default withTwitch;
