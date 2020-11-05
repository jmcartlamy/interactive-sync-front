const logSuccess = function (log, message, status) {
    log('EBS request returned ' + message + ' (' + status + ')');
};

const logError = function (log, error) {
    if (error) {
        log('EBS request returned ' + error);
    } else {
        log('EBS request returned an unknown error');
    }
};

export { logSuccess, logError };
