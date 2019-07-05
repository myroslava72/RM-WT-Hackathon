import React from 'react';
import PropTypes from 'prop-types';

const CancellationTerms = ({
  fees, price,
}) => {
  const tableRows = fees.map(fee => (
    <tr key={`fee-${fee.from}-${fee.to}`}>
      <td>
        {fee.from}
        {' '}
&mdash;
        {' '}
        {fee.to}
      </td>
      <td>
        {(price.price * (100 - fee.amount) / 100).toFixed(2)}
        {' '}
        {price.currency}
        {' '}
(
        {100 - fee.amount}
        {' '}
%)
      </td>
    </tr>
  ));
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>If you cancel between</th>
          <th>you will get back</th>
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </table>
  );
};

CancellationTerms.propTypes = {
  fees: PropTypes.instanceOf(Array).isRequired,
  price: PropTypes.instanceOf(Object).isRequired,
};

export default CancellationTerms;
