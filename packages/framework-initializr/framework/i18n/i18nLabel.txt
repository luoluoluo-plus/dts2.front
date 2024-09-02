import { i18nMgr } from "./i18nMgr";
const { ccclass, property, executeInEditMode, disallowMultiple, menu } = cc._decorator;

@ccclass
@executeInEditMode
@disallowMultiple
@menu("多语言/i18nLabel")
export class i18nLabel extends cc.Label {
    @property({ type: cc.String })
    get i18n_key() {
        return this.i18n_string;
    }

    set i18n_key(value: string) {
        this.i18n_string = value;

        this.setEndValue()
    }

    @property({ type: [cc.String] })
    get params() {
        return this.i18n_params;
    }

    set params(value: string[]) {
        this.i18n_params = value;

        this.setEndValue()
    }

    @property({ visible: false })
    private i18n_string: string = "";

    @property({ visible: false })
    private i18n_params: string[] = [];

    start() {
        i18nMgr._addOrDelLabel(this, true);
        this._resetValue();
    }

    init(...params: any[]) {
        if(this.params.length == 0){
            this.i18n_string = String(params[0]);
        }else if(params.length >= 1){
            this.i18n_params = params;
        }

        this.setEndValue()
    }

    private setEndValue() {
        if(this.i18n_string){
            this.string = i18nMgr._getLabel(this.i18n_string, this.i18n_params);
        }
    }

    _resetValue() {
        this.i18n_key = this.i18n_string;
    }

    onDestroy() {
        i18nMgr._addOrDelLabel(this, false);
    }
}

