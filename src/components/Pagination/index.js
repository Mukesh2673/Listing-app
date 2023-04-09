import React from "react";

import {
  Form,
  FormControl,
  Button,
  Table,
  Modal,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "react-bootstrap";

const CustomPagination = (props) => {
  const { limit, pages, currentPage, PaginationHandleClick } = props;

  let arr = [];
  if (pages <= 5) {
    for (let i = 0; i < pages; i++) {
      arr.push({
        offSet: i * limit,
        page: i + 1,
      });
    }
  } else if (pages >= 5 && currentPage <= 4) {
    for (let i = 0; i <= 4; i++) {
      arr.push({
        offSet: i * limit,
        page: i + 1,
      });
    }

    arr.push({
      offSet: "...",
      page: "...",
    });

    arr.push({
      offSet: (pages - 1) * limit,
      page: pages,
    });
  } else if (pages >= 5 && currentPage >= 5 && currentPage <= pages - 4) {
    arr.push({
      offSet: 0,
      page: 1,
    });

    arr.push({
      offSet: "...",
      page: "...",
    });

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      arr.push({
        offSet: (i - 1) * limit,
        page: i,
      });
    }

    arr.push({
      offSet: "...",
      page: "...",
    });

    arr.push({
      offSet: (pages - 1) * limit,
      page: pages,
    });
  } else {
    arr.push({
      offSet: 0,
      page: 1,
    });

    arr.push({
      offSet: "...",
      page: "...",
    });

    for (let i = pages - 4; i <= pages; i++) {
      arr.push({
        offSet: (i - 1) * limit,
        page: i,
      });
    }
  }

  return (
    <>
      <div className="paginationWrapper">
        <Pagination>
          <Pagination.Prev
            disabled={currentPage == 1}
            onClick={() =>
              PaginationHandleClick((currentPage - 2) * limit, currentPage - 1)
            }
          />

          {arr.map((item, i) => {
            return item.page === currentPage ? (
              <Pagination.Item
                disabled={item.page === "..."}
                className="active"
                onClick={() => PaginationHandleClick(item.offSet, item.page)}
                key={i}
              >
                {item.page}
              </Pagination.Item>
            ) : (
              <Pagination.Item
                disabled={item.page === "..."}
                onClick={() => PaginationHandleClick(item.offSet, item.page)}
                key={i}
              >
                {item.page}
              </Pagination.Item>
            );
          })}

          <Pagination.Next
            disabled={currentPage == pages}
            onClick={() =>
              PaginationHandleClick(currentPage * limit, currentPage + 1)
            }
          />
        </Pagination>
      </div>
    </>
  );
};

export default CustomPagination;
