import * as ɵngcc0 from '@angular/core';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { ClickOutsideDirective } from './click-outside.directive';
var ClickOutsideModule = (function () {
    function ClickOutsideModule() {
    }
ClickOutsideModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: ClickOutsideModule });
ClickOutsideModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function ClickOutsideModule_Factory(t) { return new (t || ClickOutsideModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(ClickOutsideModule, { declarations: function () { return [ClickOutsideDirective]; }, exports: function () { return [ClickOutsideDirective]; } }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(ClickOutsideModule, [{
        type: NgModule,
        args: [{
                declarations: [ClickOutsideDirective],
                exports: [ClickOutsideDirective]
            }]
    }], function () { return []; }, null); })();
    return ClickOutsideModule;
}());
export { ClickOutsideModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2stb3V0c2lkZS5tb2R1bGUuanMiLCJzb3VyY2VzIjpbImNsaWNrLW91dHNpZGUubW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O2dEQU0yQjtBQUMzQjtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlIH0gZnJvbSAnLi9jbGljay1vdXRzaWRlLmRpcmVjdGl2ZSc7XG52YXIgQ2xpY2tPdXRzaWRlTW9kdWxlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDbGlja091dHNpZGVNb2R1bGUoKSB7XG4gICAgfVxuICAgIENsaWNrT3V0c2lkZU1vZHVsZSA9IF9fZGVjb3JhdGUoW1xuICAgICAgICBOZ01vZHVsZSh7XG4gICAgICAgICAgICBkZWNsYXJhdGlvbnM6IFtDbGlja091dHNpZGVEaXJlY3RpdmVdLFxuICAgICAgICAgICAgZXhwb3J0czogW0NsaWNrT3V0c2lkZURpcmVjdGl2ZV1cbiAgICAgICAgfSlcbiAgICBdLCBDbGlja091dHNpZGVNb2R1bGUpO1xuICAgIHJldHVybiBDbGlja091dHNpZGVNb2R1bGU7XG59KCkpO1xuZXhwb3J0IHsgQ2xpY2tPdXRzaWRlTW9kdWxlIH07XG4iXX0=