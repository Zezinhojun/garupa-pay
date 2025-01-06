import React from 'react';
import { useNewTransactionViewModel } from './NewTransaction.viewmodel.ts';
import { ModalBase } from '../ModalBase/ModalBase.view.tsx';
import { NewTransactionProps } from './NewTransaction.model.ts';

export const NewTransaction: React.FC<NewTransactionProps> = ({ show, onHide, loggedInAccountId, toAccountId }) => {
  const { formState, errorMessage, handleInputChange, handleSubmit } = useNewTransactionViewModel(
    loggedInAccountId,
    toAccountId,
    onHide,
  );

  return (
    <ModalBase show={show} onHide={onHide} title="Nova Transação">
      <div className="mb-3">
        <label htmlFor="amount" className="form-label">
          Amount
        </label>
        <input
          type="number"
          className="form-control"
          id="amount"
          value={formState.amount}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="dueDate" className="form-label">
          Due Date (Optional)
        </label>
        <input
          type="date"
          className="form-control"
          id="dueDate"
          value={formState.dueDate || ''}
          onChange={handleInputChange}
        />
      </div>

      {errorMessage && <div className="text-danger mb-2">{errorMessage}</div>}

      <button type="button" className="btn btn-primary" onClick={handleSubmit}>
        Add Transaction
      </button>
    </ModalBase>
  );
};
