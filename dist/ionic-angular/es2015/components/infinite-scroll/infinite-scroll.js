import { Directive, ElementRef, EventEmitter, Host, Input, NgZone, Output } from '@angular/core';
import { Content } from '../content/content';
import { DomController } from '../../platform/dom-controller';
/**
 * \@name InfiniteScroll
 * \@description
 * The Infinite Scroll allows you to perform an action when the user
 * scrolls a specified distance from the bottom of the page.
 *
 * The expression assigned to the `infinite` event is called when
 * the user scrolls to the specified distance. When this expression
 * has finished its tasks, it should call the `complete()` method
 * on the infinite scroll instance.
 *
 * \@usage
 * ```html
 * <ion-content>
 *
 *  <ion-list>
 *    <ion-item *ngFor="let i of items">{% raw %}{{i}}{% endraw %}</ion-item>
 *  </ion-list>
 *
 *  <ion-infinite-scroll (ionInfinite)="doInfinite($event)">
 *    <ion-infinite-scroll-content></ion-infinite-scroll-content>
 *  </ion-infinite-scroll>
 *
 * </ion-content>
 * ```
 *
 * ```ts
 * \@Component({...})
 * export class NewsFeedPage {
 *   items = [];
 *
 *   constructor() {
 *     for (let i = 0; i < 30; i++) {
 *       this.items.push( this.items.length );
 *     }
 *   }
 *
 *   doInfinite(infiniteScroll) {
 *     console.log('Begin async operation');
 *
 *     setTimeout(() => {
 *       for (let i = 0; i < 30; i++) {
 *         this.items.push( this.items.length );
 *       }
 *
 *       console.log('Async operation has ended');
 *       infiniteScroll.complete();
 *     }, 500);
 *   }
 *
 * }
 * ```
 *
 *
 * ## Infinite Scroll Content
 *
 * By default, Ionic uses the infinite scroll spinner that looks
 * best for the platform the user is on. However, you can change the
 * default spinner or add text by adding properties to the
 * `ion-infinite-scroll-content` component.
 *
 *  ```html
 *  <ion-content>
 *
 *    <ion-infinite-scroll (ionInfinite)="doInfinite($event)">
 *      <ion-infinite-scroll-content
 *        loadingSpinner="bubbles"
 *        loadingText="Loading more data...">
 *      </ion-infinite-scroll-content>
 *    </ion-infinite-scroll>
 *
 *  </ion-content>
 *  ```
 *
 *
 * ## Further Customizing Infinite Scroll Content
 *
 * The `ion-infinite-scroll` component holds the infinite scroll logic.
 * It requires a child component in order to display the content.
 * Ionic uses `ion-infinite-scroll-content` by default. This component
 * displays the infinite scroll and changes the look depending
 * on the infinite scroll's state. Separating these components allows
 * developers to create their own infinite scroll content components.
 * You could replace our default content with custom SVG or CSS animations.
 *
 * \@demo /docs/v2/demos/src/infinite-scroll/
 *
 */
