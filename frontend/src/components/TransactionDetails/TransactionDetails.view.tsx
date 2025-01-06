import React from 'react';
import { useTransactionDetailsViewModel } from './TransactionDetails.viewModel.ts';
import { ModalBase } from '../ModalBase/ModalBase.view.tsx';

interface TransactionDetailsModalProps {
  show: boolean;
  onHide: () => void;
  transactionId: string | null;
}
export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ show, onHide, transactionId }) => {
  const {
    loading,
    error,
    formattedAmount,
    formattedCreatedAt,
    formattedDueDate,
    fromAccount,
    toAccount,
    status,
    isValid,
    handleCloseDetails,
  } = useTransactionDetailsViewModel(transactionId);

  if (loading) {
    return (
      <ModalBase show={show} onHide={onHide} title="Carregando...">
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </ModalBase>
    );
  }

  if (error) {
    return (
      <ModalBase show={show} onHide={onHide} title="Erro">
        <div className="p-4 text-red-500">{error}</div>
      </ModalBase>
    );
  }

  if (!isValid) return null;

  return (
    <ModalBase show={show} onHide={onHide} title={`Detalhes da Transação `}>
      <div className="modal-content">
        <p>
          <strong>Transação ID:</strong> {transactionId}
        </p>
        <p>
          <strong>Valor:</strong> {formattedAmount}
        </p>
        <p>
          <strong>Status:</strong> <span className={status.color}>{status.text}</span>
        </p>
        <p>
          <strong>Data Criada:</strong> {formattedCreatedAt}
        </p>
        <p>
          <strong>Data de Vencimento:</strong> {formattedDueDate}
        </p>
        <p>
          <strong>De Conta: </strong>
          {fromAccount.name}
        </p>
        <p>
          {' '}
          <strong>Para Conta: </strong> {toAccount.name}
        </p>
        <button onClick={handleCloseDetails}>Fechar</button>
      </div>
    </ModalBase>
  );
};
