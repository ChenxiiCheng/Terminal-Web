import * as React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { formatter } from '../utils';

export default function ModalTable({ data }) {
  const [tableColNames] = React.useState(data[0]);
  const [tableData] = React.useState(data.slice(1));

  return (
    <Table variant="simple" size="lg">
      <Thead>
        <Tr>
          {tableColNames &&
            Object.keys(tableColNames).map(name => <Th key={name}>{name}</Th>)}
        </Tr>
      </Thead>
      <Tbody>
        {tableData.length &&
          tableData.map((item, itemIndex) => (
            <Tr key={itemIndex}>
              {Object.keys(item).map((key, keyIndex) => (
                <Td key={itemIndex + keyIndex}>
                  {key === 'Amount' ? formatter.format(item[key]) : item[key]}
                </Td>
              ))}
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
}
