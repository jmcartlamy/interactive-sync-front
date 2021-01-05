export default function pickMatchedActions(actions, name) {
    if (actions) {
        let matchedActions = {};
        Object.entries(actions).map(([actionId, scheduledTimestamp]) => {
            if (actionId === name) {
                matchedActions = scheduledTimestamp
            }
        });
        return matchedActions;
    }
    return null;
}
