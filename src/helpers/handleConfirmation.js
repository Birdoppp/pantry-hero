export function handleConfirmation( isConfirm, stateSetter, callBack ) {
    if ( isConfirm ) {
        if (callBack) {
            callBack();
        }
    }

    stateSetter( false );
}