'use strict';


angular.module('ngCart', ['ngCart.directives'])
    .config([
        function () {

        }
    ])
    .provider('$ngCart',
    function () {
        this.$get = function () {
        };
    })
    .run([
        '$rootScope', 'ngCart', 'ngCartItem', 'store', function ($rootScope, ngCart, ngCartItem, store) {

            $rootScope.$on('ngCart:change',
                function () {
                    ngCart.$save();
                });

            if (angular.isObject(store.get('cart'))) {
                ngCart.$restore(store.get('cart'));

            } else {
                ngCart.init();
            }

        }
    ])
    .service('ngCart',
    [
        '$rootScope', '$window', 'ngCartItem', 'store', function ($rootScope, $window, ngCartItem, store) {
            this.init = function () {
                this.$cart = {
                    shipping: null,
                    taxRate: null,
                    tax: null,
                    items: [],
                    payMethod: null,
                    payback: null,
                    delivery: null,
                    orderInfo: null,
                    shippingType: null
                };

                window.cart = this;
            };

            this.addItem = function (id, name, price, quantity, data, image, ev, addCost) {
                var inCart = this.getItemById(id);

                if (typeof inCart === 'object') {
                    //Update quantity of an item if it's already in the cart
                    inCart.setQuantity(quantity, false);
                    $rootScope.$broadcast('ngCart:itemUpdated', inCart);
                } else {
                    data = data || {};
                    if (addCost) {
                        data.addCost = addCost;
                    }
                    var newItem = new ngCartItem(id, name, price, quantity, data);
                    this.$cart.items.push(newItem);
                    $rootScope.$broadcast('ngCart:itemAdded', newItem);
                }

                $rootScope.$broadcast('ngCart:change', {});
                if (ev) {
                    $(ev.currentTarget).hide();
                }
                //                $('.cart .cnt').animateCss('bounceIn');
            };

            this.getAddCost = function () {
                var total = 0;
                angular.forEach(this.getCart().items,
                    function (item) {
                        total += item.getAddCost();
                    });
                return +parseFloat(total).toFixed(2);
            };

            this.getItemById = function (itemId) {
                var items = this.getCart().items;
                var build = false;

                angular.forEach(items,
                    function (item) {
                        if (item.getId() === itemId) {
                            build = item;
                        }
                    });
                return build;
            };

            this.setPayMethod = function (pay) {
                this.$cart.payMethod = pay;
                $rootScope.$broadcast('ngCart:change', {});
                return this.getPayMethod();
            }

            this.getPayMethod = function () {
                return this.getCart().payMethod;
            }

            this.setPayback = function (value) {
                this.$cart.payback = value;
                $rootScope.$broadcast('ngCart:change', {});
                return this.getPayback();
            }

            this.getPayback = function () {
                return this.getCart().payback;
            }

            this.setDelivery = function (value) {
                this.$cart.delivery = value;
                $rootScope.$broadcast('ngCart:change', {});
                return this.getDelivery();
            }


            this.getDelivery = function () {
                return this.getCart().delivery;
            }

            this.deliveryMethodChange = function () {
                $rootScope.$broadcast('ngCart:change', {});
                //var selected = this.$cart.delivery;
                //var cost = this.deliveryMethods.filter(function (elem) { return elem.id === selected; })[0].cost;
                //this.$cart.shipping = cost;
            }

            this.getOrderInfo = function () {
                return this.getCart().orderInfo;
            }
            this.setOrderInfo = function (value) {
                this.$cart.orderInfo = value;
                $rootScope.$broadcast('ngCart:change', {});
                return this.getOrderInfo();
            }


            this.setShipping = function (shipping) {
                this.$cart.shipping = shipping;
                return this.getShipping();
            };
            this.getShipping = function () {
                if (this.getCart().items.length == 0) return 0;
                return this.getCart().shipping;
            };

            this.setTaxRate = function (taxRate) {
                this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
                return this.getTaxRate();
            };
            this.getTaxRate = function () {
                return this.$cart.taxRate;
            };
            this.getTax = function () {
                return +parseFloat(((this.getSubTotal() / 100) * this.getCart().taxRate)).toFixed(2);
            };

            this.setCart = function (cart) {
                this.$cart = cart;
                return this.getCart();
            };
            this.getCart = function () {
                return this.$cart;
            };

            this.getItems = function () {
                return this.getCart().items;
            };

            this.getDefaultPayback = function () {
                return Math.ceil(this.totalCost() / 500) * 500;
            }

            this.getTotalItems = function () {
                var count = 0;
                var items = this.getItems();
                angular.forEach(items,
                    function (item) {
                        count += item.getQuantity();
                    });
                return count;
            };

            this.getTotalWeight = function () {
                var weight = 0;
                var items = this.getItems();
                angular.forEach(items,
                    function (item) {
                        if (item._data.weight)
                            weight += item._data.weight * item.getQuantity();
                    });
                return weight;
            };

            this.getTotalUniqueItems = function () {
                return this.getCart().items.length;
            };

            this.paymentMethods = [{ label: "Наличными", id: "cash" },
                //{ label: "Online-оплата", id: "online" }
            ];
            this.deliveryMethods = [{ label: "Курьером по Спб", id: 1, cost: 400 }, { label: "Самовывоз", id: 2, cost: 0 }];



            this.getSubTotal = function () {
                var total = 0;
                angular.forEach(this.getCart().items,
                    function (item) {
                        total += item.getTotal();
                    });
                total += this.getAddCost();
                return +parseFloat(total).toFixed(2);
            };

            this.totalCost = function () {
                return +parseFloat(this.getSubTotal() + this.getShipping() + this.getTax() + this.getAddCost()).toFixed(2);
            };

            this.removeItem = function (index) {
                var item = this.$cart.items.splice(index, 1)[0] || {};
                $rootScope.$broadcast('ngCart:itemRemoved', item);
                $rootScope.$broadcast('ngCart:change', {});

            };

            this.removeItemById = function (id) {
                var item;
                var cart = this.getCart();
                angular.forEach(cart.items,
                    function (item, index) {
                        if (item.getId() === id) {
                            item = cart.items.splice(index, 1)[0] || {};
                        }
                    });
                this.setCart(cart);
                $rootScope.$broadcast('ngCart:itemRemoved', item);
                $rootScope.$broadcast('ngCart:change', {});
            };

            this.empty = function () {

                $rootScope.$broadcast('ngCart:change', {});
                this.$cart.items = [];
                $window.localStorage.removeItem('cart');
            };

            this.isEmpty = function () {

                return (this.$cart.items.length > 0 ? false : true);

            };

            this.toObject = function () {

                if (this.getItems().length === 0) return false;

                var items = [];
                angular.forEach(this.getItems(),
                    function (item) {
                        items.push(item.toObject());
                    });

                return {
                    shipping: this.getShipping(),
                    tax: this.getTax(),
                    taxRate: this.getTaxRate(),
                    subTotal: this.getSubTotal(),
                    totalCost: this.totalCost(),
                    items: items,
                    payMethod: this.getPayMethod(),
                    payback: this.getPayback(),
                    delivery: this.getDelivery(),
                    orderInfo: this.getOrderInfo()
                }
            };


            this.$restore = function (storedCart) {
                var _self = this;
                _self.init();
                _self.$cart.shipping = storedCart.shipping;
                _self.$cart.payMethod = storedCart.payMethod;
                _self.$cart.payback = storedCart.payback;
                _self.$cart.delivery = storedCart.delivery;
                _self.$cart.orderInfo = storedCart.orderInfo;
                _self.$cart.tax = storedCart.tax;

                angular.forEach(storedCart.items,
                    function (item) {
                        _self.$cart.items
                            .push(new ngCartItem(item._id, item._name, item._price, item._quantity, item._data));
                    });
                this.$save();

                if (_self.getTotalItems() === 0 && document.getElementsByClassName('progress')[0])
                    document.getElementsByClassName('progress')[0].style.display = 'none';
            };

            this.$save = function () {
                return store.set('cart', JSON.stringify(this.getCart()));
            }


        }
    ])
    .factory('ngCartItem',
    [
        '$rootScope', '$log', function ($rootScope, $log) {

            var item = function (id, name, price, quantity, data) {
                this.setId(id);
                this.setName(name);
                this.setPrice(price);
                this.setQuantity(quantity);
                this.setData(data);
                this.setAddCost(data.addCost);
            };


            item.prototype.setId = function (id) {
                if (id) this._id = id;
                else {
                    $log.error('An ID must be provided');
                }
            };

            item.prototype.getId = function () {
                return this._id;
            };


            item.prototype.setName = function (name) {
                if (name) this._name = name;
                else {
                    $log.error('A name must be provided');
                }
            };
            item.prototype.getName = function () {
                return this._name;
            };

            item.prototype.setPrice = function (price) {
                var priceFloat = parseFloat(price);
                if (priceFloat) {
                    if (priceFloat <= 0) {
                        $log.error('A price must be over 0');
                    } else {
                        this._price = (priceFloat);
                    }
                } else {
                    $log.error('A price must be provided');
                }
            };

            item.prototype.setAddCost = function (cost) {

                var priceFloat = parseFloat(cost);
                this._addCost = priceFloat;
            }

            item.prototype.getPrice = function () {
                return this._price;
            };


            item.prototype.change = function () {
                $rootScope.$broadcast('ngCart:change', {});
            }

            item.prototype.setQuantity = function (quantity, relative) {
                var quantityInt = parseInt(quantity);
                if (quantityInt % 1 === 0) {
                    if (relative === true) {
                        this._quantity += quantityInt;
                    } else {
                        this._quantity = quantityInt;
                    }
                    if (this._quantity < 1) this._quantity = 1;

                } else {
                    this._quantity = 1;
                    $log.info('Quantity must be an integer and was defaulted to 1');
                }
                $rootScope.$broadcast('ngCart:change', {});
            }

            item.prototype.getQuantity = function () {
                return this._quantity;
            };

            item.prototype.changeQuantity = function (d) {
                console.log(d);
            };

            item.prototype.setData = function (data) {
                if (data) this._data = data;
            };

            item.prototype.getData = function () {
                if (this._data) return this._data;
                else $log.info('This item has no data');
            };


            item.prototype.getTotal = function () {
                return +parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);
            };



            item.prototype.getAddCost = function () {
                return +parseFloat(this.getQuantity() * (this.getData().addCost || 0)).toFixed(2);
            };

            item.prototype.toObject = function () {
                return {
                    id: this.getId(),
                    name: this.getName(),
                    price: this.getPrice(),
                    quantity: this.getQuantity(),
                    data: this.getData(),
                    addCost: this.getData().addCost,
                    total: this.getTotal()
                }
            };

            return item;

        }
    ])
    .service('store',
    [
        '$window', function ($window) {

            return {
                get: function (key) {
                    if ($window.localStorage.getItem(key)) {
                        var cart = angular.fromJson($window.localStorage.getItem(key));
                        return JSON.parse(cart);
                    }
                    return false;

                },


                set: function (key, val) {

                    if (val === undefined) {
                        $window.localStorage.removeItem(key);
                    } else {
                        $window.localStorage.setItem(key, angular.toJson(val));
                    }
                    return $window.localStorage.getItem(key);
                }
            }
        }
    ])
    .controller('CartController',
    [
        '$scope', 'ngCart', '$http', function ($scope, ngCart, $http) {
            $scope.ngCart = ngCart;
            $scope.next = function (url) {
                //console.log(document.querySelector('select[name=delivery]').value);
                ngCart.setDelivery(ngCart.$cart.delivery);
                document.location = url;
            };

            $scope.test = function () {
                return $scope.stepSecondForm.$valid;
            };
            $scope.test2 = function () {
                return true;
            };

            $scope.$watch('ngCart.$cart.delivery', function () {
                var selected = ngCart.$cart.delivery || 1;
                var cost = ngCart.deliveryMethods.filter(function (elem) {
                    return elem.id === (selected || 1);
                })[0].cost;
                ngCart.$cart.shipping = cost;
            }, true);

            $scope.submit = function () {

                ngCart.setOrderInfo($scope.model);
                $scope.submitProcess = true;
                var cart = angular.fromJson(window.localStorage.getItem('cart'));
                $http.post("/umbraco/surface/Order/Create", JSON.parse(cart))
                    .then(function (resp) {
                        $scope.resp = resp.data;
                        $scope.submitProcess = false;

                        if (resp.data.Status === 'Ok') {
                            window.cart.empty();
                            document.location = "/korzina/?step=done";
                        }
                    });
            };
        }
    ]);


