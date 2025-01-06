import React from 'react';
import HeaderView from '../../components/Header/Header.view.tsx';
import CardList from '../../components/CardList/CardList.view.tsx';
import AccountCardView from '../../components/AccountCard/AccountCard.view.tsx';
import { useHomeViewModel } from './Home.viewmodel.ts';
import TransactionCard from '../../components/TransactionCard/TransactionCard.view.tsx';
import { TransactionDetailsModal } from '../../components/TransactionDetails/TransactionDetails.view.tsx';
import { NewTransaction } from '../../components/NewTransaction/NewTransaction.view.tsx';

const HomeView: React.FC = () => {
  const {
    otherAccounts,
    accountTransactions,
    loading,
    error,
    loggedInAccountId,
    loggedInAccountName,
    currentTransactionId,
    showTransactionDetails,
    showNewTransactionModal,
    selectedAccountId,
    handleDetails,
    handleAddTransaction,
    handleHideTransactionDetails,
    handleHideNewTransaction,
    onLogout,
  } = useHomeViewModel();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <>
      <HeaderView loggedInAccountName={loggedInAccountName} onLogout={onLogout} />
      <main>
        <section className="l-side">
          <CardList
            items={otherAccounts}
            renderItem={(otherAccounts) => (
              <AccountCardView key={otherAccounts.id} account={otherAccounts} onAddTransaction={handleAddTransaction} />
            )}
          />
        </section>
        <section className="r-side">
          <div className="transaction-list">
            {accountTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} onDetails={handleDetails} />
            ))}
          </div>
        </section>
      </main>

      <TransactionDetailsModal
        show={showTransactionDetails}
        onHide={handleHideTransactionDetails}
        transactionId={currentTransactionId}
      />

      <NewTransaction
        show={showNewTransactionModal}
        onHide={handleHideNewTransaction}
        loggedInAccountId={loggedInAccountId || ''}
        toAccountId={selectedAccountId || ''}
      />
    </>
  );
};

export default HomeView;
