import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HeaderModel } from './Header.model.ts';

const HeaderView: React.FC<HeaderModel> = ({ loggedInAccountName, onLogout }) => {
  return (
    <Container>
      <Row className="w-100">
        <Col xs={12} sm={6} md={6} className="text-center d-none d-sm-block">
          <h3>{loggedInAccountName}</h3>
        </Col>

        <Col xs={12} sm={6} md={6} className="text-center">
          <span
            style={{
              color: 'red',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={onLogout}
          >
            Alterar conta
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default HeaderView;
