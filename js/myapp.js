/**
 * Created by Administrator on 2016/12/31.
 */
'use strict';

var app = angular.module('MobileAngularUiExamples',[
    'ngRoute',
    'mobile-angular-ui',
    'mobile-angular-ui.gestures'
]);


app.run(function ($transform) {
    window.$transform = $transform;
});

app.config(function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'home.html', reloadOnSearch: false});
    $routeProvider.when('/details/:id', {templateUrl: 'details.html', reloadOnSearch: false});
    $routeProvider.when('/scroll', {templateUrl: 'scroll.html', reloadOnSearch: false});
    $routeProvider.when('/toggle', {templateUrl: 'toggle.html', reloadOnSearch: false});
    $routeProvider.when('/tabs', {templateUrl: 'tabs.html', reloadOnSearch: false});
    $routeProvider.when('/accordion', {templateUrl: 'accordion.html', reloadOnSearch: false});
    $routeProvider.when('/overlay', {templateUrl: 'overlay.html', reloadOnSearch: false});
    $routeProvider.when('/forms', {templateUrl: 'forms.html', reloadOnSearch: false});
});

app.directive('toucharea', ['$touch', function($touch) {
  // Runs during compile
  return {
    restrict: 'C',
    link: function($scope, elem) {
      $scope.touch = null;
      $touch.bind(elem, {
        start: function(touch) {
          $scope.containerRect = elem[0].getBoundingClientRect();
          $scope.touch = touch;
          $scope.$apply();
        },

        cancel: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        move: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        end: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        }
      });
    }
  };
}]);

//
// `$drag` example: drag to dismiss
//
app.directive('dragToDismiss', function($drag, $parse, $timeout) {
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var dismissFn = $parse(attrs.dragToDismiss);
      return function(scope, elem) {
        var dismiss = false;

        $drag.bind(elem, {
          transform: $drag.TRANSLATE_RIGHT,
          move: function(drag) {
            if (drag.distanceX >= drag.rect.width / 4) {
              dismiss = true;
              elem.addClass('dismiss');
            } else {
              dismiss = false;
              elem.removeClass('dismiss');
            }
          },
          cancel: function() {
            elem.removeClass('dismiss');
          },
          end: function(drag) {
            if (dismiss) {
              elem.addClass('dismitted');
              $timeout(function() {
                scope.$apply(function() {
                  dismissFn(scope);
                });
              }, 300);
            } else {
              drag.reset();
            }
          }
        });
      };
    }
  };
});

app.directive('carousel', function () {
    return {
      restrict: 'C',
        scope: {},
        controller: function () {
            this.itemCount = 0;
            this.activeItem = null;

            this.addItem = function () {
                var newId = this.itemCount++;
                this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
                return newId;
            };

            this.next =function () {
                this.activeItem = this.activeItem || 0;
                this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
            };

            this.prev = function () {
                this.activeItem = this.activeItem || 0;
                this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
            };
        }
    };
});

app.directive('carouselItem', function($drag) {
  return {
    restrict: 'C',
    require: '^carousel',
    scope: {},
    transclude: true,
    template: '<div class="item"><div ng-transclude></div></div>',
    link: function(scope, elem, attrs, carousel) {
      scope.carousel = carousel;
      var id = carousel.addItem();

            var zIndex = function() {
                var res = 0;
                if (id == carousel.activeItem){
                    res = 2000;
                } else if (carousel.activeItem < id){
                    res = 2000 - (id - carousel.activeItem);
                } else {
                    res = 2000 - (carousel.itemCount -1 - carousel.activeItem + id);
                }
                return res;
            };

            scope.$watch(function () {
                return carousel.activeItem;
            },function () {
                elem[0].style.zIndex = zIndex();
            });

            $drag.bind(elem, {
                transform: function (element, transform, touch) {
                    var t = $drag.TRANSLATE_BOTH(element, transform, touch);

                    var Dx = touch.distanceX;
                    var t0 = touch.startTransform;
                    var sign = Dx < 0 ? -1 : 1;
                    var angle = sign * Math.min((Math.abs(Dx) / 700) * 30, 30);

                    t.rotateZ = angle + (Math.round(t0.rotateZ));

                    return t;
                },
                move: function (drag) {
                    if (Math.abs(drag.distanceX) >= drag.rect.width /4 ){
                     elem.addClass('dismiss');
                    } else {
                        elem.removeClass('dismiss');
                    }
                },
                cancel:function () {
                  elem.removeClass('dismiss');
                },
                end: function (drag) {
                    elem.removeClass('dismiss');
                    if (Math.abs(drag.distanceX) >= drag.rect.width / 4) {
                        scope.$apply(function () {
                            carousel.next();
                        });
                    }
                    drag.reset();
                }
            });
        }
    };
});

app.directive('dragMe', ['$drag', function ($drag) {
    return{
        controller: function ($scope, $element) {
            $drag.bind($element,
                {
                    transform: $drag.TRANSLATE_INSIDE($element.parent()),
                    end: function (drag) {
                        drag.reset();
                    }
                },
                {
                    sensitiveArea: $element.parent()
                });
        }
    }
}]);

//
// For this trivial demo we have just a unique MainController
// for everything
//
app.controller('MainController', function($rootScope, $scope) {

  $scope.swiped = function(direction) {
    alert('Swiped ' + direction);
  };

  // User agent displayed in home page
  $scope.userAgent = navigator.userAgent;

  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function() {
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function() {
    $rootScope.loading = false;
  });

  // Fake text i used here and there.
  $scope.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
    'Vel explicabo, aliquid eaque soluta nihil eligendi adipisci error, illum ' +
    'corrupti nam fuga omnis quod quaerat mollitia expedita impedit dolores ipsam. Obcaecati.';

    var scrollItems = [];

  for (var i = 1; i <= 100; i++) {
    scrollItems.push('Item ' + i);
  }

  $scope.scrollItems = scrollItems;

  $scope.bottomReached = function() {
    alert('Congrats you scrolled to the end of the list!');
  };

    $scope.chatUsers = [
        {name: 'Carlos Flowers', online: true},
        {name: 'Carlos Flowers', online: true},
        {name: 'Carlos Flowers', online: true},
        {name: 'Carlos Flowers', online: true},
        {name: 'Carlos Flowers', online: false},
        {name: 'Carlos Flowers', online: false},
        {name: 'Carlos Flowers', online: false},
        {name: 'Carlos Flowers', online: false},
        {name: 'Carlos Flowers', online: false},
        {name: 'Carlos Flowers', online: false}
    ];

    $scope.rememberMe = true;
    $scope.email = 'jiaoxinagpo2007@gmail.com';

  $scope.login = function() {
    alert('You submitted the login form');
  };

    $scope.notices = [];

    for (var j = 0; j < 10; j++){
        $scope.notices.push({icon: 'envelope', message: 'Notice ' + (j + 1 )});
    }

    $scope.deleteNotice = function (notice) {
        var index = $scope.notices.indexOf(notice);
        if(index > -1){
            $scope.notices.splice(index, 1);
        }
    };
});

app.controller('getModel', function ($scope, $http, $routeParams) {
    if ($routeParams.id) {
        var getNow = new Date().getTime();
        $http.get("resource/" + $routeParams.id + ".json?_"+ getNow)
            .then(function (response) {
                $scope.model = response.data;
            }, function (response) {
                if (response.status == 404) {
                    alert("对不起，您访问的手机不存在！我们已经在完善信息。");
                    return false;
                } else {
                    alert("系统出现故障");
                }
            });
    } else {
        alert("没有id");
    }
});