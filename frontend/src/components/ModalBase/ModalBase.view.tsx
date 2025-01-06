import { Modal } from "react-bootstrap"
import React from "react"
import { ModalBaseProps } from "./ModalBase.model"

export const ModalBase: React.FC<ModalBaseProps> = ({
    show, onHide, title, children, footer
}) =>{
    return(
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            {footer &&
             <Modal.Footer> {footer} </Modal.Footer>
            }
        </Modal>
    )
}