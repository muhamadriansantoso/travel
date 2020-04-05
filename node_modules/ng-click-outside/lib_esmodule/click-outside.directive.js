import * as ɵngcc0 from '@angular/core';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Directive, ElementRef, EventEmitter, Inject, Injectable, Input, Output, PLATFORM_ID, NgZone, } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
var ClickOutsideDirective = (function () {
    function ClickOutsideDirective(_el, _ngZone, platformId) {
        this._el = _el;
        this._ngZone = _ngZone;
        this.platformId = platformId;
        this.clickOutsideEnabled = true;
        this.attachOutsideOnClick = false;
        this.delayClickOutsideInit = false;
        this.emitOnBlur = false;
        this.exclude = '';
        this.excludeBeforeClick = false;
        this.clickOutsideEvents = '';
        this.clickOutside = new EventEmitter();
        this._nodesExcluded = [];
        this._events = ['click'];
        this._initOnClickBody = this._initOnClickBody.bind(this);
        this._onClickBody = this._onClickBody.bind(this);
        this._onWindowBlur = this._onWindowBlur.bind(this);
    }
    ClickOutsideDirective.prototype.ngOnInit = function () {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        this._init();
    };
    ClickOutsideDirective.prototype.ngOnDestroy = function () {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        this._removeClickOutsideListener();
        this._removeAttachOutsideOnClickListener();
        this._removeWindowBlurListener();
    };
    ClickOutsideDirective.prototype.ngOnChanges = function (changes) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        if (changes['attachOutsideOnClick'] || changes['exclude'] || changes['emitOnBlur']) {
            this._init();
        }
    };
    ClickOutsideDirective.prototype._init = function () {
        if (this.clickOutsideEvents !== '') {
            this._events = this.clickOutsideEvents.split(',').map(function (e) { return e.trim(); });
        }
        this._excludeCheck();
        if (this.attachOutsideOnClick) {
            this._initAttachOutsideOnClickListener();
        }
        else {
            this._initOnClickBody();
        }
        if (this.emitOnBlur) {
            this._initWindowBlurListener();
        }
    };
    ClickOutsideDirective.prototype._initOnClickBody = function () {
        if (this.delayClickOutsideInit) {
            setTimeout(this._initClickOutsideListener.bind(this));
        }
        else {
            this._initClickOutsideListener();
        }
    };
    ClickOutsideDirective.prototype._excludeCheck = function () {
        if (this.exclude) {
            try {
                var nodes = Array.from(document.querySelectorAll(this.exclude));
                if (nodes) {
                    this._nodesExcluded = nodes;
                }
            }
            catch (err) {
                console.error('[ng-click-outside] Check your exclude selector syntax.', err);
            }
        }
    };
    ClickOutsideDirective.prototype._onClickBody = function (ev) {
        if (!this.clickOutsideEnabled) {
            return;
        }
        if (this.excludeBeforeClick) {
            this._excludeCheck();
        }
        if (!this._el.nativeElement.contains(ev.target) && !this._shouldExclude(ev.target)) {
            this._emit(ev);
            if (this.attachOutsideOnClick) {
                this._removeClickOutsideListener();
            }
        }
    };
    ClickOutsideDirective.prototype._onWindowBlur = function (ev) {
        var _this = this;
        setTimeout(function () {
            if (!document.hidden) {
                _this._emit(ev);
            }
        });
    };
    ClickOutsideDirective.prototype._emit = function (ev) {
        var _this = this;
        if (!this.clickOutsideEnabled) {
            return;
        }
        this._ngZone.run(function () { return _this.clickOutside.emit(ev); });
    };
    ClickOutsideDirective.prototype._shouldExclude = function (target) {
        for (var _i = 0, _a = this._nodesExcluded; _i < _a.length; _i++) {
            var excludedNode = _a[_i];
            if (excludedNode.contains(target)) {
                return true;
            }
        }
        return false;
    };
    ClickOutsideDirective.prototype._initClickOutsideListener = function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () {
            _this._events.forEach(function (e) { return document.addEventListener(e, _this._onClickBody); });
        });
    };
    ClickOutsideDirective.prototype._removeClickOutsideListener = function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () {
            _this._events.forEach(function (e) { return document.removeEventListener(e, _this._onClickBody); });
        });
    };
    ClickOutsideDirective.prototype._initAttachOutsideOnClickListener = function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () {
            _this._events.forEach(function (e) { return _this._el.nativeElement.addEventListener(e, _this._initOnClickBody); });
        });
    };
    ClickOutsideDirective.prototype._removeAttachOutsideOnClickListener = function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () {
            _this._events.forEach(function (e) { return _this._el.nativeElement.removeEventListener(e, _this._initOnClickBody); });
        });
    };
    ClickOutsideDirective.prototype._initWindowBlurListener = function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () {
            window.addEventListener('blur', _this._onWindowBlur);
        });
    };
    ClickOutsideDirective.prototype._removeWindowBlurListener = function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () {
            window.removeEventListener('blur', _this._onWindowBlur);
        });
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], ClickOutsideDirective.prototype, "clickOutsideEnabled", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], ClickOutsideDirective.prototype, "attachOutsideOnClick", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], ClickOutsideDirective.prototype, "delayClickOutsideInit", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], ClickOutsideDirective.prototype, "emitOnBlur", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ClickOutsideDirective.prototype, "exclude", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], ClickOutsideDirective.prototype, "excludeBeforeClick", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ClickOutsideDirective.prototype, "clickOutsideEvents", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], ClickOutsideDirective.prototype, "clickOutside", void 0);
    ClickOutsideDirective = __decorate([ __param(2, Inject(PLATFORM_ID)),
        __metadata("design:paramtypes", [ElementRef,
            NgZone,
            Object])
    ], ClickOutsideDirective);
