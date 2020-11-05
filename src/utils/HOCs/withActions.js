import React from 'react';

/**
 *
 */

function withActions(WrappedComponent) {
    class withActions extends React.Component {
        pickMatchedActionsProps() {
            const { name, actions } = this.props;

            if (actions) {
                let matchedActions = {};
                Object.entries(actions).map(([actionId, scheduledTimestamp]) => {
                    if (actionId === name) {
                        matchedActions = {
                            scheduledTimestamp: scheduledTimestamp,
                        };
                    }
                });
                return matchedActions;
            }
        }

        render() {
            const { actions, ...wrappedProps } = this.props; // exclude actions props
            const matchedActionsProps = this.pickMatchedActionsProps(); // pick matched actions props
            return <WrappedComponent {...matchedActionsProps} {...wrappedProps} />;
        }
    }

    // For better debugging
    withActions.displayName = `withActions(${
        WrappedComponent.displayName || WrappedComponent.name || 'Component'
    })`;

    return withActions;
}

export default withActions;
