import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ChonCard from "../../List/SwiperChonList/ChonCard/ChonCard";
import styles from "./AccomSearch.module.css";
import CardSkeleton from "../../../CardSkeleton/CardSkeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function AccomSearch({ accommodations, isLoading }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // 화면 크기에 따라 itemsPerPage 조절
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 1000) {
        setItemsPerPage(4);
      } else if (width > 710) {
        setItemsPerPage(3);
      } else if (width > 400) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    // 초기 실행
    handleResize();

    // resize 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 전체 페이지 수 계산
  const pageCount = Math.ceil(accommodations?.length / itemsPerPage);

  // 현재 페이지에 표시할 숙소 데이터
  const currentAccommodations = accommodations?.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (isLoading) {
    return (
      <div className={styles.skeleton_container}>
        <div className={styles.container}>
          <div className={styles.cardContainer}>
            {Array(itemsPerPage)
              .fill(null)
              .map((_, index) => (
                <CardSkeleton key={`skeleton-${index}`} />
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (!accommodations || accommodations.length === 0) {
    return <div className={styles.empty_text}>검색된 숙소가 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <ReactPaginate
        previousLabel={null}
        nextLabel={null}
        pageCount={pageCount}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={handlePageChange}
        containerClassName={styles.pagination}
        activeClassName={styles.active}
        previousClassName={styles.navButton}
        nextClassName={styles.navButton}
        disabledClassName={styles.disabled}
        pageClassName={styles.pageItem}
      />

      <div className={styles.cardContainer}>
        {currentAccommodations.map((accommodation) => (
          <ChonCard key={accommodation._id} accommodations={accommodation} />
        ))}
      </div>
    </div>
  );
}
