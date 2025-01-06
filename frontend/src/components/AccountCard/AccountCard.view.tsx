import React from "react";
import { useAccountCardViewModel } from "./AccountCard.viewmodel.ts";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { CardAccountProps } from "./AccountCard.model.ts";

const AccountCardView: React.FC<CardAccountProps> = ({ account, onAddTransaction }) => {
    const { name, id, balance } = account;
    const { statusColor, statusText, avatarUrl } = useAccountCardViewModel(account);

    return (
        <Card className="account-card d-flex align-items-center gap-2 ">
            <Row className="w-100 align-items-center">
                <Col xs="auto" className="d-flex justify-content-center">
                    <Image
                        src={avatarUrl}
                        roundedCircle
                        width={40}
                        height={40}
                    />
                </Col>

                <Col className="d-flex flex-column text-center">
                    <p className="m-0"><strong>{name}</strong></p>
                    <strong>Amount:</strong> ${balance.toFixed(2)} <br />
                    <p style={{ color: statusColor }}>Status: {statusText}</p>
                </Col>

                <Col xs="auto">
                    <Button variant="primary"
                        onClick={() => onAddTransaction(id)}>
                        +
                    </Button>
                </Col>
            </Row>
        </Card>
    );
}

export default AccountCardView