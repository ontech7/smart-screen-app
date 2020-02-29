var socket = null;

var socketManager = {
    openConnection: function(ip) {
        socket = io('http://' + ip + ':3000/');

        socket.on('notification-server', function(data) {
            console.log(data);
        });

        socket.on('connected-server', function(data) {
            console.log(data);
            $('.info').text("Connected!");
            $('.connect-box button').text('Disconnect');

            navigator.vibrate([100, 50, 100]);

            notificationListener.listen(function (obj) {
                for(var i = 0; i < app.filters.length; i++) {
                    var patt = new RegExp(app.filters[i]);
    
                    if(patt.test(obj.package) && (obj.textLines == '' || obj.textLines == obj.text)) {
                        var params = {
                            application: app.filters[i],
                            title: obj.title,
                            text: obj.text,
                            isRemoved: obj.isRemoved,
                            timestamp: new Date()
                        };
    
                        if(socket != null) {
                            if(obj.isRemoved) {
                                socketManager.removeNotification(params);
                            } else {
                                socketManager.sendNotification(params);
                            }
                        }
                    }
                }
            }, function (e) {
                console.log("[ERROR] - notificationListener fail: " + e.message);
            });
        });

        socket.on('disconnected-server', function(data) {
            console.log(data);
            $('.info').text("Disconnected!");
            $('.connect-box button').text('Connect');

            socket.off();
            socket = null;
        });

        socket.on('enable-mouse-pointer-server', function(data) {
            $('.mouse-pointer-box button').text('Disable Mouse Pointer');
            $('.mouse-pointer-box button').prop('value', 'disable');
        });

        socket.on('disable-mouse-pointer-server', function(data) {
            $('.mouse-pointer-box button').text('Enable Mouse Pointer');
            $('.mouse-pointer-box button').prop('value', 'enable');
        });

        socket.on('disconnect', function(data) {
            // In case connection drop, closure of the server, etc.

            $('.info').text("Disconnected!");
            $('.connect-box button').text('Connect');
            $('.mouse-pointer-box button').text('Disable Mouse Pointer');
            $('.mouse-pointer-box button').prop('value', 'disable');

            socket.off();
            socket = null;
        });
        
        socket.on('error-msg', function(data) {
            console.log(data);
        });

        socket.emit('connected-app', "[INFO] - Connected!");
        socket.emit('load-news-app', $('.news-box input').val());
        socket.emit('load-weather-app', $('.weather-box input').val());
        socket.emit('device-model-app', device.model);
    },
    closeConnection: function() {
        socket.emit('disconnected-app', "[INFO] - Disconnected!");
    },
    sendNotification: function(data) {
        socket.emit('notification-app', data);
        console.log("[INFO] - Notification sent");
    },
    removeNotification: function(data) {
        socket.emit('remove-notification-app', data);
        console.log("[INFO] - Notification removed");
    },
    toggleMousePointer: function(value) {
        if(value == 'enable') {
            socket.emit('enable-mouse-pointer-app', '[INFO] - Enable Mouse Pointer');
            console.log("[INFO] - Enable Mouse Pointer");
        } else {
            socket.emit('disable-mouse-pointer-app', '[INFO] - Disable Mouse Pointer');
            console.log("[INFO] - Disable Mouse Pointer");
        }
    },
    clearNotifications: function() {
        socket.emit('clear-notifications-app', "[INFO] - Notifications cleared!");
    }
}