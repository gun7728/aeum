function getBoundingBoxCoordinates(lat1, lon1, lat2, lon2) {
    var minLat = Math.min(lat1, lat2);
    var maxLat = Math.max(lat1, lat2);
    var minLon = Math.min(lon1, lon2);
    var maxLon = Math.max(lon1, lon2);

    // Calculate all four coordinates of the bounding box
    var topLeft = { lat: maxLat, lon: minLon };
    var topRight = { lat: maxLat, lon: maxLon };
    var bottomLeft = { lat: minLat, lon: minLon };
    var bottomRight = { lat: minLat, lon: maxLon };

    // Return all four coordinates of the bounding box
    return { topLeft: topLeft, topRight: topRight, bottomLeft: bottomLeft, bottomRight: bottomRight };
}

function isCoordinateInsideBoundingBox(coordinate, boundingBox) {
    var lat = coordinate.lat;
    var lon = coordinate.lon;
    var topLeft = boundingBox.topLeft;
    var bottomRight = boundingBox.bottomRight;

    if (parseFloat(lat).toFixed(6) <= parseFloat(topLeft.lat).toFixed(6) && parseFloat(lat).toFixed(6) >= parseFloat(bottomRight.lat).toFixed(6) && parseFloat(lon).toFixed(6) >= parseFloat(topLeft.lon).toFixed(6) && parseFloat(lon).toFixed(6) <= parseFloat(bottomRight.lon).toFixed(6)) {
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