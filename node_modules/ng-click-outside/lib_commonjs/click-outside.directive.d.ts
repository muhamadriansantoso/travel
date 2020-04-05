import { ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges, NgZone } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class ClickOutsideDirective implements OnInit, OnChanges, OnDestroy {
    private _el;
    private _ngZone;
    private platformId;
    clickOutsideEnabled: boolean;
    attachOutsideOnClick: boolean;
    delayClickOutsideInit: boolean;
    emitOnBlur: boolean;
    exclude: string;
    excludeBeforeClick: boolean;
    clickOutsideEvents: string;
    clickOutside: EventEmitter<Event>;
    private _nodesExcluded;
    private _events;
    constructor(_el: ElementRef, _ngZone: NgZone, platformId: Object);
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private _init;
    private _initOnClickBody;
    private _excludeCheck;
    private _onClickBody;
    private _onWindowBlur;
    private _emit;
    private _shouldExclude;
    private _initClickOutsideListener;
    private _removeClickOutsideListener;
    private _initAttachOutsideOnClickListener;
    private _removeAttachOutsideOnClickListener;
    private _initWindowBlurListener;
    private _removeWindowBlurListener;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ClickOutsideDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<ClickOutsideDirective, "[clickOutside]", never, { "clickOutsideEnabled": "clickOutsideEnabled"; "attachOutsideOnClick": "attachOutsideOnClick"; "delayClickOutsideInit": "delayClickOutsideInit"; "emitOnBlur": "emitOnBlur"; "exclude": "exclude"; "excludeBeforeClick": "excludeBeforeClick"; "clickOutsideEvents": "clickOutsideEvents"; }, { "clickOutside": "clickOutside"; }, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<ClickOutsideDirective>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2stb3V0c2lkZS5kaXJlY3RpdmUuZC50cyIsInNvdXJjZXMiOlsiY2xpY2stb3V0c2lkZS5kaXJlY3RpdmUuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIENsaWNrT3V0c2lkZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAgIHByaXZhdGUgX2VsO1xuICAgIHByaXZhdGUgX25nWm9uZTtcbiAgICBwcml2YXRlIHBsYXRmb3JtSWQ7XG4gICAgY2xpY2tPdXRzaWRlRW5hYmxlZDogYm9vbGVhbjtcbiAgICBhdHRhY2hPdXRzaWRlT25DbGljazogYm9vbGVhbjtcbiAgICBkZWxheUNsaWNrT3V0c2lkZUluaXQ6IGJvb2xlYW47XG4gICAgZW1pdE9uQmx1cjogYm9vbGVhbjtcbiAgICBleGNsdWRlOiBzdHJpbmc7XG4gICAgZXhjbHVkZUJlZm9yZUNsaWNrOiBib29sZWFuO1xuICAgIGNsaWNrT3V0c2lkZUV2ZW50czogc3RyaW5nO1xuICAgIGNsaWNrT3V0c2lkZTogRXZlbnRFbWl0dGVyPEV2ZW50PjtcbiAgICBwcml2YXRlIF9ub2Rlc0V4Y2x1ZGVkO1xuICAgIHByaXZhdGUgX2V2ZW50cztcbiAgICBjb25zdHJ1Y3RvcihfZWw6IEVsZW1lbnRSZWYsIF9uZ1pvbmU6IE5nWm9uZSwgcGxhdGZvcm1JZDogT2JqZWN0KTtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQ7XG4gICAgcHJpdmF0ZSBfaW5pdDtcbiAgICBwcml2YXRlIF9pbml0T25DbGlja0JvZHk7XG4gICAgcHJpdmF0ZSBfZXhjbHVkZUNoZWNrO1xuICAgIHByaXZhdGUgX29uQ2xpY2tCb2R5O1xuICAgIHByaXZhdGUgX29uV2luZG93Qmx1cjtcbiAgICBwcml2YXRlIF9lbWl0O1xuICAgIHByaXZhdGUgX3Nob3VsZEV4Y2x1ZGU7XG4gICAgcHJpdmF0ZSBfaW5pdENsaWNrT3V0c2lkZUxpc3RlbmVyO1xuICAgIHByaXZhdGUgX3JlbW92ZUNsaWNrT3V0c2lkZUxpc3RlbmVyO1xuICAgIHByaXZhdGUgX2luaXRBdHRhY2hPdXRzaWRlT25DbGlja0xpc3RlbmVyO1xuICAgIHByaXZhdGUgX3JlbW92ZUF0dGFjaE91dHNpZGVPbkNsaWNrTGlzdGVuZXI7XG4gICAgcHJpdmF0ZSBfaW5pdFdpbmRvd0JsdXJMaXN0ZW5lcjtcbiAgICBwcml2YXRlIF9yZW1vdmVXaW5kb3dCbHVyTGlzdGVuZXI7XG59XG4iXX0=