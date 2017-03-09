import { ElementRef, Renderer } from '@angular/core';
/**
 * @private
 */
export declare class Backdrop {
    private _elementRef;
    private _renderer;
    constructor(_elementRef: ElementRef, _renderer: Renderer);
    getNativeElement(): HTMLElement;
    setElementClass(className: string, add: boolean): void;
}
