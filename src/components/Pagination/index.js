import React, { useState } from 'react';
import { ArrowForwardIos, ArrowBackIos } from '@material-ui/icons';

import styles from './index.module.css';

const Pagination = (props) => {
    const {
        totalPages = 1,
        currentPage = 1,
        updatePage = () => {}
    } = props;

    const notNextSlide = () => {
        if((currentSlide+1)*10 + 1 > totalPages){
            return true;
        }
        return false;
    }

    const nextSlide = () => {
        if(notNextSlide()){
            return;
        }
        updateActive((currentSlide+1)*10 + 1);
        updateCurrentSlide(currentSlide+1);
        updatePage((currentSlide+1)*10 + 1);
    }

    const previousSlide = () => {
        if(currentSlide === 0){
            return;
        }
        updateActive((currentSlide-1)*10 + 1);
        updateCurrentSlide(currentSlide-1);
        updatePage((currentSlide-1)*10 + 1);
    }

    const nextPage = () => {
        if(active === totalPages){
            return;
        }
        if(active+1 > (currentSlide+1)*10){
            updateCurrentSlide(currentSlide+1);
        }
        updateActive(active+1);
        updatePage(active+1);
    }
    
    const previousPage = () => {
        if(active === 1){
            return;
        }
        if(active-1 <= (currentSlide)*10){
            updateCurrentSlide(currentSlide-1);
        } 
       updateActive(active-1);
       updatePage(active-1);
    }

    const [currentSlide, updateCurrentSlide] = useState(Math.floor(currentPage/10) + (currentPage%10 ? 1 : 0) -1);
    const [active, updateActive] = useState(currentPage);

    const arrayOfNumbers = [];

    for (var i = 1; i <= 10; i++) {
        if(currentSlide * 10 + i > totalPages){
          break;
        }
        arrayOfNumbers.push(currentSlide * 10 + i);
    }

    return (
        <div className={styles.container}>
            <div className={currentSlide === 0 ? styles.pageBlock + ' ' + styles.disabled : styles.pageBlock} onClick={previousSlide}>
                {<ArrowBackIos className={styles.icon}  />}
                {<ArrowBackIos className={styles.icon} />}
            </div>
            <div className={active <= 1 ? styles.pageBlock + ' ' + styles.disabled : styles.pageBlock} onClick={previousPage}>
                {<ArrowBackIos className={styles.icon} />}
            </div>
                {arrayOfNumbers.map((number) => {
                    return (
                        <div className={number === active ? styles.pageBlock + ' ' + styles.activePageBlock : styles.pageBlock}
                          onClick={() => { updateActive(number); updatePage(number);}}
                          key={number}
                        >
                            {number}
                        </div>
                    )
                })}
            <div className={active >= totalPages ? styles.pageBlock + ' ' + styles.disabled : styles.pageBlock} onClick={nextPage}>
                {<ArrowForwardIos className={styles.icon} />}
            </div>
            <div className={notNextSlide() ? styles.pageBlock + ' ' + styles.disabled : styles.pageBlock} onClick={nextSlide}>
                {<ArrowForwardIos className={styles.icon} />}
                {<ArrowForwardIos className={styles.icon} />}
            </div>
        </div>
    )
}

export default Pagination;