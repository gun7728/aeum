function getBoundingBoxCoordinates(lat1, lon1, lat2, lon2) {
    var minLat = Math.min(lat1, lat2);
    var maxLat = Math.max(lat1, lat2);
    var minLon = Math.min(lon1, lon2);
    var maxLon = Math.max(lon1, lon2);

    // Check which point is on the top and bottom
    var topLeft, topRight, bottomLeft, bottomRight;
    if (lat1 > lat2) {
        topLeft = { lat: lat1, lon: lon1 };
        topRight = { lat: lat1, lon: lon2 };
        bottomLeft = { lat: lat2, lon: lon1 };
        bottomRight = { lat: lat2, lon: lon2 };
    } else {
        topLeft = { lat: lat2, lon: lon2 };
        topRight = { lat: lat2, lon: lon1 };
        bottomLeft = { lat: lat1, lon: lon2 };
        bottomRight = { lat: lat1, lon: lon1 };
    }

    return { topLeft: topLeft, topRight: topRight, bottomLeft: bottomLeft, bottomRight: bottomRight };
}

function isCoordinateInsideBoundingBox(coordinate, boundingBox) {
    var lat = parseFloat(coordinate.lat);
    var lon = parseFloat(coordinate.lon);
    var topLeft = boundingBox.topLeft;
    var bottomRight = boundingBox.bottomRight;

    if (lat <= topLeft.lat && lat >= bottomRight.lat && lon >= topLeft.lon && lon <= bottomRight.lon) {
        return true;
    } else {
        return false;
    }
}

const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2){
    const R = 6371; // 지구의 반지름 (단위: 킬로미터)
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // 두 지점 간의 직선거리 (단위: 킬로미터)
    return distance;
}

module.exports = {
    getBoundingBoxCoordinates: getBoundingBoxCoordinates,
    isCoordinateInsideBoundingBox: isCoordinateInsideBoundingBox,
    calculateDistance:calculateDistance,
};