export function findObjectByName( array, name ) {
    for (let i = 0; i < array.length; i++) {
        if ( array[i].name === name ) {
            return array[i];
        }
    }

    return null;
}