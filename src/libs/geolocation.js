const geolocation = {
    ERROR_TYPES: ['', 'permission_denied', 'position_unavailable', 'timeout'],

    /**
     * Определяем местоположения пользователя через w3c geolocation api.
     */
    getCurrentPosition: () => {
        return new Promise((resolve, reject) => {
            window.navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve(position.coords);
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 60000
                }
            );
        });
    },

    /**
     * Проверяет разерешение пользователя на геолокацию.
     */
    checkPermission: () => {
        if (window.navigator.permissions) {
            return window.navigator.permissions.query({name: 'geolocation'})
                .then((permission) => permission.state);
        }

        return Promise.resolve();
    }
};

export default geolocation;
