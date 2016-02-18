var app = angular.module('AppointmentApp',['ionic','ngCordova']);

app.controller('AppointmentCtrl', function ($scope, $ionicModal, $ionicPopup, $ionicPlatform, $cordovaLocalNotification) {
   
   //Create and Load the Modal
    $ionicModal.fromTemplateUrl('new-apps.html', function (modal) {
        $scope.appsModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    });
    
    //Open a new appointment modal
    $scope.openModal = function () {
        $scope.appsModal.show();
    };
    
    //Close the modal
    $scope.closeModal = function () {
        $scope.appsModal.hide();
    };
    
     $ionicPlatform.ready(function () {
        $scope.getNotificationIds = function () {
            $cordovaLocalNotification.getScheduledIds().then(function (scheduledIds) {
                $scope.result = [];
                
                for (var key  in scheduledIds) {
                    var row = {'id': scheduledIds[key]};
                    $scope.result.push(row);                    
                }
            });
        };
        
        $scope.getNotificationIds(); 
        
        $scope.addAppointment = function (task) {
            var now          = new Date().getTime(),
            _30_sec_from_now = new Date(now + 30*1000);
            
            $cordovaLocalNotification.isScheduled(task.id).then(function (isScheduled) {
                if(isScheduled){
                    $ionicPopup.alert({
                        title: "Warning",
                        tempalte: "Appointment with this title is scheduled"
                    }).then(function (res) {
                        task.id = "";
                    });
                }else{
                    $cordovaLocalNotification.add({
                        id: task.id,
                        title: task.id,
                        message: task.msg,
                        repeat: 'daily',
                        date: _30_sec_from_now                        
                    });
                    
                    $ionicPopup.alert({
                        title: 'Done',
                        template: 'Next ' + _30_sec_from_now 
                    }).then(function (res) {
                        $scope.appsModal.hide();
                        $scope.getNotificationIds();
                        task.id="";
                        task.msg="";
                        
                    });
                }
            });
        };
    });
        
});