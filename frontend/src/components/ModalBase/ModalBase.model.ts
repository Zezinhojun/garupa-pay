import { ReactNode } from "react";

export type ModalBaseProps = {
    show: boolean;
    onHide: () => void;
    title: string;
    children?: ReactNode;
    footer?: ReactNode;
};