angular.module('ngCart.directives', ['ngCart.fulfilment'])
    .controller('CartController',
    [
        '$scope', 'ngCart', function ($scope, ngCart) {
            $scope.ngCart = ngCart;

        }
    ])
    .directive('ngcartAddtocart',
    [
        'ngCart', function (ngCart) {
            return {
                restrict: 'E',
                controller: 'CartController',
                scope: {
                    id: '@',
                    name: '@',
                    quantity: '@',
                    quantityMax: '@',
                    addGrav: '@',
                    price: '@',
                    carturl: '@',
                    toordertitle: '@',
                    title: '@',
                    data: '='
                },
                transclude: true,
                templateUrl: function (element, attrs) {
                    if (typeof attrs.templateUrl == 'undefined') {
                        return '/assets/template/ngCart/addtocart.html';
                    } else {
                        return attrs.templateUrl;
                    }
                },
                link: function (scope, element, attrs) {
                    scope.clicked = false;
                    scope.attrs = attrs;
                    scope.inCart = function () {
                        return ngCart.getItemById(attrs.id);
                    };

                    if (scope.inCart()) {
                        scope.q = ngCart.getItemById(attrs.id).getQuantity();
                    } else {
                        scope.q = parseInt(scope.quantity);
                    }

                    scope.qtyOpt = [];
                    for (var i = 1; i <= scope.quantityMax; i++) {
                        scope.qtyOpt.push(i);
                    }



                    scope.inc = function () {
                        if (scope.q < 99)
                            scope.q++;
                    };

                    scope.dec = function () {
                        if (scope.q > 1)
                            scope.q--;
                    };
                }

            };
        }
    ]).directive('goClick', function () {
        return function (scope, element, attrs) {
            var path;

            attrs.$observe('goClick', function (val) {
                path = val;
            });

            element.bind('click', function () {
                scope.$apply(function () {
                    document.location.href = path;
                });
            });
        };
    })
    .directive('strictCity', ['ngCart', '$timeout', function (ngCart, $timeout) {
        return {
            restrict: 'A',
            controller: 'CartController',
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                $timeout(function () {
                    if (ngCart.$cart.delivery === 1) {
                        scope.$apply(function () {
                            element.attr('disabled', 'disabled');
                            ngModel.$setViewValue("Санкт-Петербург");
                            ngModel.$render(); 
                        });
                    }
                });

            }
        };
    }])
    .directive('ngcartAddtocartShort',
    [
        'ngCart', function (ngCart) {
            return {
                restrict: 'E',
                controller: 'CartController',
                scope: {
                    id: '@',
                    name: '@',
                    quantity: '@',
                    quantityMax: '@',
                    price: '@',
                    carturl: '@',
                    toordertitle: '@',
                    title: '@',
                    data: '='
                },
                transclude: true,
                templateUrl: function (element, attrs) {
                    if (typeof attrs.templateUrl == 'undefined') {
                        return '/assets/template/ngCart/addtocart_short.html';
                    } else {
                        return attrs.templateUrl;
                    }
                },
                link: function (scope, element, attrs) {
                    scope.clicked = false;
                    scope.attrs = attrs;
                    scope.inCart = function () {
                        return ngCart.getItemById(attrs.id);
                    };

                    if (scope.inCart()) {
                        scope.q = ngCart.getItemById(attrs.id).getQuantity();
                    } else {
                        scope.q = parseInt(scope.quantity);
                    }
                }
            };
        }
    ])

    .directive('ngcartSubtotal', [function () {
        return {
            require: "^ngController",
            restrict: 'E',
            controller: ('CartController', ['$rootScope', '$scope', 'ngCart', '$http', function ($rootScope, $scope, ngCart, $http) {

                $scope.ngCart = ngCart;
                $scope.next = function (url) {
                    ngCart.setOrderInfo($scope.ngCart.$cart.orderInfo);
                    document.location = url;
                }

                $scope.submit = function () {
                    console.log('test');
                    $scope.submitProcess = true;
                    var cart = angular.fromJson(window.localStorage.getItem('cart'));
                    // $scope.model.order = JSON.parse(cart);
                    $http.post("/umbraco/surface/Order/Create", cart)
                        .then(function (resp) {
                            $scope.resp = resp.data;
                            $scope.submitProcess = false;

                            if (resp.data.Status === 'Ok') {
                                window.cart.empty();
                                document.location = "/korzina/?step=done";
                            }
                        });
                };

            }]),
            scope: {
                nextStepUrl: '@',
                isFinal: '@',
                formvalid: '&'
            },
            templateUrl: function (element, attrs) {
                if (typeof attrs.templateUrl == 'undefined') {
                    return '/assets/template/ngCart/subtotal.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link: function (scope, element, attrs, ctrl) {

                console.log(scope.formvalid());
                scope.isValid = function () { return ctrl.$valid; }

            }
        };
    }])

    .directive('ngcartOrderSummary', [function () {
        return {
            restrict: 'E',
            controller: ('CartController', ['$rootScope', '$scope', 'ngCart', 'fulfilmentProvider', function ($rootScope, $scope, ngCart, fulfilmentProvider) {
                $scope.ngCart = ngCart;
            }]),
            scope: {
                nextStepUrl: '@'
            },
            templateUrl: function (element, attrs) {
                if (typeof attrs.templateUrl == 'undefined') {
                    return '/assets/template/ngCart/order_summary.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link: function (scope, element, attrs) {
            }
        };
    }])

    .directive('ngcartCart', [function () {
        return {
            restrict: 'E',
            controller: 'CartController',
            scope: {
                nextStepUrl: '@'
            },
            templateUrl: function (element, attrs) {
                if (typeof attrs.templateUrl == 'undefined') {
                    return '/assets/template/ngCart/cart.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link: function (scope, element, attrs) {

            }
        };
    }])

    .directive('ngcartCartShort', [function () {
        return {
            restrict: 'E',
            controller: 'CartController',
            scope: {
                nextStepUrl: '@'
            },
            templateUrl: function (element, attrs) {
                if (typeof attrs.templateUrl == 'undefined') {
                    return '/assets/template/ngCart/cart_short.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link: function (scope, element, attrs) {

            }
        };
    }])

    .directive('ngcartPaymentMethod', [function () {
        return {
            restrict: 'E',
            controller: 'CartController',
            scope: {
                nextStepUrl: '@'
            },
            templateUrl: function (element, attrs) {
                if (typeof attrs.templateUrl == 'undefined') {
                    return '/assets/template/ngCart/payment.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link: function (scope, element, attrs) {

            }
        };
    }])

    .directive('ngcartSummary', [function () {
        return {
            restrict: 'E',
            controller: 'CartController',
            scope: {
                url: '@'
            },
            transclude: true,
            templateUrl: function (element, attrs) {
                if (typeof attrs.templateUrl == 'undefined') {
                    return '/assets/template/ngCart/summary.html';
                } else {
                    return attrs.templateUrl;
                }
            }
        };
    }])

    .directive('ngcartCheckout', [function () {
        return {
            restrict: 'E',
            controller: ('CartController', ['$rootScope', '$scope', 'ngCart', 'fulfilmentProvider', function ($rootScope, $scope, ngCart, fulfilmentProvider) {
                $scope.ngCart = ngCart;

                $scope.checkout = function () {
                    fulfilmentProvider.setService($scope.service);
                    fulfilmentProvider.setSettings($scope.settings);
                    fulfilmentProvider.checkout()
                        .success(function (data, status, headers, config) {
                            $rootScope.$broadcast('ngCart:checkout_succeeded', data);
                        })
                        .error(function (data, status, headers, config) {
                            $rootScope.$broadcast('ngCart:checkout_failed', {
                                statusCode: status,
                                error: data
                            });
                        });
                }
            }]),
            scope: {
                service: '@',
                settings: '='
            },
            transclude: true,
            templateUrl: function (element, attrs) {
                if (typeof attrs.templateUrl == 'undefined') {
                    return '/assets/template/ngCart/checkout.html';
                } else {
                    return attrs.templateUrl;
                }
            }
        };
    }]);
;
angular.module('ngCart.fulfilment', [])
    .service('fulfilmentProvider', ['$injector', function ($injector) {

        this._obj = {
            service: undefined,
            settings: undefined
        };

        this.setService = function (service) {
            this._obj.service = service;
        };

        this.setSettings = function (settings) {
            this._obj.settings = settings;
        };

        this.checkout = function () {
            var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
            return provider.checkout(this._obj.settings);

        }

    }])


    .service('ngCart.fulfilment.log', ['$q', '$log', 'ngCart', function ($q, $log, ngCart) {

        this.checkout = function () {

            var deferred = $q.defer();

            $log.info(ngCart.toObject());
            deferred.resolve({
                cart: ngCart.toObject()
            });

            return deferred.promise;

        }

    }])

    .service('ngCart.fulfilment.http', ['$http', 'ngCart', function ($http, ngCart) {

        this.checkout = function (settings) {
            return $http.post(settings.url,
                { data: ngCart.toObject(), options: settings.options });
        }
    }])


    .service('ngCart.fulfilment.paypal', ['$http', 'ngCart', function ($http, ngCart) {


    }]);
