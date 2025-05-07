import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Pagination } from "react-bootstrap";

const Pages = observer(() => {
  const { device } = useContext(Context);

  const pageCount = Math.ceil(device.totalCount / device.limit);
  const pages = [];

  // Создание массива с номерами страниц
  for (let i = 1; i <= pageCount; i++) {
    pages.push(i);
  }

  return (
    <Pagination className="pagination-custom">
      {/* Стрелка "Предыдущая" */}
      <Pagination.Prev
        onClick={() => device.page > 1 && device.setPage(device.page - 1)}
        disabled={device.page === 1}
      />

      {/* Страницы */}
      {pages.map(page => (
        <Pagination.Item
          key={page}
          active={device.page === page}
          onClick={() => device.setPage(page)}
        >
          {page}
        </Pagination.Item>
      ))}

      {/* Стрелка "Следующая" */}
      <Pagination.Next
        onClick={() => device.page < pageCount && device.setPage(device.page + 1)}
        disabled={device.page === pageCount}
      />
    </Pagination>
  );
});

export default Pages;
