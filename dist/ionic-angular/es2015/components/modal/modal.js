import { Injectable } from '@angular/core';
import { App } from '../app/app';
import { isPresent } from '../../util/util';
import { ModalCmp } from './modal-component';
import { ViewController } from '../../navigation/view-controller';
export class Modal extends ViewController {
    /**
     * @param {?} app
     * @param {?} component
     * @param {?} data
     * @param {?=} opts
     */
    constructor(app, component, data, opts = {}) {
        data = data || {};
        data.component = component;
        opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
        data.opts = opts;
        super(ModalCmp, data, null);
        this._app = app;
        this._enterAnimation = opts.enterAnimation;
        this._leaveAnimation = opts.leaveAnimation;
        this.isOverlay = true;
    }
    /**
     * @param {?} direction
     * @return {?}
     */
    getTransitionName(direction) {
        let /** @type {?} */ key;
        if (direction === 'back') {
            if (this._leaveAnimation) {
                return this._leaveAnimation;
            }
            key = 'modalLeave';
        }
        else {
            if (this._enterAnimation) {
                return this._enterAnimation;
            }
            key = 'modalEnter';
        }
        return this._nav && this._nav.config.get(key);
    }
    /**
     * Present the action sheet instance.
     *
     * @param {?=} navOptions
     * @return {?}
     */
    present(navOptions = {}) {
        navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
        return this._app.present(this, navOptions, 1 /* MODAL */);
    }
}
function Modal_tsickle_Closure_declarations() {
    /** @type {?} */
    Modal.prototype._app;
    /** @type {?} */
    Modal.prototype._enterAnimation;
    /** @type {?} */
    Modal.prototype._leaveAnimation;
}
/**
 * \@name ModalController
 * \@description
 * A Modal is a content pane that goes over the user's current page.
 * Usually it is used for making a choice or editing an item. A modal uses the
 * `NavController` to
 * {\@link /docs/v2/api/components/nav/NavController/#present present}
 * itself in the root nav stack. It is added to the stack similar to how
 * {\@link /docs/v2/api/components/nav/NavController/#push NavController.push}
 * works.
 *
 * When a modal (or any other overlay such as an alert or actionsheet) is
 * "presented" to a nav controller, the overlay is added to the app's root nav.
 * After the modal has been presented, from within the component instance The
 * modal can later be closed or "dismissed" by using the ViewController's
 * `dismiss` method. Additionally, you can dismiss any overlay by using `pop`
 * on the root nav controller. Modals are not reusable. When a modal is dismissed
 * it is destroyed.
 *
 * Data can be passed to a new modal through `Modal.create()` as the second
 * argument. The data can then be accessed from the opened page by injecting
 * `NavParams`. Note that the page, which opened as a modal, has no special
 * "modal" logic within it, but uses `NavParams` no differently than a
 * standard page.
 *
 * \@usage
 * ```ts
 * import { ModalController, NavParams } from 'ionic-angular';
 *
 * \@Component(...)
 * class HomePage {
 *
 *  constructor(public modalCtrl: ModalController) {
 *
 *  }
 *
 *  presentProfileModal() {
 *    let profileModal = this.modalCtrl.create(Profile, { userId: 8675309 });
 *    profileModal.present();
 *  }
 *
 * }
 *
 * \@Component(...)
 * class Profile {
 *
 *  constructor(params: NavParams) {
 *    console.log('UserId', params.get('userId'));
 *  }
 *
 * }
 * ```
 *
 * \@advanced
 *
 * | Option                | Type       | Description                                                                                                      |
 * |-----------------------|------------|------------------------------------------------------------------------------------------------------------------|
 * | showBackdrop          |`boolean`   | Whether to show the backdrop. Default true.                                                                      |
 * | enableBackdropDismiss |`boolean`   | Whether the popover should be dismissed by tapping the backdrop. Default true.                                   |
 *
 * A modal can also emit data, which is useful when it is used to add or edit
 * data. For example, a profile page could slide up in a modal, and on submit,
 * the submit button could pass the updated profile data, then dismiss the
 * modal.
 *
 * ```ts
 * import { Component } from '\@angular/core';
 * import { ModalController, ViewController } from 'ionic-angular';
 *
 * \@Component(...)
 * class HomePage {
 *
 *  constructor(public modalCtrl: ModalController) {
 *
 *  }
 *
 *  presentContactModal() {
 *    let contactModal = this.modalCtrl.create(ContactUs);
 *    contactModal.present();
 *  }
 *
 *  presentProfileModal() {
 *    let profileModal = this.modalCtrl.create(Profile, { userId: 8675309 });
 *    profileModal.onDidDismiss(data => {
 *      console.log(data);
 *    });
 *    profileModal.present();
 *  }
 *
 * }
 *
 * \@Component(...)
 * class Profile {
 *
 *  constructor(public viewCtrl: ViewController) {
 *
 *  }
 *
 *  dismiss() {
 *    let data = { 'foo': 'bar' };
 *    this.viewCtrl.dismiss(data);
 *  }
 *
 * }
 * ```
 * \@demo /docs/v2/demos/src/modal/
 * @see {\@link /docs/v2/components#modals Modal Component Docs}
 */
export class ModalController {
    /**
     * @param {?} _app
     */
    constructor(_app) {
        this._app = _app;
    }
    /**
     * Create a modal to display. See below for options.
     *
     * @param {?} component
     * @param {?=} data
     * @param {?=} opts
     * @return {?}
     */
    create(component, data = {}, opts = {}) {
        return new Modal(this._app, component, data, opts);
    }
}
ModalController.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ModalController.ctorParameters = () => [
    { type: App, },
];
function ModalController_tsickle_Closure_declarations() {
    /** @type {?} */
    ModalController.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ModalController.ctorParameters;
    /** @type {?} */
    ModalController.prototype._app;
}
//# sourceMappingURL=modal.js.map