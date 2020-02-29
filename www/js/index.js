/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var app = {
    filters: ['facebook', 'whatsapp', 'telegram', 'instagram', 'spotify', 'incallui', 'telecom', 'mms'],

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        var _this = this;

        cordova.plugins.backgroundMode.enable();
        //cordova.plugins.backgroundMode.moveToBackground();

        cordova.plugins.backgroundMode.on('activate', function() {
           cordova.plugins.backgroundMode.disableWebViewOptimizations();
        });
        
        if(localStorage.getItem("ip_service") !== undefined) {
            $(".ip-box input").val(localStorage.getItem("ip_service"));
        }

        if(localStorage.getItem("news_service") !== undefined) {
            $(".news-box input").val(localStorage.getItem("news_service"));
        }

        if(localStorage.getItem("weather_service") !== undefined) {
            $(".weather-box input").val(localStorage.getItem("weather_service"));
        }
    },

    bindEvents: function() {
        var _this = this;

        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        $('input[type="checkbox"]').on('change', function() {
            var value = $(this).val();

            if($(this).is(':checked')){
                var pos = _this.filters.indexOf(value);
                if(pos >= 0) return;
                _this.filters.push(value);
            } else {
                _this.filters.remove(value);
            }
        });

        $('.ip-box input').on('input', function() {
            localStorage.setItem("ip_service", $(this).val());
        });

        $('.news-box input').on('input', function() {
            localStorage.setItem("news_service", $(this).val());
        });

        $('.weather-box input').on('input', function() {
            localStorage.setItem("weather_service", $(this).val());
        });

        $('.connect-box button').on('click', function() {
            if(socket == null) {
                socketManager.openConnection($(".ip-box input").val());
            } else {
                socketManager.closeConnection();
            }
        });

        $('.mouse-pointer-box button').on('click', function() {
            socketManager.toggleMousePointer($(this).prop('value'));
        });

        $('.clear-notifications-box button').on('click', function() {
            socketManager.clearNotifications();
        });
    }
};

app.initialize();