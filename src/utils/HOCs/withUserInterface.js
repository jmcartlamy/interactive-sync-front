import React from 'react';

import getUserInterface from '../../api/getUserInterface';
import getAllActions from '../../api/getAllActions';
import Title from '../../components/UI/Title';

function withUserInterface(WrappedComponent) {
    class withUserInterface extends React.Component {
        constructor(props) {
            super(props);

            this.setCooldownForUser = this.setCooldownForUser.bind(this);
            this.setCooldownOnAction = this.setCooldownOnAction.bind(this);
            this.setModalIsOpen = this.setModalIsOpen.bind(this);
            this.setCurrentAction = this.setCurrentAction.bind(this);

            this.state = {
                userInterface: null,
                configUI: {},
                actions: null,
                loading: false,
                userIsInCooldown: false,
                modalIsOpen: false,
                currentAction: null,
            };
        }

        async componentDidMount() {
            const { auth, twitch, view } = this.props;

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

        setModalIsOpen(modalIsOpen) {
            this.setState(() => {
                return {
                    modalIsOpen,
                };
            });
        }

        setCurrentAction(currentAction) {
            this.setState(() => {
                return {
                    currentAction,
                };
            });
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

            const modal = { isOpen: this.state.modalIsOpen, setIsOpen: this.setModalIsOpen };
            const actions = {
                current: this.state.currentAction,
                setCurrent: this.setCurrentAction,
                ...this.state.actions,
            };
            const userCooldown = {
                set: this.setCooldownForUser,
                value: this.state.userIsInCooldown,
            };
            const { userInterface, configUI } = this.state;

            return (
                <WrappedComponent
                    {...this.props}
                    userInterface={userInterface}
                    configUI={configUI}
                    modal={modal}
                    actions={actions}
                    userCooldown={userCooldown}
                    setCooldownOnAction={this.setCooldownOnAction}
                />
            );
        }
    }

    // For better debugging
    withUserInterface.displayName = `WithUserInterface(${
        WrappedComponent.displayName || WrappedComponent.name || 'Component'
    })`;

    return withUserInterface;
}

export default withUserInterface;
