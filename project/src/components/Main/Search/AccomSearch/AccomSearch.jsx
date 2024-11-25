import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ChonCard from "../../List/SwiperChonList/ChonCard/ChonCard";
import styles from "./AccomSearch.module.css";
import CardSkeleton from "../../../CardSkeleton/CardSkeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function AccomSearch({ accommodations, isLoading }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

    handleResize();
    window.addEventListener("resize", handleResize);

    // 초기 로딩 상태 해제
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  // 검색 결과가 변경될 때마다 페이지를 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(0);
  }, [accommodations]);

  const pageCount = Math.ceil((accommodations?.length || 0) / itemsPerPage);
  const currentAccommodations = accommodations?.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    // 페이지 변경 시 상단으로 스크롤
  };

  // 로딩 중이거나 초기 로딩 상태일 때 스켈레톤 표시
  if (isLoading || isInitialLoad) {
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

  // 데이터가 없거나 빈 배열일 때
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
        forcePage={currentPage} // 현재 페이지 강제 지정
      />

      <div className={styles.cardContainer}>
        {currentAccommodations?.map((accommodation) => (
          <ChonCard key={accommodation._id} accommodations={accommodation} />
        ))}
      </div>
    </div>
  );
}
