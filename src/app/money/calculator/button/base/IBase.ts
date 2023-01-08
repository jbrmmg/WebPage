export interface IBase {
    className: string;
    text: string;
    buttonStyle: string;

    buttonClicked();

    handleChange();

    isLinkedKeyPress(keyText: string): boolean;

    isExitButton(): boolean;
}
