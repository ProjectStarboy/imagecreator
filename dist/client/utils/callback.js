const SERVER_ID = GetPlayerServerId(PlayerId());
export const emitCallback = async (eventName, ...args) => {
    return new Promise((resolve, reject) => {
        const eventCallback = (response) => {
            clearTimeout(eventTimeOut);
            removeEventListener(`_server_response:${eventName}:${SERVER_ID}`, eventCallback);
            resolve(response);
        };
        const eventTimeOut = setTimeout(() => {
            removeEventListener(`_server_response:${eventName}:${SERVER_ID}`, eventCallback);
            console.log(`_server_response:${eventName}:${SERVER_ID} Timed out`);
            reject('timeout');
        }, 30000);
        onNet(`_server_response:${eventName}:${SERVER_ID}`, eventCallback);
        emitNet(`_server_callback:${eventName}`, ...args);
    });
};
//# sourceMappingURL=callback.js.map