ClickOutsideDirective.ɵfac = function ClickOutsideDirective_Factory(t) { return new (t || ClickOutsideDirective)(ɵngcc0.ɵɵdirectiveInject(ɵngcc0.ElementRef), ɵngcc0.ɵɵdirectiveInject(ɵngcc0.NgZone), ɵngcc0.ɵɵdirectiveInject(PLATFORM_ID)); };
ClickOutsideDirective.ɵdir = ɵngcc0.ɵɵdefineDirective({ type: ClickOutsideDirective, selectors: [["", "clickOutside", ""]], inputs: { clickOutsideEnabled: "clickOutsideEnabled", attachOutsideOnClick: "attachOutsideOnClick", delayClickOutsideInit: "delayClickOutsideInit", emitOnBlur: "emitOnBlur", exclude: "exclude", excludeBeforeClick: "excludeBeforeClick", clickOutsideEvents: "clickOutsideEvents" }, outputs: { clickOutside: "clickOutside" }, features: [ɵngcc0.ɵɵNgOnChangesFeature] });
ClickOutsideDirective.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: ClickOutsideDirective, factory: function (t) { return ClickOutsideDirective.ɵfac(t); } });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(ClickOutsideDirective, [{
        type: Injectable
    }, {
        type: Directive,
        args: [{ selector: '[clickOutside]' }]
    }], function () { return [{ type: ɵngcc0.ElementRef }, { type: ɵngcc0.NgZone }, { type: Object, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }]; }, { clickOutsideEnabled: [{
            type: Input
        }], attachOutsideOnClick: [{
            type: Input
        }], delayClickOutsideInit: [{
            type: Input
        }], emitOnBlur: [{
            type: Input
        }], exclude: [{
            type: Input
        }], excludeBeforeClick: [{
            type: Input
        }], clickOutsideEvents: [{
            type: Input
        }], clickOutside: [{
            type: Output
        }] }); })();
    return ClickOutsideDirective;
}());
export { ClickOutsideDirective };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2stb3V0c2lkZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VzIjpbImNsaWNrLW91dHNpZGUuZGlyZWN0aXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBR087QUFDUDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFBOEI7QUFDOUI7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKGssIHYpO1xufTtcbnZhciBfX3BhcmFtID0gKHRoaXMgJiYgdGhpcy5fX3BhcmFtKSB8fCBmdW5jdGlvbiAocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XG59O1xuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5qZWN0YWJsZSwgSW5wdXQsIE91dHB1dCwgUExBVEZPUk1fSUQsIE5nWm9uZSwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbnZhciBDbGlja091dHNpZGVEaXJlY3RpdmUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENsaWNrT3V0c2lkZURpcmVjdGl2ZShfZWwsIF9uZ1pvbmUsIHBsYXRmb3JtSWQpIHtcbiAgICAgICAgdGhpcy5fZWwgPSBfZWw7XG4gICAgICAgIHRoaXMuX25nWm9uZSA9IF9uZ1pvbmU7XG4gICAgICAgIHRoaXMucGxhdGZvcm1JZCA9IHBsYXRmb3JtSWQ7XG4gICAgICAgIHRoaXMuY2xpY2tPdXRzaWRlRW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuYXR0YWNoT3V0c2lkZU9uQ2xpY2sgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kZWxheUNsaWNrT3V0c2lkZUluaXQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lbWl0T25CbHVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZXhjbHVkZSA9ICcnO1xuICAgICAgICB0aGlzLmV4Y2x1ZGVCZWZvcmVDbGljayA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsaWNrT3V0c2lkZUV2ZW50cyA9ICcnO1xuICAgICAgICB0aGlzLmNsaWNrT3V0c2lkZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5fbm9kZXNFeGNsdWRlZCA9IFtdO1xuICAgICAgICB0aGlzLl9ldmVudHMgPSBbJ2NsaWNrJ107XG4gICAgICAgIHRoaXMuX2luaXRPbkNsaWNrQm9keSA9IHRoaXMuX2luaXRPbkNsaWNrQm9keS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9vbkNsaWNrQm9keSA9IHRoaXMuX29uQ2xpY2tCb2R5LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX29uV2luZG93Qmx1ciA9IHRoaXMuX29uV2luZG93Qmx1ci5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBDbGlja091dHNpZGVEaXJlY3RpdmUucHJvdG90eXBlLm5nT25Jbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgfTtcbiAgICBDbGlja091dHNpZGVEaXJlY3RpdmUucHJvdG90eXBlLm5nT25EZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZW1vdmVDbGlja091dHNpZGVMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLl9yZW1vdmVBdHRhY2hPdXRzaWRlT25DbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZVdpbmRvd0JsdXJMaXN0ZW5lcigpO1xuICAgIH07XG4gICAgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLnByb3RvdHlwZS5uZ09uQ2hhbmdlcyA9IGZ1bmN0aW9uIChjaGFuZ2VzKSB7XG4gICAgICAgIGlmICghaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFuZ2VzWydhdHRhY2hPdXRzaWRlT25DbGljayddIHx8IGNoYW5nZXNbJ2V4Y2x1ZGUnXSB8fCBjaGFuZ2VzWydlbWl0T25CbHVyJ10pIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXQoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xpY2tPdXRzaWRlRXZlbnRzICE9PSAnJykge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRzID0gdGhpcy5jbGlja091dHNpZGVFdmVudHMuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGUudHJpbSgpOyB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9leGNsdWRlQ2hlY2soKTtcbiAgICAgICAgaWYgKHRoaXMuYXR0YWNoT3V0c2lkZU9uQ2xpY2spIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRBdHRhY2hPdXRzaWRlT25DbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0T25DbGlja0JvZHkoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5lbWl0T25CbHVyKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0V2luZG93Qmx1ckxpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENsaWNrT3V0c2lkZURpcmVjdGl2ZS5wcm90b3R5cGUuX2luaXRPbkNsaWNrQm9keSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVsYXlDbGlja091dHNpZGVJbml0KSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuX2luaXRDbGlja091dHNpZGVMaXN0ZW5lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRDbGlja091dHNpZGVMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDbGlja091dHNpZGVEaXJlY3RpdmUucHJvdG90eXBlLl9leGNsdWRlQ2hlY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmV4Y2x1ZGUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGVzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuZXhjbHVkZSkpO1xuICAgICAgICAgICAgICAgIGlmIChub2Rlcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub2Rlc0V4Y2x1ZGVkID0gbm9kZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tuZy1jbGljay1vdXRzaWRlXSBDaGVjayB5b3VyIGV4Y2x1ZGUgc2VsZWN0b3Igc3ludGF4LicsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENsaWNrT3V0c2lkZURpcmVjdGl2ZS5wcm90b3R5cGUuX29uQ2xpY2tCb2R5ID0gZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgIGlmICghdGhpcy5jbGlja091dHNpZGVFbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZXhjbHVkZUJlZm9yZUNsaWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9leGNsdWRlQ2hlY2soKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXYudGFyZ2V0KSAmJiAhdGhpcy5fc2hvdWxkRXhjbHVkZShldi50YXJnZXQpKSB7XG4gICAgICAgICAgICB0aGlzLl9lbWl0KGV2KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmF0dGFjaE91dHNpZGVPbkNsaWNrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2xpY2tPdXRzaWRlTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLnByb3RvdHlwZS5fb25XaW5kb3dCbHVyID0gZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5oaWRkZW4pIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5fZW1pdChldik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLnByb3RvdHlwZS5fZW1pdCA9IGZ1bmN0aW9uIChldikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMuY2xpY2tPdXRzaWRlRW5hYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW4oZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuY2xpY2tPdXRzaWRlLmVtaXQoZXYpOyB9KTtcbiAgICB9O1xuICAgIENsaWNrT3V0c2lkZURpcmVjdGl2ZS5wcm90b3R5cGUuX3Nob3VsZEV4Y2x1ZGUgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLl9ub2Rlc0V4Y2x1ZGVkOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGV4Y2x1ZGVkTm9kZSA9IF9hW19pXTtcbiAgICAgICAgICAgIGlmIChleGNsdWRlZE5vZGUuY29udGFpbnModGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIENsaWNrT3V0c2lkZURpcmVjdGl2ZS5wcm90b3R5cGUuX2luaXRDbGlja091dHNpZGVMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLl9ldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZSkgeyByZXR1cm4gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihlLCBfdGhpcy5fb25DbGlja0JvZHkpOyB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBDbGlja091dHNpZGVEaXJlY3RpdmUucHJvdG90eXBlLl9yZW1vdmVDbGlja091dHNpZGVMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLl9ldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZSkgeyByZXR1cm4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLCBfdGhpcy5fb25DbGlja0JvZHkpOyB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBDbGlja091dHNpZGVEaXJlY3RpdmUucHJvdG90eXBlLl9pbml0QXR0YWNoT3V0c2lkZU9uQ2xpY2tMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLl9ldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZSkgeyByZXR1cm4gX3RoaXMuX2VsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihlLCBfdGhpcy5faW5pdE9uQ2xpY2tCb2R5KTsgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLnByb3RvdHlwZS5fcmVtb3ZlQXR0YWNoT3V0c2lkZU9uQ2xpY2tMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLl9ldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZSkgeyByZXR1cm4gX3RoaXMuX2VsLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLCBfdGhpcy5faW5pdE9uQ2xpY2tCb2R5KTsgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLnByb3RvdHlwZS5faW5pdFdpbmRvd0JsdXJMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgX3RoaXMuX29uV2luZG93Qmx1cik7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLnByb3RvdHlwZS5fcmVtb3ZlV2luZG93Qmx1ckxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCBfdGhpcy5fb25XaW5kb3dCbHVyKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgSW5wdXQoKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEJvb2xlYW4pXG4gICAgXSwgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLnByb3RvdHlwZSwgXCJjbGlja091dHNpZGVFbmFibGVkXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBCb29sZWFuKVxuICAgIF0sIENsaWNrT3V0c2lkZURpcmVjdGl2ZS5wcm90b3R5cGUsIFwiYXR0YWNoT3V0c2lkZU9uQ2xpY2tcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgSW5wdXQoKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEJvb2xlYW4pXG4gICAgXSwgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLnByb3RvdHlwZSwgXCJkZWxheUNsaWNrT3V0c2lkZUluaXRcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgSW5wdXQoKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEJvb2xlYW4pXG4gICAgXSwgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLnByb3RvdHlwZSwgXCJlbWl0T25CbHVyXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBTdHJpbmcpXG4gICAgXSwgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLnByb3RvdHlwZSwgXCJleGNsdWRlXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBCb29sZWFuKVxuICAgIF0sIENsaWNrT3V0c2lkZURpcmVjdGl2ZS5wcm90b3R5cGUsIFwiZXhjbHVkZUJlZm9yZUNsaWNrXCIsIHZvaWQgMCk7XG4gICAgX19kZWNvcmF0ZShbXG4gICAgICAgIElucHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBTdHJpbmcpXG4gICAgXSwgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLnByb3RvdHlwZSwgXCJjbGlja091dHNpZGVFdmVudHNcIiwgdm9pZCAwKTtcbiAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgT3V0cHV0KCksXG4gICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBFdmVudEVtaXR0ZXIpXG4gICAgXSwgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLnByb3RvdHlwZSwgXCJjbGlja091dHNpZGVcIiwgdm9pZCAwKTtcbiAgICBDbGlja091dHNpZGVEaXJlY3RpdmUgPSBfX2RlY29yYXRlKFtcbiAgICAgICAgSW5qZWN0YWJsZSgpLFxuICAgICAgICBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tjbGlja091dHNpZGVdJyB9KSxcbiAgICAgICAgX19wYXJhbSgyLCBJbmplY3QoUExBVEZPUk1fSUQpKSxcbiAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtFbGVtZW50UmVmLFxuICAgICAgICAgICAgTmdab25lLFxuICAgICAgICAgICAgT2JqZWN0XSlcbiAgICBdLCBDbGlja091dHNpZGVEaXJlY3RpdmUpO1xuICAgIHJldHVybiBDbGlja091dHNpZGVEaXJlY3RpdmU7XG59KCkpO1xuZXhwb3J0IHsgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlIH07XG4iXX0=