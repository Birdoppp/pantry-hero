import {getExpiryString} from "./getExpiryString";

export function getExpiryItemsCount( list, offset, checkDate ) {
    return list?.filter((item) => {
        if (item.expiryDate || item.expiryDate === 0) {
            if ( checkDate || checkDate === 0 ) {
                return item.expiryDate <= getExpiryString( offset ) && item.expiryDate > getExpiryString( checkDate );
            } else if ( offset === 0 ) {
                return item.expiryDate <= getExpiryString( offset );
            } else {
                return item.expiryDate > getExpiryString( offset );
            }
        }
    }).length;
}