export class InfiniteScroll {
    /**
     * @param {?} _content
     * @param {?} _zone
     * @param {?} _elementRef
     * @param {?} _dom
     */
    constructor(_content, _zone, _elementRef, _dom) {
        this._content = _content;
        this._zone = _zone;
        this._elementRef = _elementRef;
        this._dom = _dom;
        this._lastCheck = 0;
        this._highestY = 0;
        this._thr = '15%';
        this._thrPx = 0;
        this._thrPc = 0.15;
        this._init = false;
        /**
         * @internal
         */
        this.state = STATE_ENABLED;
        /**
         * @output {event} Emitted when the scroll reaches
         * the threshold distance. From within your infinite handler,
         * you must call the infinite scroll's `complete()` method when
         * your async operation has completed.
         */
        this.ionInfinite = new EventEmitter();
        _content.setElementClass('has-infinite-scroll', true);
    }
    /**
     * \@input {string} The threshold distance from the bottom
     * of the content to call the `infinite` output event when scrolled.
     * The threshold value can be either a percent, or
     * in pixels. For example, use the value of `10%` for the `infinite`
     * output event to get called when the user has scrolled 10%
     * from the bottom of the page. Use the value `100px` when the
     * scroll is within 100 pixels from the bottom of the page.
     * Default is `15%`.
     * @return {?}
     */
    get threshold() {
        return this._thr;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set threshold(val) {
        this._thr = val;
        if (val.indexOf('%') > -1) {
            this._thrPx = 0;
            this._thrPc = (parseFloat(val) / 100);
        }
        else {
            this._thrPx = parseFloat(val);
            this._thrPc = 0;
        }
    }
    /**
     * \@input {boolean} If true, Whether or not the infinite scroll should be
     * enabled or not. Setting to `false` will remove scroll event listeners
     * and hide the display.
     * @param {?} shouldEnable
     * @return {?}
     */
    set enabled(shouldEnable) {
        this.enable(shouldEnable);
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    _onScroll(ev) {
        if (this.state === STATE_LOADING || this.state === STATE_DISABLED) {
            return 1;
        }
        if (this._lastCheck + 32 > ev.timeStamp) {
            // no need to check less than every XXms
            return 2;
        }
        this._lastCheck = ev.timeStamp;
        // ******** DOM READ ****************
        const /** @type {?} */ infiniteHeight = this._elementRef.nativeElement.scrollHeight;
        if (!infiniteHeight) {
            // if there is no height of this element then do nothing
            return 3;
        }
        // ******** DOM READ ****************
        const /** @type {?} */ d = this._content.getContentDimensions();
        let /** @type {?} */ reloadY = d.contentHeight;
        if (this._thrPc) {
            reloadY += (reloadY * this._thrPc);
        }
        else {
            reloadY += this._thrPx;
        }
        // ******** DOM READS ABOVE / DOM WRITES BELOW ****************
        const /** @type {?} */ distanceFromInfinite = ((d.scrollHeight - infiniteHeight) - d.scrollTop) - reloadY;
        if (distanceFromInfinite < 0) {
            // ******** DOM WRITE ****************
            this._dom.write(() => {
                this._zone.run(() => {
                    if (this.state !== STATE_LOADING && this.state !== STATE_DISABLED) {
                        this.state = STATE_LOADING;
                        this.ionInfinite.emit(this);
                    }
                });
            });
            return 5;
        }
        return 6;
    }
    /**
     * Call `complete()` within the `infinite` output event handler when
     * your async operation has completed. For example, the `loading`
     * state is while the app is performing an asynchronous operation,
     * such as receiving more data from an AJAX request to add more items
     * to a data list. Once the data has been received and UI updated, you
     * then call this method to signify that the loading has completed.
     * This method will change the infinite scroll's state from `loading`
     * to `enabled`.
     * @return {?}
     */
    complete() {
        this.state = STATE_ENABLED;
    }
    /**
     * Call `enable(false)` to disable the infinite scroll from actively
     * trying to receive new data while scrolling. This method is useful
     * when it is known that there is no more data that can be added, and
     * the infinite scroll is no longer needed.
     * enabled or not. Setting to `false` will remove scroll event listeners
     * and hide the display.
     * @param {?} shouldEnable
     * @return {?}
     */
    enable(shouldEnable) {
        this.state = (shouldEnable ? STATE_ENABLED : STATE_DISABLED);
        this._setListeners(shouldEnable);
    }
    /**
     * @param {?} shouldListen
     * @return {?}
     */
    _setListeners(shouldListen) {
        if (this._init) {
            if (shouldListen) {
                if (!this._scLsn) {
                    this._scLsn = this._content.ionScroll.subscribe((ev) => {
                        this._onScroll(ev);
                    });
                }
            }
            else {
                this._scLsn && this._scLsn.unsubscribe();
                this._scLsn = null;
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._init = true;
        this._setListeners(this.state !== STATE_DISABLED);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._setListeners(false);
    }
}
InfiniteScroll.decorators = [
    { type: Directive, args: [{
                selector: 'ion-infinite-scroll'
            },] },
];
/** @nocollapse */
InfiniteScroll.ctorParameters = () => [
    { type: Content, decorators: [{ type: Host },] },
    { type: NgZone, },
    { type: ElementRef, },
    { type: DomController, },
];
InfiniteScroll.propDecorators = {
    'threshold': [{ type: Input },],
    'enabled': [{ type: Input },],
    'ionInfinite': [{ type: Output },],
};
function InfiniteScroll_tsickle_Closure_declarations() {
    /** @type {?} */
    InfiniteScroll.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    InfiniteScroll.ctorParameters;
    /** @type {?} */
    InfiniteScroll.propDecorators;
    /** @type {?} */
    InfiniteScroll.prototype._lastCheck;
    /** @type {?} */
    InfiniteScroll.prototype._highestY;
    /** @type {?} */
    InfiniteScroll.prototype._scLsn;
    /** @type {?} */
    InfiniteScroll.prototype._thr;
    /** @type {?} */
    InfiniteScroll.prototype._thrPx;
    /** @type {?} */
    InfiniteScroll.prototype._thrPc;
    /** @type {?} */
    InfiniteScroll.prototype._init;
    /**
     * \@internal
     * @type {?}
     */
    InfiniteScroll.prototype.state;
    /**
     * \@output {event} Emitted when the scroll reaches
     * the threshold distance. From within your infinite handler,
     * you must call the infinite scroll's `complete()` method when
     * your async operation has completed.
     * @type {?}
     */
    InfiniteScroll.prototype.ionInfinite;
    /** @type {?} */
    InfiniteScroll.prototype._content;
    /** @type {?} */
    InfiniteScroll.prototype._zone;
    /** @type {?} */
    InfiniteScroll.prototype._elementRef;
    /** @type {?} */
    InfiniteScroll.prototype._dom;
}
const /** @type {?} */ STATE_ENABLED = 'enabled';
const /** @type {?} */ STATE_DISABLED = 'disabled';
const /** @type {?} */ STATE_LOADING = 'loading';
//# sourceMappingURL=infinite-scroll.js.map