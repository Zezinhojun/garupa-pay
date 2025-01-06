import React from 'react';
import { CardListProps } from './CardList.model';
import { useCardListViewModel } from './CardList.viewmodel.ts';
import { Container } from 'react-bootstrap';

const CardList: React.FC<CardListProps<any>> = ({ items, renderItem }) => {
  const { isEmpty } = useCardListViewModel(items);

  if (isEmpty) {
    return <div>No items to display</div>;
  }

  return (
    <Container fluid className="w-100 p-0 m-0">
      <div>
        {items.map((item, index) => (
          <div key={index} className="card-list-item">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default CardList;
