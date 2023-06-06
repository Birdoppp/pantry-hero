function handleConfirmation( bool, setter, callBack ) {
    if (bool) {
        if (callBack) {
            callBack();
        }
        setter(false);
    } else {
        setter(false);
    }
}

export default handleConfirmation;