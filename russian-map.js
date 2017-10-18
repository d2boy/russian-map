/**
 * Рендер Российской карты.
 *
 * Перед подключением этой библиотеки должна быть подключена библиотека RaphelJS:
 *
 * @see http://dmitrybaranovskiy.github.io/raphael/
 *
 * Состав опций:
 * - mapId - идентификатор элемента, в котором будет срендерена карта
 * - width - ширина карты
 * - height - высота карты
 * - defaultAttr - дефолтовые атрибуты полигона
 * - mouseMoveAttr - атрибуты для полигона при наведении мышки
 * - onMouseMove - событие при наведении мышки на регион
 * - onMouseOut - событие при убирании мышки с региона
 *
 * @param {Object} options Опции
 * @param {Array} regions Регионы, каждый элемент состоит из:
 *  ident - идентификатора,
 *  name - названия,
 *  paths - массив атрибутов path
 *  polygons - массив атрибутов polygon
 */
var RussianMap = function(options, regions) {
    var mapId = options.mapId;
    var width = options.width;
    var height = options.height;

    // канва для рисования регионов
    var R = Raphael(mapId, width, height, '0 0 1134 620', '700 700');

    // дефолтовые атрибуты для контуров регионов
    var defaultAttr = options.defaultAttr || {
        fill: '#d8d8d8', // цвет которым закрашивать
        stroke: '#ffffff', // цвет границы
        'stroke-width': 1, // ширина границы
        'stroke-linejoin': 'round' // скруглять углы
    };

    // атрибуты для контуров регионов при событии onMouseMove
    var mouseMoveAttr = options.mouseMoveAttr || {
        fill: '#25669e'
    };

    /**
     * Событие onMouseMove для path или polygon внутри контекста полигона (можно использовать this).
     */
    var onMouseMove = function(event) {
        var region = this.region;
        // установить всем полигонам в регионе дефолтовые атрибуты
        if (region.paths !== undefined) {
            for (var p in region.paths) {
                region.paths[p].attr(mouseMoveAttr);
            }
        }
        if (region.polygons !== undefined) {
            for (var p in region.polygons) {
                region.polygons[p].attr(mouseMoveAttr);
            }
        }
        if (options.onMouseMove) {
            options.onMouseMove.call(this, event);
        }
    };

    /**
     * Событие onMouseOut для path или polygon внутри контекста полигона (можно использовать this)
     */
    var onMouseOut = function(event) {
        var region = this.region;
        // установить всем полигонам в регионе дефолтовые атрибуты
        if (region.paths !== undefined) {
            for (var p in region.paths) {
                region.paths[p].attr(defaultAttr);
            }
        }
        if (region.polygons !== undefined) {
            for (var p in region.polygons) {
                region.polygons[p].attr(defaultAttr);
            }
        }
        if (options.onMouseOut) {
            options.onMouseOut.call(this, event);
        }
    };

    /**
     * Рендер региона
     * @param R
     * @param region
     */
    var renderRegion = function(region) {
        // прорисовка многоугольников
        if (region.paths !== undefined) {
            for (var p in region.paths) {
                var path = R.path(region.paths[p]).attr(defaultAttr);
                path.region = region;
                path.mouseover(onMouseMove);
                path.mouseout(onMouseOut);
                region.paths[p] = path;
            }
        }
        // прорисовка полигнов: также через тег path, только конечная точка соединяется с начальной
        if (region.polygons !== undefined) {
            for (var p in region.polygons) {
                var polygon = R.path('M' + region.polygons[p]).attr(defaultAttr);
                polygon.region = region;
                polygon.mouseover(onMouseMove);
                polygon.mouseout(onMouseOut);
                region.polygons[p] = polygon;
            }
        }
    };

    for (var i in regions) {
        renderRegion(regions[i]);
    }

    this.regions = regions;
};
