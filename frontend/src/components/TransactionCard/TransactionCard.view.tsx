import React from 'react';
import { TransactionCardProps } from './TransactionCard.model.ts';
import { useTransactionCardViewModel } from './TransactionCard.viewmodel.ts';
import { Card, Button } from 'react-bootstrap';

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onDetails,
}) => {
  const { formattedStatus, borderColor } =
    useTransactionCardViewModel(transaction);

  return (
    <Card style={{ borderColor, borderWidth: '2px', marginBottom: '0.5rem' }}>
      <Card.Body>
        <Card.Text>
          <strong>From:</strong> {transaction.fromAccountName} <br />
          <strong>To:</strong> {transaction.toAccountName} <br />
          <strong>Amount:</strong> ${transaction.amount.toFixed(2)} <br />
          <strong>Status:</strong>{' '}
          <span style={{ color: formattedStatus.color }}>
            {formattedStatus.text}
          </span>
        </Card.Text>
        <Button variant="primary" onClick={() => onDetails(transaction.id)}>
          Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TransactionCard;
