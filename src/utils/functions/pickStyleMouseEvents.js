export default function pickStyleMouseEvents(mouseInterface, isSending, isCooldown) {
    const styleEvent = mouseInterface.reduce((acc, item) => {
        return {
            ...acc,
            [item.type]: {
                style: item.style,
                cooldownStyle: item.cooldown.style,
            },
        };
    }, {});

    if (isSending.mouseup || isCooldown.mouseup) {
        return styleEvent.mouseup?.cooldownStyle;
    } else if (isSending.mousedown || isCooldown.mousedown) {
        return styleEvent.mousedown?.cooldownStyle;
    }

    return styleEvent.mouseup?.style || styleEvent.mousedown?.style || undefined;
}
